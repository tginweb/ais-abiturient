import Vue from 'vue'

const cloneDeep = require('clone-deep');

export class SmartQueryWrapper {

  constructor(com, name, options) {

    options = {
      compVars: (data) => {
        return data
      },
      deep: true,
      ...options
    }

    let dataVars

    if (typeof options.dataVars === 'function') {
      dataVars = options.dataVars();
    } else if (typeof options.dataVars === 'object') {
      dataVars = options.dataVars;
    } else {
      dataVars = {}
    }

    this.dataVars = Vue.observable(dataVars);
    this._dataVars = Vue.observable(cloneDeep(dataVars));
    this.name = name
    this.vars = {}

    if (!options.update) {
      options.update = (data) => {
        return data[options.resultKey || 'res'];
      }
    }

    let wrap = () => {
      return options.compVars(this.dataVars);
    }

    this.unwatch = com.$watch(
      wrap,
      (v) => {
        this.vars = v;
      },
      {immediate: true, deep: true}
    )

    options.variables = wrap;

    this.host = com.$apollo.addSmartQuery(name, options)

    if (com.$isServer && !options.skip) {
        com.$_apolloPromises.push(this.host.firstRun)
    }
  }

  setFilter(name, val) {
    if (val)
      Vue.set(this._dataVars.filter, name, val)
    else

      var values = Object.keys(name).reduce((map, filterKey) => {
        let filterValue = name[filterKey]

        if (filterValue && (!Array.isArray(filterValue) || filterValue.length>0))
          map[filterKey] = filterValue

        return map
      }, {});

      Vue.set(this._dataVars, 'filter', values)
  }

  setNav(nav) {
    Object.assign(this._dataVars.nav, nav)
  }

  setPage(val) {
    Vue.set(this._dataVars.nav, 'page', val)
  }

  setAfter(val) {
    Vue.set(this._dataVars.nav, 'after', val)
  }

  setLimit(val) {
    Vue.set(this._dataVars.nav, 'limit', val)
  }

  commit() {
    Object.assign(this.dataVars, this._dataVars)
  }

  destroy() {
    this.unwatch()
  }

}
