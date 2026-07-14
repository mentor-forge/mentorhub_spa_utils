import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import BreadcrumbDisplay from '../../../src/components/editors/BreadcrumbDisplay.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

const sampleBreadcrumb = {
  from_ip: '192.168.1.10',
  by_user: 'jane.doe',
  at_time: '2024-01-15T10:30:00.000Z',
  correlation_id: 'corr-abc-123',
}

describe('BreadcrumbDisplay', () => {
  it('should default to editable=false', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb },
    })

    expect(wrapper.props('editable')).toBe(false)
  })

  it('should render an optional label above the field list', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb, label: 'Audit Trail' },
    })

    expect(wrapper.text()).toContain('Audit Trail')
  })

  it('should render all four breadcrumb fields', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb },
    })

    expect(wrapper.text()).toContain('192.168.1.10')
    expect(wrapper.text()).toContain('jane.doe')
    expect(wrapper.text()).toContain('corr-abc-123')
    expect(wrapper.text()).toContain('From IP')
    expect(wrapper.text()).toContain('By User')
    expect(wrapper.text()).toContain('At Time')
    expect(wrapper.text()).toContain('Correlation ID')
  })

  it('should render a formatted at_time rather than the raw ISO string', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb },
    })

    expect(wrapper.text()).not.toContain('2024-01-15T10:30:00.000Z')
  })

  it('should never render an input, even if editable=true is explicitly passed', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb, editable: true },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.text()).toContain('192.168.1.10')
  })

  it('should render em-dash placeholders for missing fields', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: {} },
    })

    expect(wrapper.text()).toContain('—')
  })

  it('should render em-dash placeholders when modelValue is undefined', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: {},
    })

    expect(wrapper.text()).toContain('—')
  })

  it('should apply per-field automation ids suffixed with -display', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb, automationId: 'audit-breadcrumb' },
    })

    expect(wrapper.attributes('data-automation-id')).toBe('audit-breadcrumb')
    expect(wrapper.find('[data-automation-id="audit-breadcrumb-from-ip-display"]').text()).toBe('192.168.1.10')
    expect(wrapper.find('[data-automation-id="audit-breadcrumb-by-user-display"]').text()).toBe('jane.doe')
    expect(wrapper.find('[data-automation-id="audit-breadcrumb-correlation-id-display"]').exists()).toBe(true)
  })

  it('should render nothing when visible is false', () => {
    const wrapper = mount(BreadcrumbDisplay, {
      props: { modelValue: sampleBreadcrumb, visible: false },
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('should read the breadcrumb object from an injected DataCard context when field is set', () => {
    const model = ref({ audit: sampleBreadcrumb })
    const wrapper = mount(BreadcrumbDisplay, {
      props: { field: 'audit', modelValue: { from_ip: 'ignored' } },
      global: {
        provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
      },
    })

    expect(wrapper.text()).toContain('192.168.1.10')
  })
})
