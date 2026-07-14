<script lang="ts">
/**
 * CardGrid has no <template> block: it re-parents each slotted card VNode into a
 * generated column so cards keep their identity/keys across re-renders.
 *
 * Uses `resolveComponent('VRow'/'VCol')` so consuming apps' globally registered
 * Vuetify components resolve at render time. Plain string tags in `h()` do not.
 */
import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  h,
  resolveComponent,
  useSlots,
  type VNode,
} from 'vue'

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

    return () => {
      const Row = resolveComponent('VRow')
      const Col = resolveComponent('VCol')

      return h(
        Row,
        { class: 'mh-card-grid', 'data-automation-id': props.automationId },
        () =>
          cardNodes.value.map((node, index) =>
            h(
              Col,
              {
                key: node.key ?? index,
                cols: props.cols,
                sm: props.sm,
                md: props.md,
                lg: props.lg,
                xl: props.xl,
                // align-self-start: columns (and their cards) keep intrinsic height so a
                // collapsed MhCard shrinks to its title bar while siblings in the row stay tall.
                class: 'mh-card-grid__col d-flex align-self-start',
              },
              () => [node]
            )
          )
      )
    }
  },
})
</script>
