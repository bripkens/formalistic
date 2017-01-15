import {freeze, emptyObject, shallowCopyObject} from './util';

export default function createMapForm(opts) {
  return new MapForm(opts || emptyObject);
}

class MapForm {
  constructor(opts) {
    this.items = freeze(opts.items || emptyObject);
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false;
    freeze(this);
  }

  put(key, item) {
    if (this.items[key] === item) {
      return this;
    }
    const items = shallowCopyObject(this.items);
    items[key] = item;
    return new MapForm({
      items,
      touched: this.touched
    });
  }

  get(key) {
    return this.items[key];
  }

  remove(key) {
    if (key in this.items) {
      const items = shallowCopyObject(this.items);
      delete items[key];
      return new MapForm({
        items,
        touched: this.touched
      });
    }
    return this;
  }

  updateIn(path, fn, i=0) {
    const key = path[i];
    const item = this.get(key);

    if (!item) {
      throw new Error(`No item to update at path "${path.slice(0, i + 1).join('.')}"`);
    }


    if (path.length - 1 === i) {
      return this.put(key, fn(item));
    }

    return this.put(key, item.updateIn(path, fn, i + 1));
  }

  setTouched(touched) {
    return new MapForm({
      items: this.items,
      touched
    });
  }

  toJS() {
    const result = {};

    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        result[key] = this.items[key].toJS();
      }
    }

    return result;
  }
}
