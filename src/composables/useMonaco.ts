import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import * as monaco from 'monaco-editor'

export function useMonacoEditor(
  container: Ref<HTMLDivElement | undefined>,
  options?: monaco.editor.IStandaloneEditorConstructionOptions
) {
  let editor: monaco.editor.IStandaloneCodeEditor | null = null

  onMounted(() => {
    if (container.value) {
      editor = monaco.editor.create(container.value, {
        language: 'sql',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        ...options
      })
    }
  })

  onUnmounted(() => {
    if (editor) {
      editor.dispose()
    }
  })

  return {
    editor: ref(editor),
    getValue: () => editor?.getValue() || '',
    setValue: (value: string) => editor?.setValue(value),
    focus: () => editor?.focus()
  }
}
