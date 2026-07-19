<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-2">Dashboard</h1>
        <p class="mb-2">
          List-style adaptive card dashboard built from <code>CardGrid</code> + <code>MhCard</code>. The grid uses a
          fixed CSS Grid progression (not Vuetify breakpoint props):
          <strong>1</strong> column from 0px,
          <strong>2</strong> from 600px,
          <strong>3</strong> from 960px,
          <strong>4</strong> from 1280px,
          <strong>5</strong> from 1600px,
          <strong>6</strong> from 1920px,
          <strong>7</strong> from 2240px, and
          <strong>8</strong> from 2560px (permanent maximum).
        </p>
        <p class="mb-4 text-body-2 text-medium-emphasis">
          Wide layouts (5–8 columns) need consumer-provided page width — this demo uses a fluid container so the grid
          can fill the viewport. To verify manually, resize the browser to about 1600 / 1920 / 2240 / 2560px (and wider
          than 2560) and confirm 5 / 6 / 7 / 8 / still-8 columns. Expanded cards in a row stretch to equal height;
          the collapsed example stays title-bar height.
        </p>
      </v-col>
    </v-row>

    <CardGrid automation-id="dashboard-grid">
      <!-- Insert collapsed demo after the first card so it shares a multi-column row with expanded siblings. -->
      <template v-for="(entity, index) in entities" :key="entity.id">
        <MhCard
          :title="entity.title"
          :name="entity.name"
          :color="entity.color"
          :automation-id="`dashboard-card-${entity.id}`"
        >
          <template #actions>
            <v-btn
              icon
              variant="text"
              size="small"
              :data-automation-id="`dashboard-card-${entity.id}-view-button`"
              aria-label="View"
              @click="logAction('view', entity)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              :data-automation-id="`dashboard-card-${entity.id}-edit-button`"
              aria-label="Edit"
              @click="logAction('edit', entity)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              :data-automation-id="`dashboard-card-${entity.id}-delete-button`"
              aria-label="Delete"
              @click="logAction('delete', entity)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <p class="text-body-2 mb-2">{{ entity.summary }}</p>
          <v-chip size="small" variant="tonal" :color="entity.color">{{ entity.status }}</v-chip>
        </MhCard>

        <MhCard
          v-if="index === 0"
          title="Note"
          name="Collapsed example"
          color="secondary"
          collapsible
          v-model:collapsed="collapsedDemo"
          automation-id="dashboard-card-collapsed-demo"
        >
          <p class="text-body-2">
            This card starts collapsed so it keeps intrinsic title-bar height while expanded siblings in the same row
            stretch to match the tallest body.
          </p>
        </MhCard>
      </template>
    </CardGrid>

    <v-row v-if="actionLog.length" class="mt-2">
      <v-col cols="12">
        <v-card variant="tonal" data-automation-id="dashboard-action-log">
          <v-card-title class="text-subtitle-1">Action Log</v-card-title>
          <v-card-text>
            <div v-for="(entry, i) in actionLog" :key="i" class="dashboard-action-log__entry">{{ entry }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Demo: places sample entity summaries into MhCards inside a CardGrid, showcasing the
// responsive 1→8 CSS Grid layout, equal-height expanded rows, and collapsed intrinsic
// height. Static fixture data only — not wired to a backing API.
import { ref } from 'vue'
import { CardGrid, MhCard } from '../../src/index'

interface DashboardEntity {
  id: string
  title: string
  name: string
  color: string
  summary: string
  status: string
}

// Deliberately varied body lengths so equal-height stretch is obvious within a row.
const entities = ref<DashboardEntity[]>([
  {
    id: 'mentee-1',
    title: 'Mentee',
    name: 'Alex Johnson',
    color: 'primary',
    summary: 'Short summary.',
    status: 'Active',
  },
  {
    id: 'mentor-1',
    title: 'Mentor',
    name: 'Priya Shah',
    color: 'secondary',
    summary:
      'Leads five active mentees across Backend and DevOps tracks. Weekly office hours cover career planning, system design reviews, and pairing on production incidents. Medium-length body for equal-height comparison.',
    status: 'Active',
  },
  {
    id: 'session-1',
    title: 'Session',
    name: 'Career Planning Review',
    color: 'primary',
    summary:
      'Scheduled for next Tuesday at 3:00 PM with two attendees confirmed. Agenda covers goals, blockers, and next-quarter milestones. Extra paragraph intentionally lengthens this card so sibling expanded cards in the same row stretch to match its height when the grid has multiple columns.',
    status: 'Scheduled',
  },
  {
    id: 'mentee-2',
    title: 'Mentee',
    name: 'Sam Rivera',
    color: 'primary',
    summary: 'Paused pending schedule availability.',
    status: 'Paused',
  },
  {
    id: 'mentor-2',
    title: 'Mentor',
    name: 'Diego Fernandez',
    color: 'secondary',
    summary:
      'Newly onboarded, awaiting first mentee assignment. Orientation checklist includes platform walkthrough, pairing norms, and first-session prep notes that stretch this body beyond a single line.',
    status: 'Pending',
  },
  {
    id: 'session-2',
    title: 'Session',
    name: 'Mock Interview Practice',
    color: 'primary',
    summary: 'Completed with feedback submitted.',
    status: 'Completed',
  },
  {
    id: 'coordinator-1',
    title: 'Coordinator',
    name: 'Jamie Lee',
    color: 'secondary',
    summary:
      'Manages twelve active mentor/mentee pairings across the program. Coordinates matching, escalations, and quarterly health checks. Longer copy here helps demonstrate equal-height rows when five or more columns are visible on a wide viewport.',
    status: 'Active',
  },
  {
    id: 'session-3',
    title: 'Session',
    name: 'Resume Deep Dive',
    color: 'primary',
    summary: 'Cancelled by mentee; awaiting reschedule.',
    status: 'Cancelled',
  },
])

const collapsedDemo = ref(true)
const actionLog = ref<string[]>([])

function logAction(action: string, entity: DashboardEntity) {
  actionLog.value.unshift(`${action} clicked for "${entity.name}" (${entity.title})`)
  if (actionLog.value.length > 5) actionLog.value.pop()
}
</script>
