export function count(a, b){
  return a - b
}
export function sum(...args){
  console.log(args)
  args.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur
  })
}