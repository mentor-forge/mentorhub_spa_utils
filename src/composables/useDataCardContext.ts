import { inject, provide, toValue, type InjectionKey, type MaybeRefOrGetter } from 'vue'

/**
 * Shape of the record a `DataCard` binds editors to. Keyed by the same
 * `field` prop typed editors accept (F017 contract; `DataCard` wiring lands in F020).
 */
export interface DataCardModel {
  [field: string]: unknown
}

/**
 * Contract shared between `DataCard` (F020) and typed editors (F017+).
 * Editors read `model[field]` and call `onSave(field, value)`; `model` may be a
 * plain object, a `Ref`, or a getter so `DataCard` can hand editors either a
 * reactive document or a computed view over it.
 */
export interface DataCardContext<TModel extends DataCardModel = DataCardModel> {
  model: MaybeRefOrGetter<TModel>
  onSave: (field: string, value: unknown) => Promise<void>
}

/**
 * Typed provide/inject key for `DataCardContext`. Using a `Symbol` (rather than
 * a string key) avoids collisions and gives `inject()`/`provide()` full type
 * inference at call sites.
 */
export const dataCardContextKey: InjectionKey<DataCardContext> = Symbol('dataCardContext')

/** Provide a `DataCardContext` to descendant editors. Called by `DataCard` (F020). */
export function provideDataCardContext<TModel extends DataCardModel = DataCardModel>(
  context: DataCardContext<TModel>
): void {
  provide(dataCardContextKey, context as unknown as DataCardContext)
}

/**
 * Typed inject helper for editors. Returns `undefined` when no ancestor
 * `DataCard` provided a context, so editors can fall back to standalone
 * `modelValue` + `onSave` props.
 */
export function useDataCardContext<TModel extends DataCardModel = DataCardModel>():
  | DataCardContext<TModel>
  | undefined {
  return inject(dataCardContextKey, undefined) as DataCardContext<TModel> | undefined
}

/** Resolve the current model object from a `DataCardContext`, unwrapping refs/getters. */
export function resolveDataCardModel<TModel extends DataCardModel = DataCardModel>(
  context: DataCardContext<TModel>
): TModel {
  return toValue(context.model)
}
