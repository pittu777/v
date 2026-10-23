const obj = {
  first_name: "Prasanth",
  last_name: "Pittu",
  age: 22,
};
const src={
    name:"pittu"
}
function conformsTo(obj:any, src:any) {
  for(const k of Object.keys(src)){
   if(obj[k] !== src[k]){
    return false;
   }

    

  }
  return true;
}

console.log(conformsTo(obj, src));
