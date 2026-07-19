import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  editorConfigKey,
  provideEditorConfig,
  useEditorConfig,
  resolveEditorConfig,
  resolveEnumeratorOptions,
  useEnumeratorOptions,
} from '../../src/composables/useEditorConfig'
import type { RuntimeEditorConfig } from '../../src/components/editors/types'

const sampleConfig: RuntimeEditorConfig = {
  enumerators: [
    {
      version: 1,
      enumerators: [
        {
          name: 'status',
          values: [
            { value: 'active', description: 'Active' },
            { value: 'archived', description: 'Archived' },
            { value: 'active', description: 'Duplicate Active' },
            { value: 'draft' },
          ],
        },
        {
          name: 'Status',
          values: [{ value: 'OTHER', description: 'Wrong case name' }],
        },
      ],
    },
    {
      version: 3,
      enumerators: [
        {
          name: 'status',
          values: [
            { value: 'active', description: 'Active v3' },
            { value: 'paused', description: 'Paused' },
          ],
        },
      ],
    },
    {
      version: 2,
      enumerators: [
        {
          name: 'status',
          values: [{ value: 'stale', description: 'Should not win' }],
        },
      ],
    },
  ],
}

describe('useEditorConfig', () => {
  it('exposes a Symbol provide key', () => {
    expect(typeof editorConfigKey).toBe('symbol')
  })

  it('returns undefined when no ancestor has provided a config', () => {
    let injected: ReturnType<typeof useEditorConfig>
    const Consumer = defineComponent({
      setup() {
        injected = useEditorConfig()
        return () => h('div')
      },
    })

    mount(Consumer)
    expect(injected).toBeUndefined()
  })

  it('provideEditorConfig + useEditorConfig hand off a reactive config', async () => {
    const config = ref<RuntimeEditorConfig | null>(null)
    let options: ReturnType<typeof useEnumeratorOptions> | undefined

    const Child = defineComponent({
      setup() {
        options = useEnumeratorOptions('status')
        return () => h('div')
      },
    })
    const Parent = defineComponent({
      setup() {
        provideEditorConfig(config)
        return () => h(Child)
      },
    })

    mount(Parent)
    expect(options!.value).toEqual([])

    config.value = sampleConfig
    await nextTick()
    expect(options!.value).toEqual([
      { value: 'active', title: 'Active v3' },
      { value: 'paused', title: 'Paused' },
    ])
  })

  describe('resolveEditorConfig', () => {
    it('unwraps a Ref', () => {
      const config = ref(sampleConfig)
      expect(resolveEditorConfig(config)).toEqual(sampleConfig)
    })

    it('unwraps a getter', () => {
      expect(resolveEditorConfig(() => sampleConfig)).toBe(sampleConfig)
    })

    it('passes through null and undefined', () => {
      expect(resolveEditorConfig(null)).toBeNull()
      expect(resolveEditorConfig(undefined)).toBeUndefined()
    })
  })

  describe('resolveEnumeratorOptions', () => {
    it('returns empty for missing config, enumerators, or unknown names', () => {
      expect(resolveEnumeratorOptions(undefined, 'status')).toEqual([])
      expect(resolveEnumeratorOptions(null, 'status')).toEqual([])
      expect(resolveEnumeratorOptions({}, 'status')).toEqual([])
      expect(resolveEnumeratorOptions({ enumerators: [] }, 'status')).toEqual([])
      expect(resolveEnumeratorOptions(sampleConfig, 'missing')).toEqual([])
      expect(resolveEnumeratorOptions(sampleConfig, '')).toEqual([])
    })

    it('uses description as title and falls back to value', () => {
      const config: RuntimeEditorConfig = {
        enumerators: [
          {
            version: 1,
            enumerators: [
              {
                name: 'priority',
                values: [
                  { value: 'high', description: 'High priority' },
                  { value: 'low' },
                ],
              },
            ],
          },
        ],
      }
      expect(resolveEnumeratorOptions(config, 'priority')).toEqual([
        { value: 'high', title: 'High priority' },
        { value: 'low', title: 'low' },
      ])
    })

    it('removes duplicate wire values without inventing values', () => {
      const config: RuntimeEditorConfig = {
        enumerators: [
          {
            version: 1,
            enumerators: [
              {
                name: 'status',
                values: [
                  { value: 'active', description: 'First' },
                  { value: 'active', description: 'Second' },
                  { value: 'archived', description: 'Archived' },
                ],
              },
            ],
          },
        ],
      }
      expect(resolveEnumeratorOptions(config, 'status')).toEqual([
        { value: 'active', title: 'First' },
        { value: 'archived', title: 'Archived' },
      ])
    })

    it('looks up enumerator names case-sensitively', () => {
      expect(resolveEnumeratorOptions(sampleConfig, 'Status')).toEqual([
        { value: 'OTHER', title: 'Wrong case name' },
      ])
      expect(resolveEnumeratorOptions(sampleConfig, 'STATUS')).toEqual([])
    })

    it('selects the highest numeric version when the same name appears in multiple payloads', () => {
      expect(resolveEnumeratorOptions(sampleConfig, 'status')).toEqual([
        { value: 'active', title: 'Active v3' },
        { value: 'paused', title: 'Paused' },
      ])
    })

    it('does not throw on malformed entries', () => {
      const config = {
        enumerators: [
          {
            version: 1,
            enumerators: [
              { name: 'status', values: [null, { value: 1 }, { value: 'ok', description: 'OK' }] },
            ],
          },
        ],
      } as unknown as RuntimeEditorConfig

      expect(() => resolveEnumeratorOptions(config, 'status')).not.toThrow()
      expect(resolveEnumeratorOptions(config, 'status')).toEqual([
        { value: 'ok', title: 'OK' },
      ])
    })

    it('ignores non-numeric version payloads when a numeric version also matches', () => {
      const config: RuntimeEditorConfig = {
        enumerators: [
          {
            version: Number.NaN,
            enumerators: [
              { name: 'status', values: [{ value: 'bad', description: 'Bad' }] },
            ],
          },
          {
            version: 2,
            enumerators: [
              { name: 'status', values: [{ value: 'good', description: 'Good' }] },
            ],
          },
        ],
      }
      expect(resolveEnumeratorOptions(config, 'status')).toEqual([
        { value: 'good', title: 'Good' },
      ])
    })
  })

  it('useEnumeratorOptions prefers a local config override over inject', () => {
    const injected = ref(sampleConfig)
    const local: RuntimeEditorConfig = {
      enumerators: [
        {
          version: 1,
          enumerators: [
            {
              name: 'status',
              values: [{ value: 'local', description: 'Local only' }],
            },
          ],
        },
      ],
    }

    let options: ReturnType<typeof useEnumeratorOptions> | undefined
    const Child = defineComponent({
      setup() {
        options = useEnumeratorOptions('status', local)
        return () => h('div')
      },
    })
    const Parent = defineComponent({
      setup() {
        provideEditorConfig(injected)
        return () => h(Child)
      },
    })

    mount(Parent)
    expect(options!.value).toEqual([{ value: 'local', title: 'Local only' }])
  })
})
