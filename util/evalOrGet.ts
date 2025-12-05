
const evalOrGet = (x:any) => {
  return typeof x=='function'?x():x;
}

export default evalOrGet;