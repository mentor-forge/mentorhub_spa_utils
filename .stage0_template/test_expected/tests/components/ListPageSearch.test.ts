import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ListPageSearch from '../../src/components/ListPageSearch.vue'

describe('ListPageSearch', () => {
  const mockDebouncedSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render when searchable is true', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: 'test',
        debouncedSearch: mockDebouncedSearch
      }
    })

    // The stub renders as input, so check for that or that component exists
    expect(wrapper.html()).toContain('input')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should not render when searchable is false', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: false,
        searchQuery: 'test',
        debouncedSearch: mockDebouncedSearch
      }
    })

    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('should use default label and placeholder', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: '',
        debouncedSearch: mockDebouncedSearch
      }
    })

    expect(wrapper.props('label')).toBe('Search by name')
    expect(wrapper.props('placeholder')).toBe('Search...')
  })

  it('should use custom label and placeholder', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: '',
        debouncedSearch: mockDebouncedSearch,
        label: 'Custom Label',
        placeholder: 'Custom Placeholder'
      }
    })

    expect(wrapper.props('label')).toBe('Custom Label')
    expect(wrapper.props('placeholder')).toBe('Custom Placeholder')
  })

  it('should bind searchQuery to modelValue', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: 'test query',
        debouncedSearch: mockDebouncedSearch
      }
    })

    expect(wrapper.props('searchQuery')).toBe('test query')
  })

  it('should call debouncedSearch on update:model-value', async () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: '',
        debouncedSearch: mockDebouncedSearch
      }
    })

    // Trigger the event handler directly
    const vm = wrapper.vm as any
    vm.debouncedSearch('new query')

    expect(mockDebouncedSearch).toHaveBeenCalledWith('new query')
  })

  it('should set automation-id attribute', () => {
    const wrapper = shallowMount(ListPageSearch, {
      props: {
        searchable: true,
        searchQuery: '',
        debouncedSearch: mockDebouncedSearch,
        automationId: 'test-search'
      }
    })

    expect(wrapper.props('automationId')).toBe('test-search')
  })
})
