<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-2">Dashboard</h1>
        <p class="mb-4">
          List-style adaptive card dashboard built from <code>CardGrid</code> + <code>MhCard</code> (F016). The
          grid uses the F015 default breakpoints — <code>cols="12" sm="6" md="4" lg="3"</code> — so it collapses to
          a single column on mobile, 2 columns at <code>sm</code>, 3 columns at <code>md</code>, and 4 columns at
          <code>lg</code> and above. Resize the window to see the column count change.
        </p>
      </v-col>
    </v-row>

    <CardGrid automation-id="dashboard-grid">
      <MhCard
        v-for="entity in entities"
        :key="entity.id"
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
// Demo: places a set of sample entity summaries into MhCards (F016) inside a CardGrid,
// showcasing the list-style adaptive dashboard layout with title-bar view/edit/delete
// actions. Static fixture data only — not wired to a backing API.
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

const entities = ref<DashboardEntity[]>([
  {
    id: 'mentee-1',
    title: 'Mentee',
    name: 'Alex Johnson',
    color: 'primary',
    summary: 'Enrolled in the Frontend Engineering track, 3 sessions completed this month.',
    status: 'Active',
  },
  {
    id: 'mentor-1',
    title: 'Mentor',
    name: 'Priya Shah',
    color: 'secondary',
    summary: 'Leads 5 active mentees across Backend and DevOps tracks.',
    status: 'Active',
  },
  {
    id: 'session-1',
    title: 'Session',
    name: 'Career Planning Review',
    color: 'primary',
    summary: 'Scheduled for next Tuesday at 3:00 PM with 2 attendees confirmed.',
    status: 'Scheduled',
  },
  {
    id: 'mentee-2',
    title: 'Mentee',
    name: 'Sam Rivera',
    color: 'primary',
    summary: 'Paused pending schedule availability; last session 6 weeks ago.',
    status: 'Paused',
  },
  {
    id: 'mentor-2',
    title: 'Mentor',
    name: 'Diego Fernandez',
    color: 'secondary',
    summary: 'Newly onboarded, awaiting first mentee assignment.',
    status: 'Pending',
  },
  {
    id: 'session-2',
    title: 'Session',
    name: 'Mock Interview Practice',
    color: 'primary',
    summary: 'Completed with feedback submitted; recording archived.',
    status: 'Completed',
  },
  {
    id: 'coordinator-1',
    title: 'Coordinator',
    name: 'Jamie Lee',
    color: 'secondary',
    summary: 'Manages 12 active mentor/mentee pairings across the program.',
    status: 'Active',
  },
  {
    id: 'session-3',
    title: 'Session',
    name: 'Resume Deep Dive',
    color: 'primary',
    summary: 'Cancelled by mentee; awaiting reschedule request.',
    status: 'Cancelled',
  },
])

const actionLog = ref<string[]>([])

function logAction(action: string, entity: DashboardEntity) {
  actionLog.value.unshift(`${action} clicked for "${entity.name}" (${entity.title})`)
  if (actionLog.value.length > 5) actionLog.value.pop()
}
</script>
