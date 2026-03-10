<template>
  <div class="sources-panel">
    <!-- 搜索框 -->
    <div class="search-box">
      <n-input
        v-model:value="searchValue"
        placeholder="Search..."
        clearable
        size="small"
      >
        <template #prefix>
          <n-icon><SearchOutline /></n-icon>
        </template>
      </n-input>
    </div>

    <!-- 内容区域 -->
    <div class="sources-content">
      <!-- Sources 内容 -->
      <template v-if="activeTab === 'sources'">
        <n-tree
          v-if="treeData.length > 0"
          :data="treeData"
          :default-expand-all="false"
          block-line
          @update:selected-keys="handleNodeSelect"
        />
        <n-empty
          v-else
          description="No data sources"
          style="margin-top: 40px"
        />
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NInput, NIcon, NTree, NEmpty } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { useDatabaseStore } from '@/stores/database'
import type { DatabaseNode } from '@/types/database'

const databaseStore = useDatabaseStore()
const searchValue = ref('')
const activeTab = ref<'sources'>('sources')

// 将DatabaseNode转换为NTree需要的格式
function convertToTreeData(nodes: DatabaseNode[]): any[] {
  return nodes.map(node => {
    // 根据节点类型添加图标前缀
    let label = node.name
    if (node.type === 'database' || node.type === 'schema') {
      label = `📊 ${node.name}`
    } else if (node.type === 'table') {
      label = `📋 ${node.name}`
    } else if (node.type === 'column') {
      label = `  ${node.name}`
    }
    
    // 如果有类型元数据，添加到标签
    if (node.metadata?.type) {
      label += ` (${node.metadata.type})`
    }
    
    const treeNode: any = {
      key: node.id,
      label: label,
      type: node.type,
      metadata: node.metadata
    }
    if (node.children && node.children.length > 0) {
      treeNode.children = convertToTreeData(node.children)
    }
    return treeNode
  })
}

// 过滤树形结构
const filteredTree = computed(() => {
  if (!searchValue.value) {
    return databaseStore.databaseTree
  }
  
  const query = searchValue.value.toLowerCase()
  const filterNode = (node: DatabaseNode): DatabaseNode | null => {
    const matches = node.name.toLowerCase().includes(query)
    const filteredChildren = node.children
      ? node.children.map(filterNode).filter((n): n is DatabaseNode => n !== null)
      : []
    
    if (matches || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      }
    }
    return null
  }
  
  return databaseStore.databaseTree
    .map(filterNode)
    .filter((n): n is DatabaseNode => n !== null)
})

// 转换为NTree组件需要的数据格式
const treeData = computed(() => {
  return convertToTreeData(filteredTree.value)
})

watch(searchValue, (value) => {
  databaseStore.setSearchQuery(value || '')
})

function handleNodeSelect(keys: Array<string | number>) {
  // TODO: Handle node selection
  console.log('Selected node:', keys)
}
</script>

<style scoped>
.sources-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-right: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
}

/* 搜索框 */
.search-box {
  padding: 12px;
  border-bottom: 1px solid var(--divider-color);
}

/* 内容区域 */
.sources-content {
  flex: 1;
  overflow: auto;
  padding: 8px;
  background-color: var(--content-bg);
}

.connection-toggle {
  display: flex;
  align-items: center;
  background-color: var(--hover-color);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

.toggle-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--text-color-secondary);
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.toggle-btn:hover {
  color: var(--text-color);
}

.toggle-btn.active {
  background-color: var(--primary-color);
  color: #fff;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.node-label {
  font-size: 13px;
  color: var(--text-color);
}
</style>
