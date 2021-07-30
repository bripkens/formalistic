export type Item = Field<any> | MapForm | ListForm;

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

export interface CreateMapFormOpts {
  items?: MapFormItems;
  touched?: boolean;
  validator?: (form: MapFormItems) => ValidationResult;
}

export interface SetTouchedOptions {
  recurse: boolean;
}

export interface MapForm {
  readonly touched: boolean;
  readonly hierarchyTouched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  put(path: string, item: Item): MapForm;
  get(path: string): Item | undefined;
  getIn(path: string[]): Item;
  remove(path: string): MapForm;
  reduce<R>(reducer: (acc: R, cur: Item, key: string) => R, seed: R): R;
  containsKey(key: string): boolean;
  updateIn(path: string[], updater: (item: Item) => Item): MapForm;
  setTouched(touched: boolean, opts?: SetTouchedOptions): MapForm;
  getAllMessagesInHierarchy(): ValidationMessage[];
  toJS(): { [path: string]: any };
}

export function createMapForm(opts?: CreateMapFormOpts): MapForm;

/*
 * ListForm
 */

export interface CreateListFormOpts {
  items?: Item[];
  touched?: boolean;
  validator?: (form: Item[]) => ValidationResult;
}

export interface ListForm {
  readonly size: number;
  readonly touched: boolean;
  readonly hierarchyTouched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  push(item: Item): ListForm;
  insert(index: number, item: Item): ListForm;
  set(index: number, item: Item): ListForm;
  unshift(item: Item): ListForm;
  remove(index: number): ListForm;
  get(index: number): Item | undefined;
  getIn(path: string[]): Item;
  updateIn(path: string[], updater: (item: Item) => Item): ListForm;
  setTouched(touched: boolean, opts?: SetTouchedOptions): ListForm;
  getAllMessagesInHierarchy(): ValidationMessage[];
  map(mapper: (item: Item) => any): any[];
  reduce<R>(reducer: (acc: R, cur: Item, index: number) => R, seed: R): R;
  moveUp(index: number): ListForm;
  moveDown(index: number): ListForm;
  toJS(): any[];
}

export function createListForm(opts: CreateListFormOpts): ListForm;

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
