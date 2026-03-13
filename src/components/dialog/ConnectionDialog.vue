<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="isEdit ? 'Edit Connection' : 'New Connection'"
    style="width: 550px"
    :mask-closable="!saving"
    :closable="!saving"
  >
    <n-form ref="formRef" :model="formData" :rules="rules">
      <n-form-item label="Connection Name" path="name">
        <n-input v-model:value="formData.name" placeholder="My Database" />
      </n-form-item>

      <n-form-item label="Database Type" path="type">
        <n-select v-model:value="formData.type" :options="dbTypeOptions" />
      </n-form-item>

      <n-row :gutter="16">
        <n-col :span="16">
          <n-form-item label="Host" path="host">
            <n-input v-model:value="formData.host" placeholder="localhost" />
          </n-form-item>
        </n-col>
        <n-col :span="8">
          <n-form-item label="Port" path="port">
            <n-input-number
              v-model:value="formData.port"
              :min="1"
              :max="65535"
              style="width: 100%"
            />
          </n-form-item>
        </n-col>
      </n-row>

      <n-form-item label="Database" path="database">
        <n-input v-model:value="formData.database" placeholder="mydb" />
      </n-form-item>

      <n-row :gutter="16">
        <n-col :span="12">
          <n-form-item label="Username" path="username">
            <n-input v-model:value="formData.username" placeholder="root" />
          </n-form-item>
        </n-col>
        <n-col :span="12">
          <n-form-item label="Password" path="password">
            <n-input v-model:value="formData.password" type="password" placeholder="••••••" />
          </n-form-item>
        </n-col>
      </n-row>

      <n-divider />

      <n-space justify="space-between" align="center">
        <n-button :loading="testing" @click="handleTest">
          <template #icon>
            <n-icon><FlashOutline /></n-icon>
          </template>
          Test Connection
        </n-button>
        <n-text v-if="testResult" :type="testResult.success ? 'success' : 'error'">
          {{ testResult.message }}
        </n-text>
      </n-space>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button :disabled="saving" @click="handleCancel">Cancel</n-button>
        <n-button type="primary" :loading="saving" @click="handleSave">
          {{ isEdit ? 'Update' : 'Create' }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NText,
  NRow,
  NCol,
  NInputNumber,
  NDivider,
  NIcon
} from 'naive-ui'
import { FlashOutline } from '@vicons/ionicons5'
import { useDatabaseStore } from '@/stores/database'
import { databaseService, type TestResult } from '@/services/database'
import type { DatabaseConnection } from '@/types/database'

const props = defineProps<{
  show: boolean
  editId?: string
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'saved'): void
}>()

const databaseStore = useDatabaseStore()

const showModal = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
})

const isEdit = computed(() => !!props.editId)

const defaultFormData = {
  name: '',
  type: 'mysql' as DatabaseConnection['type'],
  host: 'localhost',
  port: 3306,
  database: '',
  username: '',
  password: ''
}

const formData = ref({ ...defaultFormData })

const testing = ref(false)
const saving = ref(false)
const testResult = ref<TestResult | null>(null)

const dbTypeOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQLite', value: 'sqlite' }
]

const defaultPorts: Record<string, number> = {
  mysql: 3306,
  postgresql: 5432,
  sqlite: 0
}

const rules = {
  name: { required: true, message: 'Please enter connection name', trigger: 'blur' },
  type: { required: true, message: 'Please select database type', trigger: 'change' },
  host: { required: true, message: 'Please enter host', trigger: 'blur' },
  port: { required: true, message: 'Please enter port', trigger: 'blur' },
  database: { required: true, message: 'Please enter database name', trigger: 'blur' }
}

watch(() => props.show, (show) => {
  if (show) {
    testResult.value = null
    if (props.editId) {
      const conn = databaseStore.connections.find(c => c.id === props.editId)
      if (conn) {
        formData.value = {
          name: conn.name,
          type: conn.type,
          host: conn.host,
          port: conn.port,
          database: conn.database,
          username: conn.username,
          password: conn.password || ''
        }
      }
    } else {
      formData.value = { ...defaultFormData }
    }
  }
})

watch(() => formData.value.type, (type) => {
  if (defaultPorts[type] !== undefined) {
    formData.value.port = defaultPorts[type]
  }
})

async function handleTest() {
  testing.value = true
  testResult.value = null
  try {
    testResult.value = await databaseService.testConnection({
      name: formData.value.name,
      type: formData.value.type,
      host: formData.value.host,
      port: formData.value.port,
      database: formData.value.database,
      username: formData.value.username,
      password: formData.value.password
    })
  } catch (e: unknown) {
    const error = e as Error
    testResult.value = { success: false, message: error.message }
  } finally {
    testing.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value && props.editId) {
      await databaseStore.updateConnection(props.editId, {
        name: formData.value.name,
        type: formData.value.type,
        host: formData.value.host,
        port: formData.value.port,
        database: formData.value.database,
        username: formData.value.username,
        password: formData.value.password || undefined
      })
    } else {
      await databaseStore.addConnection({
        name: formData.value.name,
        type: formData.value.type,
        host: formData.value.host,
        port: formData.value.port,
        database: formData.value.database,
        username: formData.value.username,
        password: formData.value.password || undefined
      })
    }
    emit('saved')
    showModal.value = false
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  showModal.value = false
}
</script>
