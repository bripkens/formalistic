type Item = Field<any> | MapForm | ListForm;

/*
 * Fields
 */

export interface CreateFieldOpts<VALUE_TYPE> {
  value: VALUE_TYPE;
  isEqual?: (a: VALUE_TYPE, b:VALUE_TYPE) => boolean;
  touched?: boolean;
  validator?: (value: VALUE_TYPE) => ValidationResult;
}

export interface Field<VALUE_TYPE> {
  readonly value: VALUE_TYPE;
  readonly touched: boolean;
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyValid: boolean;

  setValue(newValue: VALUE_TYPE): Field<VALUE_TYPE>;
  setTouched(touched: boolean): Field<VALUE_TYPE>;
  toJS(): VALUE_TYPE;
  map<T>(mapper: ((field: Field<VALUE_TYPE>) => T)): T;
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
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  put(path: string, item: Item): MapForm;
  get(path: string): Item | undefined;
  remove(path: string): MapForm;
  reduce<R>(reducer: ((acc: R, cur: Item, key: string) => R)): R
  containsKey(key: string): boolean;
  updateIn(path: string[], updater: ((item: Item) => Item)): MapForm;
  setTouched(touched: boolean, opts?: SetTouchedOptions): MapForm;
  toJS(): {[path: string]: any};
}

export function createMapForm(opts: CreateMapFormOpts): MapForm;


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
  readonly messages: ValidationMessage[];
  readonly maxSeverity: Severity;
  readonly valid: boolean;
  readonly maxSeverityOfHierarchy: Severity;
  readonly hierarchyTouched: boolean;
  readonly hierarchyValid: boolean;

  push(item: Item): ListForm;
  set(index: number, item: Item): ListForm;
  unshift(item: Item): ListForm;
  remove(index: number): ListForm;
  get(index: number): Item | undefined;
  updateIn(path: string[], updater: ((item: Item) => Item)): ListForm;
  setTouched(touched: boolean, opts?: SetTouchedOptions): ListForm;
  map(mapper: ((item: Item) => any)): any[];
  moveUp(index: number): ListForm;
  moveDown(index: number): ListForm;
  toJS(): any[];
}

export function createListForm(opts: CreateListFormOpts): ListForm;


/*
 * Validation
 */
export type Severity = 'error' | 'warning' | 'info' | 'ok';
export type ValidationResult = ValidationMessage[] | null;

export interface ValidationMessage {
  severity: Severity;
  message?: string;
}

export function notBlankValidator(s: string): ValidationResult;
export function composeValidators(...validators: ((v: any) => ValidationResult)[]): any => ValidationResult;
