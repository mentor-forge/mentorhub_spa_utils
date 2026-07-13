import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  dataCardContextKey,
  provideDataCardContext,
  useDataCardContext,
  resolveDataCardModel,
  type DataCardContext
} from '../../src/composables/useDataCardContext'

describe('useDataCardContext', () => {
  it('exposes a Symbol provide key', () => {
    expect(typeof dataCardContextKey).toBe('symbol')
  })

  it('returns undefined when no ancestor has provided a context', () => {
    let injected: DataCardContext | undefined
    const Consumer = defineComponent({
      setup() {
        injected = useDataCardContext()
        return () => h('div')
      }
    })

    mount(Consumer)

    expect(injected).toBeUndefined()
  })

  it('provideDataCardContext + useDataCardContext hand off a context between components', () => {
    const model = ref({ name: 'Ada' })
    const onSave = vi.fn().mockResolvedValue(undefined)

    let injected: DataCardContext | undefined
    const Child = defineComponent({
      setup() {
        injected = useDataCardContext()
        return () => h('div')
      }
    })
    const Parent = defineComponent({
      setup() {
        provideDataCardContext({ model, onSave })
        return () => h(Child)
      }
    })

    mount(Parent)

    expect(injected).toBeDefined()
    expect(injected?.onSave).toBe(onSave)
    expect(resolveDataCardModel(injected as DataCardContext)).toEqual({ name: 'Ada' })
  })

  describe('resolveDataCardModel', () => {
    it('unwraps a Ref model', () => {
      const model = ref({ name: 'Ada' })
      expect(resolveDataCardModel({ model, onSave: vi.fn() })).toEqual({ name: 'Ada' })
    })

    it('unwraps a getter model', () => {
      const model = { name: 'Ada' }
      expect(resolveDataCardModel({ model: () => model, onSave: vi.fn() })).toEqual({ name: 'Ada' })
    })

    it('passes through a plain object model', () => {
      const model = { name: 'Ada' }
      expect(resolveDataCardModel({ model, onSave: vi.fn() })).toBe(model)
    })
  })
})
