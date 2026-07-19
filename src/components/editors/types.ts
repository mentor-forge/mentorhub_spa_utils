/**
 * Shared prop contract for the typed editor family (F015 locked names).
 * Concrete editors (`WordEditor`, `EmailEditor`, `BooleanEditor`, ... — F018/F019)
 * extend `BaseEditorProps<TValue>` with their own value type and validation hooks.
 */
export interface BaseEditorProps<TValue = unknown> {
  /** Model property key when used inside a `DataCard` (preferred over `data` / `dataKey`). */
  field?: string
  /** Standalone binding for demos / pages not using `DataCard`. */
  modelValue?: TValue
  /** Standalone save callback; ignored when an ancestor `DataCard` context is present. */
  onSave?: (value: TValue) => Promise<void>
  /** View vs edit. Default `true` except Identifier / Breadcrumb (see F017 catalog). */
  editable?: boolean
  /** When `false`, hide the control without removing it from the form model. */
  visible?: boolean
  /** Maps to the `data-automation-id` attribute. */
  automationId?: string
  label?: string
  hint?: string
  rules?: Array<(v: TValue) => boolean | string>
}

/** Props for the abstract string-input base (`StringEditor`) and its derivatives. */
export interface StringEditorProps extends BaseEditorProps<string | number | undefined> {
  /** Render a `v-textarea` instead of a `v-text-field`. */
  textarea?: boolean
  rows?: number
}

/**
 * `breadcrumb` configurator type: composite audit object rendered by
 * `BreadcrumbDisplay` (F019). Always display-only — see `BreadcrumbDisplay.vue`.
 */
export interface BreadcrumbValue {
  from_ip?: string
  by_user?: string
  at_time?: string
  correlation_id?: string
}

/** Single allowed value inside a named runtime enumerator (`/api/config`). */
export interface EnumeratorValue {
  value: string
  description?: string
}

/** Named enumerator: dictionary `enums` key → this `name`. */
export interface NamedEnumerator {
  name: string
  values: EnumeratorValue[]
}

/**
 * One versioned enumerator payload from `/api/config.enumerators[]`.
 * When the same `name` appears in multiple payloads, editors use the highest
 * numeric `version` (latest / active).
 */
export interface EnumeratorVersionPayload {
  version: number
  enumerators: NamedEnumerator[]
}

/**
 * Minimum runtime config shape consumed by enum editors.
 * Applications fetch `/api/config` at startup and provide this (or a superset).
 */
export interface RuntimeEditorConfig {
  enumerators?: EnumeratorVersionPayload[]
}

/** Vuetify-ready option resolved from a runtime enumerator value. */
export interface EnumOption {
  title: string
  value: string
}

/** Props for `EnumEditor` (configurator type `enum`). */
export interface EnumEditorProps extends BaseEditorProps<string | undefined> {
  /** Case-sensitive enumerator name matching a dictionary property `enums` key. */
  enums: string
  /**
   * Optional per-component config override for tests / standalone demos.
   * Prefer the app-level `provideEditorConfig` context in production.
   */
  config?: RuntimeEditorConfig | null
}

/** Props for `EnumArrayEditor` (configurator type `enum_array`). */
export interface EnumArrayEditorProps extends BaseEditorProps<string[] | undefined> {
  /** Case-sensitive enumerator name matching a dictionary property `enums` key. */
  enums: string
  /**
   * Optional per-component config override for tests / standalone demos.
   * Prefer the app-level `provideEditorConfig` context in production.
   */
  config?: RuntimeEditorConfig | null
}
