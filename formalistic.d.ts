export type Item = Field<any> | MapForm<any> | ListForm<any>;
type ItemValueType<I extends Item> = I extends Field<infer FT>
  ?  FT
  : I extends MapForm<infer MIT>
    ?  { [Key in keyof MIT]: ItemValueType<MIT[Key]> }
    : I extends ListForm<infer LIT>
      ? ItemValueType<LIT[number]>[]
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
  items?: Partial<VALUE_TYPE>;
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

  put<P extends keyof VALUE_TYPE>(path: P, item: VALUE_TYPE[P]): MapForm<VALUE_TYPE>;
  get<P extends keyof VALUE_TYPE>(path: P): VALUE_TYPE[P] | undefined;
  getIn(path: string[]): Item;
  remove(path: keyof VALUE_TYPE): MapForm<VALUE_TYPE>;
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
  getIn(path: string[]): Item;
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
