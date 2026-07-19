import { computed, inject, provide, toValue, type ComputedRef, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import type {
  EnumOption,
  EnumeratorVersionPayload,
  NamedEnumerator,
  RuntimeEditorConfig,
} from '../components/editors/types'

/**
 * Provide/inject key for the runtime editor config (typically the `/api/config`
 * payload fetched at SPA startup). Parallel to `dataCardContextKey`.
 */
export const editorConfigKey: InjectionKey<MaybeRefOrGetter<RuntimeEditorConfig | null | undefined>> =
  Symbol('editorConfig')

/**
 * Provide a reactive runtime config to descendant enum editors.
 * Accepts a plain object, `Ref`, or getter so apps can populate asynchronously
 * after startup loading completes — editors re-resolve options when it updates.
 */
export function provideEditorConfig(
  config: MaybeRefOrGetter<RuntimeEditorConfig | null | undefined>
): void {
  provide(editorConfigKey, config)
}

/**
 * Typed inject helper. Returns `undefined` when no ancestor provided config
 * (editors then rely on an optional per-component `config` prop or empty options).
 */
export function useEditorConfig(): MaybeRefOrGetter<RuntimeEditorConfig | null | undefined> | undefined {
  return inject(editorConfigKey, undefined)
}

/** Unwrap the current config from a provided ref/getter/plain object. */
export function resolveEditorConfig(
  config: MaybeRefOrGetter<RuntimeEditorConfig | null | undefined> | null | undefined
): RuntimeEditorConfig | null | undefined {
  if (config === null || config === undefined) return config
  return toValue(config)
}

/**
 * Resolve Vuetify-ready select/autocomplete options for a named enumerator.
 *
 * Rules:
 * - `option.value` ← enumerator value's `value`
 * - `option.title` ← `description` when present, otherwise `value`
 * - Lookup is case-sensitive on `enumsName`
 * - Duplicate wire values are removed (first occurrence wins); no invented values
 * - Loading / absent config / absent `enumerators` / unknown name → `[]` (never throws)
 * - When the same name appears in multiple version payloads, the payload with the
 *   highest numeric `version` wins (latest / active)
 */
export function resolveEnumeratorOptions(
  config: RuntimeEditorConfig | null | undefined,
  enumsName: string
): EnumOption[] {
  if (!config || !enumsName) return []
  const versions = config.enumerators
  if (!Array.isArray(versions) || versions.length === 0) return []

  const named = pickLatestNamedEnumerator(versions, enumsName)
  if (!named || !Array.isArray(named.values)) return []

  const seen = new Set<string>()
  const options: EnumOption[] = []
  for (const entry of named.values) {
    if (!entry || typeof entry.value !== 'string') continue
    if (seen.has(entry.value)) continue
    seen.add(entry.value)
    const description = typeof entry.description === 'string' ? entry.description : ''
    options.push({
      value: entry.value,
      title: description || entry.value,
    })
  }
  return options
}

/**
 * Pick the named enumerator from the highest-`version` payload that contains it.
 * Ties keep the first-seen payload at that version (stable / deterministic).
 */
function pickLatestNamedEnumerator(
  versions: EnumeratorVersionPayload[],
  enumsName: string
): NamedEnumerator | undefined {
  let bestVersion = Number.NEGATIVE_INFINITY
  let best: NamedEnumerator | undefined

  for (const payload of versions) {
    if (!payload || !Array.isArray(payload.enumerators)) continue
    const match = payload.enumerators.find((e) => e && e.name === enumsName)
    if (!match) continue
    const ver = typeof payload.version === 'number' && !Number.isNaN(payload.version)
      ? payload.version
      : Number.NEGATIVE_INFINITY
    if (ver > bestVersion) {
      bestVersion = ver
      best = match
    }
  }
  return best
}

/**
 * Reactive options for an editor: prefers optional local `config` override,
 * otherwise the injected app config. Updates when either source changes.
 */
export function useEnumeratorOptions(
  enumsName: MaybeRefOrGetter<string>,
  localConfig?: MaybeRefOrGetter<RuntimeEditorConfig | null | undefined>
): ComputedRef<EnumOption[]> {
  const injected = useEditorConfig()
  return computed(() => {
    const name = toValue(enumsName)
    const override = localConfig !== undefined ? toValue(localConfig) : undefined
    const effective =
      override !== undefined && override !== null
        ? override
        : resolveEditorConfig(injected)
    return resolveEnumeratorOptions(effective, name)
  })
}
