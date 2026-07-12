import { bootstrapAuthFromUrl } from '../src/utils/urlAuthBootstrap'
import { syncAuthFromStorage } from '../src/composables/useAuth'

bootstrapAuthFromUrl()
syncAuthFromStorage()
