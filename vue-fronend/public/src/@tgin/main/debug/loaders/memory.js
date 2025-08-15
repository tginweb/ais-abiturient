let timer = null

export function boot({Vue}) {

  return;

  timer = setInterval(()=>{
    console.log(`------------------------`);
    const used = process.memoryUsage();
    for (let key in used) {
      console.log(`Memory: ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    console.log(`------------------------`);
  }, 60000)
}

export function request(ctx) {

}
