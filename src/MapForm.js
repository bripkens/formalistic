import {freeze, emptyObject, shallowCopyObject} from './util';

export default function createMapForm(opts) {
  return new MapForm(opts || emptyObject);
}

class MapForm {
  constructor(opts) {
    this.items = freeze(opts.items || emptyObject);
    freeze(this);
  }

  put(key, item) {
    if (this.items[key] === item) {
      return this;
    }
    const items = shallowCopyObject(this.items);
    items[key] = item;
    return new MapForm({
      items
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
        items
      });
    }
    return this;
  }
}
