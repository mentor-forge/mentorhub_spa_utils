import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useErrorHandler } from './useErrorHandler'

interface UseResourceListOptions<T> {
  queryKey: string[]
  queryFn: () => Promise<T[]>
  getItemId: (item: T) => string
  navigatePath: string
  searchable?: boolean
  searchQueryFn?: (query: string) => Promise<T[]>
}

/**
 * Composable for resource list pages
 * Handles search, data fetching, error handling, and navigation
 * 
 * Features:
 * - Automatic search debouncing (300ms)
 * - Query key management with search query
 * - Error handling via useErrorHandler
 * - Navigation to item detail pages
 * - Configurable search functionality
 */
export function useResourceList<T>(options: UseResourceListOptions<T>) {
  const router = useRouter()
  const searchQuery = ref('')
  const debouncedQuery = ref('')

  // Debounce search if searchable
  let searchTimeout: ReturnType<typeof setTimeout>
  const debouncedSearch = (value: string | null) => {
    if (!options.searchable) return
    // Update searchQuery immediately so the input field reflects what user typed
    searchQuery.value = value || ''
    // Debounce the actual search query
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      debouncedQuery.value = value || ''
    }, 300)
  }

  // Build query key with search query if searchable
  const queryKey = computed(() => {
    if (options.searchable && debouncedQuery.value) {
      return [...options.queryKey, debouncedQuery.value]
    }
    return options.queryKey
  })

  // Build query function
  const queryFn = computed(() => {
    if (options.searchable && debouncedQuery.value && options.searchQueryFn) {
      return () => options.searchQueryFn!(debouncedQuery.value)
    }
    return options.queryFn
  })

  const { data: items, isLoading, error } = useQuery<T[]>({
    queryKey: queryKey,
    queryFn: queryFn.value,
  })

  const { showError, errorMessage } = useErrorHandler(error)

  function navigateToItem(_event: Event, row: { item: T }) {
    const id = options.getItemId(row.item)
    router.push(`${options.navigatePath}/${id}`)
  }

  return {
    items,
    isLoading,
    showError,
    errorMessage,
    searchQuery,
    debouncedSearch,
    navigateToItem,
  }
}
