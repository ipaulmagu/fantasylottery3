export default class Condition {
  constructor(id, title, def, classNames) {
    this.id = id;
    this.title = title;
    this.def = def;
    this.fmt = [...classNames];
  }
  toString() {
    return `${this.id}; ${this.def}; ${this.fmt.join(", ")}`;
  }
}
