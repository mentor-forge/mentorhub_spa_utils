import { ref, computed, watch } from 'vue'
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/vue-query'
import { useErrorHandler } from './useErrorHandler'

/**
 * Response type for infinite scroll API endpoints
 */
export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}

/**
 * Parameters for infinite scroll queries
 */
export interface InfiniteScrollParams {
  after_id?: string
  limit: number
  sort_by: string
  order: 'asc' | 'desc'
  name?: string
}

/**
 * Options for useInfiniteScroll composable
 */
export interface UseInfiniteScrollOptions<T> {
  /** Query key array for TanStack Query */
  queryKey: readonly unknown[]
  /** Function that fetches a page of items */
  queryFn: (params: InfiniteScrollParams) => Promise<InfiniteScrollResponse<T>>
  /** Function to extract ID from an item (used for cursor-based pagination) */
  getItemId: (item: T) => string
  /** Number of items per page (default: 20) */
  limit?: number
  /** Initial sort field (default: 'name') */
  sort_by?: string
  /** Initial sort order (default: 'asc') */
  order?: 'asc' | 'desc'
  /** Initial search query (default: '') */
  name?: string
}

/**
 * Composable for infinite scroll list pages with server-side pagination, sorting, and search
 * 
 * Features:
 * - Infinite scroll with cursor-based pagination
 * - Server-side sorting (click column headers to sort)
 * - Debounced search (300ms)
 * - Automatic query key management (includes search, sort, order)
 * - Loading states for initial load and "load more"
 * - Error handling via useErrorHandler
 * 
 * @example
 * ```typescript
 * const {
 *   items,
 *   isLoading,
 *   hasMore,
 *   loadMore,
 *   searchQuery,
 *   debouncedSearch,
 *   sortBy,
 *   order,
 *   setSortBy,
 *   setOrder,
 * } = useInfiniteScroll<Control>({
 *   queryKey: ['controls'],
 *   queryFn: (params) => api.getControls(params),
 *   getItemId: (item) => item._id,
 *   limit: 20,
 * })
 * ```
 */
export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const limit = ref(options.limit || 20)
  const sortBy = ref(options.sort_by || 'name')
  const order = ref<'asc' | 'desc'>(options.order || 'asc')
  const searchQuery = ref(options.name || '')
  const debouncedSearch = ref('')
  
  // Debounce search
  let searchTimeout: ReturnType<typeof setTimeout>
  watch(searchQuery, (value) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      debouncedSearch.value = value
    }, 300)
  })
  
  // Build query key that includes search, sort, order
  // This ensures TanStack Query refetches when any of these change
  const queryKey = computed(() => [
    ...options.queryKey,
    debouncedSearch.value,
    sortBy.value,
    order.value
  ] as const)
  
  // Use infinite query from TanStack Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery<InfiniteScrollResponse<T>, Error, InfiniteScrollResponse<T>, readonly unknown[], string | undefined>({
    queryKey: queryKey,
    queryFn: ({ pageParam }: QueryFunctionContext<readonly unknown[], string | undefined>) => {
      return options.queryFn({
        after_id: pageParam,
        limit: limit.value,
        sort_by: sortBy.value,
        order: order.value,
        name: debouncedSearch.value || undefined
      })
    },
    getNextPageParam: (lastPage: InfiniteScrollResponse<T>) => {
      return lastPage.has_more ? lastPage.next_cursor : undefined
    },
    initialPageParam: undefined,
  })
  
  // Flatten all pages into single array
  // Note: data.value is InfiniteData<InfiniteScrollResponse<T>> which has a pages array
  const items = computed(() => {
    if (!data.value) return []
    // TypeScript doesn't properly infer the InfiniteData type, so we access pages directly
    // useInfiniteQuery returns InfiniteData which has a pages array property
    const infiniteData = data.value as unknown as { pages: InfiniteScrollResponse<T>[] }
    return infiniteData.pages.flatMap((page: InfiniteScrollResponse<T>) => page.items)
  })
  
  const { showError, errorMessage } = useErrorHandler(error as any)
  
  // Load more function
  function loadMore() {
    if (hasNextPage.value && !isFetchingNextPage.value) {
      fetchNextPage()
    }
  }
  
  // Function to update search query (called by ListPageSearch component)
  function updateSearchQuery(value: string | null) {
    searchQuery.value = value || ''
  }
  
  // Note: TanStack Query automatically refetches when queryKey changes
  // No need to manually watch and refetch
  
  return {
    /** Flattened array of all items from all loaded pages */
    items,
    /** Loading state for initial load */
    isLoading,
    /** Loading state for "load more" operation */
    isFetchingNextPage,
    /** Whether there are more pages to load */
    hasMore: hasNextPage,
    /** Function to load the next page */
    loadMore,
    /** Error state */
    showError,
    /** Error message */
    errorMessage,
    /** Current search query (reactive, updates immediately) */
    searchQuery,
    /** Function to update search query (pass to ListPageSearch component) */
    debouncedSearch: updateSearchQuery,
    /** The actual debounced search value (for debugging if needed) */
    debouncedSearchValue: debouncedSearch,
    /** Current sort field */
    sortBy,
    /** Current sort order */
    order,
    /** Function to set sort field */
    setSortBy: (field: string) => { sortBy.value = field },
    /** Function to set sort order */
    setOrder: (ord: 'asc' | 'desc') => { order.value = ord },
  }
}
