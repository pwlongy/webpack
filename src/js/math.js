export function sumCount(...args){
  return args.reduce((p,c) => p+c, 0)
}