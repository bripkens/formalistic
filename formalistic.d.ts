export type Item = Field<any> | MapForm<any> | ListForm<any>;
type ExistingOrNewItemType<VALUE_TYPE extends MapFormItems, PATH extends string> = PATH extends keyof VALUE_TYPE
  ? VALUE_TYPE[PATH]
  : Item;
type Path<VALUE_TYPE extends MapFormItems | Item[]> = VALUE_TYPE extends MapFormItems
  ? MapPath<VALUE_TYPE>
  : VALUE_TYPE extends Item[] ? ListPath<VALUE_TYPE> : never;
type MapPath<VALUE_TYPE extends MapFormItems> = {
  [Key in keyof VALUE_TYPE]: VALUE_TYPE[Key] extends MapForm<infer MIT>
    ? [Key] | [Key, ...MapPath<MIT>]
    : VALUE_TYPE[Key] extends ListForm<infer LIT>
      ? [Key] | [Key, ...ListPath<LIT>]
      : [Key]
}[keyof VALUE_TYPE];
type ListPath<VALUE_TYPE extends Item[]> = VALUE_TYPE[number] extends ListForm<infer LIT>
  ? [number] | [number, ...ListPath<LIT>]
  : VALUE_TYPE[number] extends MapForm<infer MIT>
    ? [number] | [number, ...MapPath<MIT>]
    : [number];
type ItemValueType<I extends Item> = I extends Field<infer FT>
  ?  FT
  : I extends MapForm<infer MIT>
    ?  { [Key in keyof MIT]: ItemValueType<MIT[Key]> }
    : I extends ListForm<infer LIT>
      ? ItemValueType<LIT[number]>[]
      : never;
type NestedValueType<BASE_VALUE_TYPE extends MapFormItems | Item[], PATH extends Path<BASE_VALUE_TYPE>> = BASE_VALUE_TYPE extends MapFormItems
  ? NestedMapValueType<BASE_VALUE_TYPE, PATH>
  : BASE_VALUE_TYPE extends Item[]
    ? NestedListValueType<BASE_VALUE_TYPE, PATH>
    : never;
type NestedMapValueType<BASE_VALUE_TYPE extends MapFormItems, PATH extends Path<BASE_VALUE_TYPE>> = PATH extends [infer Key, ...infer Rest]
  ? Key extends string
    ? BASE_VALUE_TYPE[Key] extends infer Value_Type
      ? Rest extends []
        ? Value_Type
        : Value_Type extends MapForm<infer MIT>
          ? Rest extends Path<MIT>
            ? NestedValueType<MIT, Rest>
            : never
          : Value_Type extends ListForm<infer LIT>
            ? Rest extends Path<LIT>
              ? NestedValueType<LIT, Rest>
              : never
            : never
      : never
    : never
  : never;
type NestedListValueType<BASE_VALUE_TYPE extends Item[], PATH extends Path<BASE_VALUE_TYPE>> = PATH extends [number, ...infer Rest]
  ? BASE_VALUE_TYPE[number] extends infer Value_Type
    ? Rest extends []
      ? Value_Type
      : Value_Type extends MapForm<infer MIT>
        ? Rest extends Path<MIT>
          ? NestedValueType<MIT, Rest>
          : never
        : Value_Type extends ListForm<infer LIT>
          ? Rest extends Path<LIT>
            ? NestedValueType<LIT, Rest>
            : never
          : never
    : never
  : never;

/*
 * Fields
 */

export interface CreateFieldOpts<VALUE_TYPE> {
  value: VALUE_TYPE;
  isEqual?: (a: VALUE_TYPE, b: VALUE_TYPE) => boolean;
  touched?: boolean;
  validator?: (value: VALUE_TYPE) => ValidationResult;
}

export interface Field<VALUE_TYPE> {
  readonly value: VALUE_TYPE;
  readonly touched: boolean;
  readonly hierarchyTouched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyValid: boolean;

  setValue(newValue: VALUE_TYPE): Field<VALUE_TYPE>;
  setTouched(touched: boolean): Field<VALUE_TYPE>;
  getAllMessagesInHierarchy(): ValidationMessage[];
  toJS(): VALUE_TYPE;
  map<T>(mapper: (field: Field<VALUE_TYPE>) => T): T;
}

export function createField<VALUE_TYPE>(opts: CreateFieldOpts<VALUE_TYPE>): Field<VALUE_TYPE>;

/*
 * MapForm
 */

export interface MapFormItems {
  [path: string]: Item;
}

export interface CreateMapFormOpts<VALUE_TYPE extends MapFormItems> {
  items?: VALUE_TYPE;
  touched?: boolean;
  validator?: (form: VALUE_TYPE) => ValidationResult;
}

export interface SetTouchedOptions {
  recurse: boolean;
}

export interface MapForm<VALUE_TYPE extends MapFormItems> {
  readonly touched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  put<P extends string, I extends ExistingOrNewItemType<VALUE_TYPE, P>>(path: P, item: I): MapForm<VALUE_TYPE & { [Path in P]: I}>
  get<P extends keyof VALUE_TYPE>(path: P): VALUE_TYPE[P];
  getIn<P extends Path<VALUE_TYPE>>(path: P): NestedValueType<VALUE_TYPE, P>;
  remove<P extends keyof VALUE_TYPE>(path: P): MapForm<Omit<VALUE_TYPE, P>>;
  reduce<R>(reducer: (acc: R, cur: VALUE_TYPE[keyof VALUE_TYPE], key: keyof VALUE_TYPE) => R, seed: R): R;
  containsKey(key: keyof VALUE_TYPE): boolean;
  updateIn(path: string[], updater: (item: Item) => Item): MapForm<VALUE_TYPE>;
  setTouched(touched: boolean, opts?: SetTouchedOptions): MapForm<VALUE_TYPE>;
  getAllMessagesInHierarchy(): ValidationMessage[];
  toJS(): ItemValueType<MapForm<VALUE_TYPE>>;
}

export function createMapForm<VALUE_TYPE extends MapFormItems>(opts?: CreateMapFormOpts<VALUE_TYPE>): MapForm<VALUE_TYPE>;

/*
 * ListForm
 */

export interface CreateListFormOpts<VALUE_TYPE extends Item[]> {
  items?: VALUE_TYPE;
  touched?: boolean;
  validator?: (form: VALUE_TYPE) => ValidationResult;
}

export interface ListForm<VALUE_TYPE extends Item[]> {
  readonly size: number;
  readonly touched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  push(item: VALUE_TYPE[number]): ListForm<VALUE_TYPE>;
  insert(index: number, item: VALUE_TYPE[number]): ListForm<VALUE_TYPE>;
  set(index: number, item: VALUE_TYPE[number]): ListForm<VALUE_TYPE>;
  unshift(item: VALUE_TYPE[number]): ListForm<VALUE_TYPE>;
  remove(index: number): ListForm<VALUE_TYPE>;
  get(index: number): VALUE_TYPE[number] | undefined;
  getIn<P extends Path<VALUE_TYPE>>(path: P): NestedValueType<VALUE_TYPE, P>;
  updateIn(path: string[], updater: (item: Item) => Item): ListForm<VALUE_TYPE>;
  setTouched(touched: boolean, opts?: SetTouchedOptions): ListForm<VALUE_TYPE>;
  getAllMessagesInHierarchy(): ValidationMessage[];
  map<M>(mapper: (item: VALUE_TYPE[number]) => M): M[];
  reduce<R>(reducer: (acc: R, cur: VALUE_TYPE[number], index: number) => R, seed: R): R;
  moveUp(index: number): ListForm<VALUE_TYPE>;
  moveDown(index: number): ListForm<VALUE_TYPE>;
  toJS(): ItemValueType<VALUE_TYPE[number]>[];
}

export function createListForm<VALUE_TYPE extends Item[]>(opts: CreateListFormOpts<VALUE_TYPE>): ListForm<VALUE_TYPE>;

/*
 * Validation
 */
export type Severity = 'error' | 'warning' | 'info' | 'ok';
export type ValidationResult = ValidationMessage[] | null | undefined;

export interface ValidationMessage {
  severity: Severity;
  message?: string;

  // A JSON path describing the path to the form item. This
  // field gets automatically populated when calling
  // getAllMessagesInHierarchy().
  path?: string;
}

export function notBlankValidator(s?: string): ValidationResult;
export function alwaysValidValidator(v: any): ValidationResult;
export function composeValidators(...validators: ((v: any) => ValidationResult)[]): (v: any) => ValidationResult;
