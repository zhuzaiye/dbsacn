use std::collections::HashMap;
use std::sync::Mutex;

use once_cell::sync::Lazy;
use rusqlite::types::ValueRef;
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};

static CONNECTIONS: Lazy<Mutex<HashMap<String, ConnectionConfig>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionConfig {
    pub name: String,
    pub db_type: String,
    pub host: String,
    pub port: u16,
    pub database: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TestResult {
    pub success: bool,
    pub message: String,
    pub server_version: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueryResult {
    pub columns: Vec<String>,
    pub rows: Vec<Vec<Value>>,
    pub row_count: usize,
    pub execution_time: Option<u128>,
}

#[derive(Debug, Serialize)]
pub struct DatabaseNode {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub children: Option<Vec<DatabaseNode>>,
    pub metadata: Option<Map<String, Value>>,
}

#[tauri::command]
async fn test_connection(config: ConnectionConfig) -> Result<TestResult, String> {
    match config.db_type.as_str() {
        "sqlite" => test_sqlite(&config).await,
        "mysql" | "postgresql" => Ok(TestResult {
            success: false,
            message: format!(
                "{} support is planned but not implemented yet. Use SQLite for now.",
                config.db_type
            ),
            server_version: None,
        }),
        _ => Err("Unsupported database type".to_string()),
    }
}

#[tauri::command]
async fn connect(connection_id: String, config: ConnectionConfig) -> Result<bool, String> {
    if config.db_type != "sqlite" {
        return Err(format!(
            "Database type '{}' is not supported yet. Only sqlite is currently supported.",
            config.db_type
        ));
    }

    Connection::open(&config.database)
        .map_err(|e| format!("Failed to open SQLite database '{}': {e}", config.database))?;

    let mut registry = CONNECTIONS
        .lock()
        .map_err(|_| "Connection registry lock poisoned".to_string())?;
    registry.insert(connection_id, config);
    Ok(true)
}

#[tauri::command]
async fn disconnect(connection_id: String) -> Result<(), String> {
    let mut registry = CONNECTIONS
        .lock()
        .map_err(|_| "Connection registry lock poisoned".to_string())?;
    registry.remove(&connection_id);
    Ok(())
}

#[tauri::command]
async fn execute_query(connection_id: String, sql: String) -> Result<QueryResult, String> {
    let config = get_connection_config(&connection_id)?;
    if config.db_type != "sqlite" {
        return Err(format!(
            "Database type '{}' is not supported yet. Only sqlite is currently supported.",
            config.db_type
        ));
    }

    let started = std::time::Instant::now();
    let conn = Connection::open(&config.database)
        .map_err(|e| format!("Failed to open SQLite database '{}': {e}", config.database))?;

    let trimmed = sql.trim();
    if trimmed.is_empty() {
        return Err("SQL cannot be empty".to_string());
    }

    if is_query_statement(trimmed) {
        let mut stmt = conn
            .prepare(trimmed)
            .map_err(|e| format!("Failed to prepare SQL: {e}"))?;

        let columns = stmt
            .column_names()
            .iter()
            .map(|s| s.to_string())
            .collect::<Vec<_>>();

        let mut rows_out: Vec<Vec<Value>> = Vec::new();
        let mut rows = stmt
            .query([])
            .map_err(|e| format!("Failed to execute query: {e}"))?;

        while let Some(row) = rows
            .next()
            .map_err(|e| format!("Failed to read query rows: {e}"))?
        {
            let mut out_row = Vec::with_capacity(columns.len());
            for idx in 0..columns.len() {
                let value = row
                    .get_ref(idx)
                    .map(sqlite_value_to_json)
                    .map_err(|e| format!("Failed to read column at index {idx}: {e}"))?;
                out_row.push(value);
            }
            rows_out.push(out_row);
        }

        Ok(QueryResult {
            columns,
            row_count: rows_out.len(),
            rows: rows_out,
            execution_time: Some(started.elapsed().as_millis()),
        })
    } else {
        conn.execute_batch(trimmed)
            .map_err(|e| format!("Failed to execute statement: {e}"))?;

        Ok(QueryResult {
            columns: vec!["status".to_string()],
            rows: vec![vec![json!("ok")]],
            row_count: 0,
            execution_time: Some(started.elapsed().as_millis()),
        })
    }
}

#[tauri::command]
async fn fetch_schema(connection_id: String) -> Result<Vec<DatabaseNode>, String> {
    let config = get_connection_config(&connection_id)?;
    if config.db_type != "sqlite" {
        return Err(format!(
            "Database type '{}' is not supported yet. Only sqlite is currently supported.",
            config.db_type
        ));
    }

    let conn = Connection::open(&config.database)
        .map_err(|e| format!("Failed to open SQLite database '{}': {e}", config.database))?;

    let mut table_stmt = conn
        .prepare(
            "SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name",
        )
        .map_err(|e| format!("Failed to read sqlite_master: {e}"))?;

    let table_rows = table_stmt
        .query_map([], |row| {
            Ok((
                row.get::<usize, String>(0)?,
                row.get::<usize, String>(1)?,
            ))
        })
        .map_err(|e| format!("Failed to map schema rows: {e}"))?;

    let mut table_nodes: Vec<DatabaseNode> = Vec::new();

    for row in table_rows {
        let (table_name, object_type) = row.map_err(|e| format!("Failed to parse schema row: {e}"))?;

        let pragma_sql = format!("PRAGMA table_info('{}')", table_name.replace('\'', "''"));
        let mut col_stmt = conn
            .prepare(&pragma_sql)
            .map_err(|e| format!("Failed to inspect table '{}': {e}", table_name))?;

        let col_rows = col_stmt
            .query_map([], |col| {
                let col_name: String = col.get(1)?;
                let col_type: String = col.get::<usize, Option<String>>(2)?.unwrap_or_default();
                let notnull: i64 = col.get(3)?;
                Ok((col_name, col_type, notnull == 1))
            })
            .map_err(|e| format!("Failed to map columns for '{}': {e}", table_name))?;

        let mut columns: Vec<DatabaseNode> = Vec::new();
        for col in col_rows {
            let (name, data_type, not_null) =
                col.map_err(|e| format!("Failed to parse column for '{}': {e}", table_name))?;
            let mut metadata = Map::new();
            metadata.insert("type".to_string(), json!(data_type));
            metadata.insert("notNull".to_string(), json!(not_null));

            columns.push(DatabaseNode {
                id: format!("column:{}:{}", table_name, name),
                name,
                node_type: "column".to_string(),
                children: None,
                metadata: Some(metadata),
            });
        }

        let mut table_meta = Map::new();
        table_meta.insert("kind".to_string(), json!(object_type));

        table_nodes.push(DatabaseNode {
            id: format!("table:{table_name}"),
            name: table_name,
            node_type: "table".to_string(),
            children: Some(columns),
            metadata: Some(table_meta),
        });
    }

    let root = DatabaseNode {
        id: format!("database:{}", config.database),
        name: config.name,
        node_type: "database".to_string(),
        children: Some(table_nodes),
        metadata: None,
    };

    Ok(vec![root])
}

fn get_connection_config(connection_id: &str) -> Result<ConnectionConfig, String> {
    let registry = CONNECTIONS
        .lock()
        .map_err(|_| "Connection registry lock poisoned".to_string())?;

    registry
        .get(connection_id)
        .cloned()
        .ok_or_else(|| format!("Connection '{connection_id}' is not connected"))
}

fn is_query_statement(sql: &str) -> bool {
    let lowered = sql.trim_start().to_ascii_lowercase();
    lowered.starts_with("select")
        || lowered.starts_with("with")
        || lowered.starts_with("pragma")
        || lowered.starts_with("explain")
}

fn sqlite_value_to_json(value: ValueRef<'_>) -> Value {
    match value {
        ValueRef::Null => Value::Null,
        ValueRef::Integer(v) => json!(v),
        ValueRef::Real(v) => json!(v),
        ValueRef::Text(v) => json!(String::from_utf8_lossy(v).to_string()),
        ValueRef::Blob(v) => json!(format!("<blob:{} bytes>", v.len())),
    }
}

async fn test_sqlite(config: &ConnectionConfig) -> Result<TestResult, String> {
    let conn = Connection::open(&config.database)
        .map_err(|e| format!("Failed to open SQLite database '{}': {e}", config.database))?;

    let version: String = conn
        .query_row("SELECT sqlite_version()", [], |row| row.get(0))
        .map_err(|e| format!("Failed to query SQLite version: {e}"))?;

    Ok(TestResult {
        success: true,
        message: format!("SQLite connection successful: {}", config.database),
        server_version: Some(version),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            test_connection,
            connect,
            disconnect,
            execute_query,
            fetch_schema
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
