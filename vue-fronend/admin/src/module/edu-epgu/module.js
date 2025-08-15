const modules = [
  require('./modules/dictonary/module'),
  require('./modules/message/module'),
]

export function children() {
  return modules
}

