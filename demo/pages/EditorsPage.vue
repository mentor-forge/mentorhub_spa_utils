<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-2">Type Editor Gallery</h1>
        <p class="mb-4">
          Every configurator-type-aligned editor, bound to a single in-memory reactive model via
          <code>DataCard</code>. Edits AutoSave (watch for the spinner / check mark next to each field) — nothing
          is persisted to a server; this page is entirely client-side.
        </p>
        <v-switch
          v-model="contactEditable"
          label="Contact card editable"
          color="primary"
          density="comfortable"
          hide-details
          data-automation-id="editors-contact-editable-toggle"
        />
        <v-switch
          v-model="enumsEditable"
          label="Enums card editable"
          color="primary"
          density="comfortable"
          hide-details
          class="mt-2"
          data-automation-id="editors-enums-editable-toggle"
        />
        <p class="text-caption text-medium-emphasis">
          The Audit card below is collapsed via a controlled <code>v-model:collapsed</code> binding (starts
          collapsed) — all other cards use the default uncontrolled collapse toggle. Enum options come from the
          startup <code>/api/config</code> payload via <code>provideEditorConfig</code> (no hard-coded items).
        </p>
      </v-col>
    </v-row>

    <CardGrid automation-id="editors-demo-grid" cols="12" md="6" lg="4">
      <DataCard
        title="Identity"
        color="primary"
        name-field="word"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-identity-card"
      >
        <WordEditor
          field="word"
          label="Word"
          hint="1-40 chars, no whitespace"
          automation-id="editors-word"
        />
        <SentenceEditor
          field="sentence"
          label="Sentence"
          hint="Up to 255 chars, no tabs/newlines"
          automation-id="editors-sentence"
          class="mt-4"
        />
        <IdentifierEditor
          field="identifier"
          label="Identifier"
          hint="Mongo ObjectId — view-only by default"
          automation-id="editors-identifier"
          class="mt-4"
        />
      </DataCard>

      <DataCard
        title="Contact"
        color="secondary"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-contact-card"
      >
        <EmailEditor
          field="email"
          label="Email"
          :editable="contactEditable"
          automation-id="editors-email"
        />
        <UsPhoneEditor
          field="us_phone"
          label="US Phone"
          :editable="contactEditable"
          automation-id="editors-us-phone"
          class="mt-4"
        />
        <UrlEditor
          field="url"
          label="Website"
          :editable="contactEditable"
          automation-id="editors-url"
          class="mt-4"
        />
        <IpAddressEditor
          field="ip_address"
          label="IP Address"
          :editable="contactEditable"
          automation-id="editors-ip-address"
          class="mt-4"
        />
      </DataCard>

      <DataCard
        title="Content"
        color="primary"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-content-card"
      >
        <MarkdownEditor field="markdown" label="Notes" automation-id="editors-markdown" />
      </DataCard>

      <DataCard
        title="Time"
        color="secondary"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-time-card"
      >
        <DurationEditor field="duration" label="Session Length" automation-id="editors-duration" />
        <DateTimeEditor field="date_time" label="Scheduled At" automation-id="editors-date-time" class="mt-4" />
      </DataCard>

      <DataCard
        title="Metrics"
        color="primary"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-metrics-card"
      >
        <BooleanEditor field="boolean" label="Active" automation-id="editors-boolean" />
        <CountEditor field="count" label="Count" automation-id="editors-count" class="mt-4" />
        <IndexEditor field="index" label="Index" automation-id="editors-index" class="mt-4" />
        <RatingEditor field="rating" label="Rating" automation-id="editors-rating" class="mt-4" />
      </DataCard>

      <DataCard
        title="Enums"
        color="secondary"
        :model="model"
        :on-save="handleSave"
        automation-id="editors-enums-card"
      >
        <EnumEditor
          field="status"
          enums="status"
          label="Status"
          hint="Scalar enum — options from runtime enumerator name"
          :editable="enumsEditable"
          automation-id="editors-status"
        />
        <EnumArrayEditor
          field="tags"
          enums="tags"
          label="Tags"
          hint="Enum array — autocomplete + closable pills; saves string[]"
          :editable="enumsEditable"
          automation-id="editors-tags"
          class="mt-4"
        />
      </DataCard>

      <DataCard
        title="Audit"
        color="secondary"
        :model="model"
        :on-save="handleSave"
        v-model:collapsed="auditCollapsed"
        automation-id="editors-audit-card"
      >
        <BreadcrumbDisplay field="breadcrumb" label="Last Change" automation-id="editors-breadcrumb" />
      </DataCard>
    </CardGrid>

    <v-row v-if="saveLog.length">
      <v-col cols="12">
        <v-card variant="tonal" data-automation-id="editors-save-log">
          <v-card-title class="text-subtitle-1">Save Log</v-card-title>
          <v-card-text>
            <div v-for="(entry, i) in saveLog" :key="i" class="editors-save-log__entry">{{ entry }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Demo: places every configurator-type-aligned editor (F018/F019/F026) into several
// DataCards (F020) inside a CardGrid (F016), against one shared reactive model with
// in-memory AutoSave stubs. Enum options come from App.vue's startup /api/config via
// provideEditorConfig — no hard-coded option lists on the editors themselves.
import { reactive, ref } from 'vue'
import {
  CardGrid,
  DataCard,
  WordEditor,
  SentenceEditor,
  IdentifierEditor,
  EmailEditor,
  UsPhoneEditor,
  UrlEditor,
  IpAddressEditor,
  MarkdownEditor,
  DurationEditor,
  DateTimeEditor,
  BooleanEditor,
  CountEditor,
  IndexEditor,
  RatingEditor,
  EnumEditor,
  EnumArrayEditor,
  BreadcrumbDisplay,
} from '../../src/index'

// Demonstrates the `editable` prop toggling live across a whole card's editors.
const contactEditable = ref(true)
const enumsEditable = ref(true)
// Demonstrates the optional controlled `v-model:collapsed` contract (starts collapsed).
const auditCollapsed = ref(true)

const model = reactive<Record<string, unknown>>({
  word: 'demo-word',
  sentence: 'A short sentence describing this demo record.',
  identifier: '507f1f77bcf86cd799439011',
  email: 'demo@example.com',
  us_phone: '+15551234567',
  url: 'https://example.com',
  ip_address: '192.168.1.1',
  markdown: '# Demo notes\n\nSupports **markdown** text.',
  duration: 'PT1H30M',
  date_time: new Date().toISOString(),
  boolean: true,
  count: 3,
  index: 0,
  rating: 3,
  status: 'active',
  tags: ['alpha'],
  breadcrumb: {
    from_ip: '10.0.0.5',
    by_user: 'demo-user',
    at_time: new Date().toISOString(),
    correlation_id: 'corr-123',
  },
})

const saveLog = ref<string[]>([])

async function handleSave(field: string, value: unknown) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  model[field] = value
  saveLog.value.unshift(`Saved "${field}": ${JSON.stringify(value)}`)
  if (saveLog.value.length > 5) saveLog.value.pop()
}
</script>
