const cloneDeep = require('clone-deep');

export default function cloneDeepArray(a) {

  let r = [];

  a.forEach((v)=>{
    r.push(cloneDeep(v));
  })

  return r;
}
