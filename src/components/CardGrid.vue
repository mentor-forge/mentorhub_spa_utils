<script lang="ts">
/**
 * CardGrid has no <template> block: it re-parents each slotted card VNode into a
 * generated grid item so cards keep their identity/keys across re-renders.
 *
 * Layout is domain-independent CSS Grid (not Vuetify VRow/VCol):
 * - Equal-width tracks via `minmax(0, 1fr)`
 * - Equal-height expanded cards within a row (`align-items: stretch` + item flex)
 * - Responsive columns 1→8 at 0 / 600 / 960 / 1280 / 1600 / 1920 / 2240 / 2560px
 * - Never more than eight columns (no wider breakpoint increases the track count)
 * - Collapsed MhCard stays intrinsic height via scoped :deep overrides
 */
import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  h,
  useSlots,
  type VNode,
} from 'vue'

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
    automationId: { type: String, default: undefined },
  },
  setup(props) {
    const slots = useSlots()

    const cardNodes = computed(() => flattenCardNodes(slots.default ? slots.default() : []))

    return () =>
      h(
        'div',
        { class: 'mh-card-grid', 'data-automation-id': props.automationId },
        cardNodes.value.map((node, index) =>
          h(
            'div',
            {
              key: node.key ?? index,
              class: 'mh-card-grid__item',
            },
            [node]
          )
        )
      )
  },
})
</script>

<style scoped>
/*
 * Responsive column contract (fixed; not prop-driven):
 * 1 col  from 0px
 * 2 cols from 600px
 * 3 cols from 960px
 * 4 cols from 1280px
 * 5 cols from 1600px
 * 6 cols from 1920px
 * 7 cols from 2240px
 * 8 cols from 2560px — permanent maximum (no 9+ rule)
 */
.mh-card-grid {
  display: grid;
  width: 100%;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 600px) {
  .mh-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .mh-card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .mh-card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1600px) {
  .mh-card-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1920px) {
  .mh-card-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (min-width: 2240px) {
  .mh-card-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

@media (min-width: 2560px) {
  .mh-card-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
}

.mh-card-grid__item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

/* Expanded cards stretch to equal row height inside the grid only. */
.mh-card-grid__item :deep(.mh-card:not(.mh-card--collapsed)) {
  align-self: stretch;
  height: 100%;
  flex: 1 1 auto;
}

/* Collapsed cards keep intrinsic (title-bar) height. */
.mh-card-grid__item :deep(.mh-card--collapsed) {
  align-self: flex-start;
  height: auto;
  flex: 0 0 auto;
  min-height: 0;
}
</style>
