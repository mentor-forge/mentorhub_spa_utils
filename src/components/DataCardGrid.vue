<template>
  <div class="data-card-grid" data-automation-id="data-card-grid">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * DataCardGrid is a slot wrapper for multi-card view/edit pages.
 * Children render as authored (no Fragment flatten / re-parent).
 *
 * Responsive column contract (fixed; not prop-driven):
 * 1 col  below 641px
 * 2 cols from 641px
 * 4 cols from 1920px
 * No three-column step; never five or more columns.
 */
defineOptions({ name: 'DataCardGrid' })
</script>

<style scoped>
/*
 * Responsive column contract (fixed; not prop-driven):
 * 1 col  from 0px (below 641px)
 * 2 cols from 641px
 * 4 cols from 1920px — permanent maximum (no 3-col or 5+ rule)
 */
.data-card-grid {
  display: grid;
  width: 100%;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 641px) {
  .data-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1920px) {
  .data-card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
