const $instances = {}

export function instance(name = 'default') {

  if (!$instances[name])
    $instances[name] = new Container()

  return $instances[name]
}

export default class Container {

  construct() {
    this.$map = {}
  }

  instance($name) {

  }

  create($name, $value) {
    this.set($name, $value);
    return this.get($name);
  }

  select($pattern) {
    const $result = [];
    this.map.filter(($value, $name) => {

    })
    return $result
  }

  set($name, $value, $info = []) {
    this.map[$name] = $value;
    return this;
  }

  get($name, $args = []) {
    if (typeof this.map[$name] === 'function')
      this.map[$name] = new this.map[$name];

    return this.map[$name];
  }

  make($name, $args = []) {
    if (typeof this.map[$name] === 'function')
      return new this.map[$name]();
    else
      return this.map[$name];
  }

}
