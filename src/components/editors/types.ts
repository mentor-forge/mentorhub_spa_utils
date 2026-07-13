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
