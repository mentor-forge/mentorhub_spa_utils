<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">spa_utils Component Testing</h1>
        <p class="mb-6">This demo app showcases spa_utils components with api_utils backing service.</p>
      </v-col>
    </v-row>

    <!-- AutoSaveField Demo -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>AutoSaveField Component</v-card-title>
          <v-card-text>
            <AutoSaveField
              v-model="textValue"
              label="Text Field"
              :on-save="handleTextSave"
              :rules="[validationRules.required]"
              hint="This field auto-saves on blur"
              automation-id="demo-autosave-field"
            />
            <v-alert v-if="textSaveStatus" :type="textSaveStatus.type" class="mt-4">
              {{ textSaveStatus.message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>AutoSaveField (Textarea)</v-card-title>
          <v-card-text>
            <AutoSaveField
              v-model="textareaValue"
              label="Textarea Field"
              textarea
              :rows="3"
              :on-save="handleTextareaSave"
              :rules="[validationRules.descriptionPattern]"
              hint="This textarea auto-saves on blur"
              automation-id="demo-autosave-textarea"
            />
            <v-alert v-if="textareaSaveStatus" :type="textareaSaveStatus.type" class="mt-4">
              {{ textareaSaveStatus.message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- AutoSaveSelect Demo -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>AutoSaveSelect Component</v-card-title>
          <v-card-text>
            <AutoSaveSelect
              v-model="selectValue"
              label="Status"
              :items="['active', 'archived', 'pending']"
              :on-save="handleSelectSave"
              hint="This select auto-saves on blur"
              automation-id="demo-autosave-select"
            />
            <v-alert v-if="selectSaveStatus" :type="selectSaveStatus.type" class="mt-4">
              {{ selectSaveStatus.message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>ListPageSearch Component</v-card-title>
          <v-card-text>
            <ListPageSearch
              :searchable="true"
              :search-query="searchQuery"
              :debounced-search="debouncedSearch"
              label="Search by name"
              automation-id="demo-list-search"
            />
            <v-alert v-if="searchQuery" type="info" class="mt-4">
              Search query: "{{ searchQuery }}"
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Utility Functions Demo -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Utility Functions</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="mb-2">formatDate</h3>
                <p>Current date: {{ formatDate(new Date().toISOString()) }}</p>
                <p>Null date: {{ formatDate(null) }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="mb-2">validationRules</h3>
                <p>Required test: {{ validationRules.required('test') === true ? '✓ Valid' : '✗ Invalid' }}</p>
                <p>Name pattern test: {{ validationRules.namePattern('valid-name') === true ? '✓ Valid' : '✗ Invalid' }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  AutoSaveField,
  AutoSaveSelect,
  ListPageSearch,
  formatDate,
  validationRules
} from '../../src/index'

const textValue = ref('Initial text')
const textareaValue = ref('Initial textarea content')
const selectValue = ref('active')
const searchQuery = ref('')

const textSaveStatus = ref<{ type: string; message: string } | null>(null)
const textareaSaveStatus = ref<{ type: string; message: string } | null>(null)
const selectSaveStatus = ref<{ type: string; message: string } | null>(null)

const handleTextSave = async (value: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  textSaveStatus.value = { type: 'success', message: `Saved: ${value}` }
  setTimeout(() => { textSaveStatus.value = null }, 3000)
}

const handleTextareaSave = async (value: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  textareaSaveStatus.value = { type: 'success', message: `Saved: ${value}` }
  setTimeout(() => { textareaSaveStatus.value = null }, 3000)
}

const handleSelectSave = async (value: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  selectSaveStatus.value = { type: 'success', message: `Saved: ${value}` }
  setTimeout(() => { selectSaveStatus.value = null }, 3000)
}

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = (value: string | null) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchQuery.value = value || ''
  }, 300)
}
</script>
