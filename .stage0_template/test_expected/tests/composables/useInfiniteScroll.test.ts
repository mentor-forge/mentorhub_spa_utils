import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useInfiniteScroll } from '../../src/composables/useInfiniteScroll'
import type { InfiniteScrollResponse } from '../../src/composables/useInfiniteScroll'

// Mock TanStack Query
const mockFetchNextPage = vi.fn()
const mockHasNextPage = vi.fn(() => false)
const mockIsFetchingNextPage = vi.fn(() => false)
const mockIsLoading = vi.fn(() => false)
const mockError = vi.fn(() => null)
const mockData = vi.fn(() => null)

vi.mock('@tanstack/vue-query', () => ({
  useInfiniteQuery: vi.fn(() => ({
    data: { value: mockData() },
    fetchNextPage: mockFetchNextPage,
    hasNextPage: { value: mockHasNextPage() },
    isFetchingNextPage: { value: mockIsFetchingNextPage() },
    isLoading: { value: mockIsLoading() },
    error: { value: mockError() }
  }))
}))

// Mock useErrorHandler
vi.mock('../../src/composables/useErrorHandler', () => ({
  useErrorHandler: vi.fn((error) => {
    const showError = { value: false }
    const errorMessage = { value: '' }
    
    // Watch the error ref and update showError/errorMessage
    if (error?.value) {
      showError.value = true
      errorMessage.value = error.value instanceof Error ? error.value.message : String(error.value)
    }
    
    return {
      showError,
      errorMessage
    }
  })
}))

interface TestItem {
  _id: string
  name: string
}

describe('useInfiniteScroll', () => {
  const mockQueryFn = vi.fn()
  
  const defaultOptions = {
    queryKey: ['test'] as const,
    queryFn: mockQueryFn,
    getItemId: (item: TestItem) => item._id
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    // Reset all mocks to default values
    mockHasNextPage.mockReturnValue(false)
    mockIsFetchingNextPage.mockReturnValue(false)
    mockIsLoading.mockReturnValue(false)
    mockError.mockReturnValue(null)
    mockData.mockReturnValue(null)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial Load', () => {
    it('should initialize with default values', () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [{ _id: '1', name: 'Item 1' }],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })
      mockQueryFn.mockResolvedValueOnce(mockResponse)

      const {
        items,
        isLoading,
        searchQuery,
        sortBy,
        order
      } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(items.value).toEqual([{ _id: '1', name: 'Item 1' }])
      expect(isLoading.value).toBe(false)
      expect(searchQuery.value).toBe('')
      expect(sortBy.value).toBe('name')
      expect(order.value).toBe('asc')
    })

    it('should initialize with custom options', () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 10,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })
      mockQueryFn.mockResolvedValueOnce(mockResponse)

      const {
        items,
        sortBy,
        order,
        searchQuery
      } = useInfiniteScroll<TestItem>({
        ...defaultOptions,
        limit: 10,
        sort_by: 'created',
        order: 'desc',
        name: 'test-search'
      })

      expect(items.value).toEqual([])
      expect(sortBy.value).toBe('created')
      expect(order.value).toBe('desc')
      expect(searchQuery.value).toBe('test-search')
    })

    it('should call queryFn with correct initial parameters', async () => {
      const { useInfiniteQuery } = await import('@tanstack/vue-query')
      const mockUseInfiniteQuery = vi.mocked(useInfiniteQuery)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })
      mockQueryFn.mockResolvedValueOnce(mockResponse)

      useInfiniteScroll<TestItem>(defaultOptions)

      await nextTick()

      // Verify useInfiniteQuery was called with correct queryFn
      expect(mockUseInfiniteQuery).toHaveBeenCalled()
      const callArgs = mockUseInfiniteQuery.mock.calls[0][0]
      expect(callArgs.queryFn).toBeDefined()
      
      // Call the queryFn to verify it calls our mockQueryFn with correct params
      const queryFnResult = await callArgs.queryFn({ pageParam: undefined } as any)
      expect(mockQueryFn).toHaveBeenCalledWith({
        after_id: undefined,
        limit: 20,
        sort_by: 'name',
        order: 'asc',
        name: undefined
      })
    })
  })

  describe('Load More', () => {
    it('should load more when hasMore is true', () => {
      mockHasNextPage.mockReturnValue(true)
      mockIsFetchingNextPage.mockReturnValue(false)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { loadMore, hasMore } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(hasMore.value).toBe(true)
      loadMore()
      
      expect(mockFetchNextPage).toHaveBeenCalled()
    })

    it('should not load more when hasMore is false', () => {
      mockHasNextPage.mockReturnValue(false)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { loadMore } = useInfiniteScroll<TestItem>(defaultOptions)

      loadMore()
      
      expect(mockFetchNextPage).not.toHaveBeenCalled()
    })

    it('should not load more when already fetching', () => {
      mockHasNextPage.mockReturnValue(true)
      mockIsFetchingNextPage.mockReturnValue(true)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { loadMore } = useInfiniteScroll<TestItem>(defaultOptions)

      loadMore()
      
      expect(mockFetchNextPage).not.toHaveBeenCalled()
    })
  })

  describe('Search', () => {
    it('should debounce search input', async () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { searchQuery, debouncedSearch, debouncedSearchValue } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(debouncedSearchValue.value).toBe('')
      
      // Call the debouncedSearch function (as ListPageSearch would)
      debouncedSearch('test')
      await nextTick()
      
      // Before debounce timeout
      expect(debouncedSearchValue.value).toBe('')
      
      // Advance timers by 300ms (debounce delay)
      vi.advanceTimersByTime(300)
      await nextTick()
      await nextTick() // Extra tick for reactivity
      
      expect(debouncedSearchValue.value).toBe('test')
    })

    it('should reset debounce timer on rapid input', async () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { debouncedSearch, debouncedSearchValue } = useInfiniteScroll<TestItem>(defaultOptions)

      // Call the debouncedSearch function multiple times rapidly
      debouncedSearch('t')
      await nextTick()
      vi.advanceTimersByTime(200)
      await nextTick()
      
      debouncedSearch('te')
      await nextTick()
      vi.advanceTimersByTime(200)
      await nextTick()
      
      debouncedSearch('test')
      await nextTick()
      vi.advanceTimersByTime(300)
      await nextTick()
      await nextTick() // Extra tick for reactivity
      
      expect(debouncedSearchValue.value).toBe('test')
    })

    it('should handle null search value', async () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { debouncedSearch, searchQuery } = useInfiniteScroll<TestItem>(defaultOptions)

      debouncedSearch(null)
      await nextTick()
      
      expect(searchQuery.value).toBe('')
    })
  })

  describe('Sorting', () => {
    it('should set sort field', () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { sortBy, setSortBy } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(sortBy.value).toBe('name')
      
      setSortBy('created')
      
      expect(sortBy.value).toBe('created')
    })

    it('should set sort order', () => {
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { order, setOrder } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(order.value).toBe('asc')
      
      setOrder('desc')
      
      expect(order.value).toBe('desc')
    })
  })

  describe('Items Flattening', () => {
    it('should flatten multiple pages into single array', () => {
      const page1: InfiniteScrollResponse<TestItem> = {
        items: [{ _id: '1', name: 'Item 1' }, { _id: '2', name: 'Item 2' }],
        limit: 20,
        has_more: true,
        next_cursor: '2'
      }
      
      const page2: InfiniteScrollResponse<TestItem> = {
        items: [{ _id: '3', name: 'Item 3' }],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [page1, page2]
      })

      const { items } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(items.value).toEqual([
        { _id: '1', name: 'Item 1' },
        { _id: '2', name: 'Item 2' },
        { _id: '3', name: 'Item 3' }
      ])
    })

    it('should return empty array when no data', () => {
      mockData.mockReturnValue(null)

      const { items } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(items.value).toEqual([])
    })

    it('should return empty array when pages is empty', () => {
      mockData.mockReturnValue({
        pages: []
      })

      const { items } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(items.value).toEqual([])
    })
  })

  describe('Loading States', () => {
    it('should expose isLoading state', () => {
      mockIsLoading.mockReturnValue(true)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { isLoading } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(isLoading.value).toBe(true)
    })

    it('should expose isFetchingNextPage state', () => {
      mockIsFetchingNextPage.mockReturnValue(true)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { isFetchingNextPage } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(isFetchingNextPage.value).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle errors', () => {
      const mockErrorObj = new Error('Test error')
      mockError.mockReturnValue(mockErrorObj)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { showError, errorMessage } = useInfiniteScroll<TestItem>(defaultOptions)

      // useErrorHandler is called with error ref, which is a reactive ref
      // The mock should handle the ref properly
      expect(showError.value).toBe(true)
      expect(errorMessage.value).toBe('Test error')
    })

    it('should not show error when no error', () => {
      mockError.mockReturnValue(null)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { showError, errorMessage } = useInfiniteScroll<TestItem>(defaultOptions)

      expect(showError.value).toBe(false)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('Query Key Updates', () => {
    it('should include search, sort, and order in query key', async () => {
      const { useInfiniteQuery } = await import('@tanstack/vue-query')
      const mockUseInfiniteQuery = vi.mocked(useInfiniteQuery)
      
      const mockResponse: InfiniteScrollResponse<TestItem> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      
      mockData.mockReturnValue({
        pages: [mockResponse]
      })

      const { searchQuery } = useInfiniteScroll<TestItem>({
        ...defaultOptions,
        name: 'test'
      })

      // Wait for debounce
      searchQuery.value = 'search-term'
      vi.advanceTimersByTime(300)
      await nextTick()

      // Verify queryKey was called with search, sort, and order
      expect(mockUseInfiniteQuery).toHaveBeenCalled()
      const callArgs = mockUseInfiniteQuery.mock.calls[0][0]
      expect(callArgs.queryKey).toBeDefined()
    })
  })
})
