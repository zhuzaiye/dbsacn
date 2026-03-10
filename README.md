# DBScan - Multi-Database Management Application

Enterprise-level Vue3 application for managing multiple database connections with SQL query capabilities.

## Project Structure

```
src/
├── components/          # Vue components
│   ├── layout/         # Layout components (TopNavBar, StatusBar)
│   ├── editor/         # SQL editor components
│   ├── result/         # Query result display components
│   ├── chat/           # AI chat panel components
│   └── sidebar/        # Sidebar content components
├── stores/             # Pinia stores for state management
│   ├── layout.ts       # Layout state (theme, sidebar, tabs)
│   ├── editor.ts       # SQL editor state (tabs, content, history)
│   ├── database.ts     # Database connections state
│   ├── chat.ts         # AI chat sessions state
│   └── result.ts       # Query results state
├── types/              # TypeScript type definitions
│   ├── index.ts        # Common types
│   ├── layout.ts       # Layout types
│   ├── editor.ts       # Editor types
│   ├── database.ts     # Database types
│   └── chat.ts         # Chat types
├── composables/        # Vue composables
│   ├── useTheme.ts     # Theme management
│   └── useMonaco.ts    # Monaco editor composable
├── utils/              # Utility functions
│   └── index.ts        # Common utilities
├── styles/             # Global styles
│   └── main.css        # Main stylesheet
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## Features

- **Multi-Database Support**: Manage connections to MySQL, PostgreSQL, SQLite, SQL Server, ClickHouse
- **SQL Editor**: Monaco-based SQL editor with syntax highlighting
- **Query Results**: Display results in Data/Chart/Logs tabs
- **AI Chat**: Integrated AI assistant for SQL generation
- **Query History**: Track and search query history
- **Dark/Light Theme**: Theme switching support
- **Responsive Layout**: Adjustable split panes for optimal workspace

## Layout Structure

The application follows the agx.app layout design:

1. **Top Navigation Bar**: Sources, Queries, History tabs + Search
2. **Left Sidebar**: Context-aware content based on active tab
3. **Main Editor Area**: 
   - SQL Editor with tabs and toolbar
   - Result panel (Data/Chart/Logs)
4. **Right Chat Panel**: AI assistant for SQL queries
5. **Status Bar**: Build info and theme toggle

## Technology Stack

- Vue 3 (Composition API)
- Naive UI (Component library)
- Monaco Editor (SQL editor)
- Pinia (State management)
- TypeScript
- Vite
