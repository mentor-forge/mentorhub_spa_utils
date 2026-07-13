<script lang="ts">
/**
 * CardGrid has no <template> block: it re-parents each slotted card VNode into a
 * generated `v-col` (instead of cloning/wrapping via string templates) so cards keep
 * their identity/keys across re-renders. Vuetify's `v-row`/`v-col` are registered
 * globally by consuming apps (see demo/main.ts), so plain string component names are
 * used here rather than importing from `vuetify/components`.
 */
import { Comment, Fragment, Text, computed, defineComponent, h, useSlots, type VNode } from 'vue'

type ColSize = string | number

function flattenCardNodes(nodes: Array<VNode | null | undefined>): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (!node) continue
    if (node.type === Comment) continue
    if (node.type === Text) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenCardNodes(node.children as VNode[]))
      continue
    }
    result.push(node)
  }
  return result
}

export default defineComponent({
  name: 'CardGrid',
  props: {
    cols: { type: [String, Number] as unknown as () => ColSize, default: '12' },
    sm: { type: [String, Number] as unknown as () => ColSize, default: '6' },
    md: { type: [String, Number] as unknown as () => ColSize, default: '4' },
    lg: { type: [String, Number] as unknown as () => ColSize, default: '3' },
    xl: { type: [String, Number] as unknown as () => ColSize, default: undefined },
    automationId: { type: String, default: undefined },
  },
  setup(props) {
    const slots = useSlots()

    const cardNodes = computed(() => flattenCardNodes(slots.default ? slots.default() : []))

    return () =>
      // Array children (not a slots object) so this renders correctly whether
      // `v-row`/`v-col` resolve to real Vuetify components or plain elements.
      h(
        'v-row',
        { class: 'mh-card-grid', 'data-automation-id': props.automationId },
        cardNodes.value.map((node, index) =>
          h(
            'v-col',
            {
              key: node.key ?? index,
              cols: props.cols,
              sm: props.sm,
              md: props.md,
              lg: props.lg,
              xl: props.xl,
              class: 'mh-card-grid__col d-flex',
            },
            [node]
          )
        )
      )
  },
})
</script>
