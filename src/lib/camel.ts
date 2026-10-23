const obj = {
  first_name: "Prasanth",
  last_name: "Pittu",
  age: 22,
};

function removeFalsy(obj:any) {
  const res:any = {};
  for(const key of Object.keys(obj)){
    const value = obj[key];

    if(value){
        res[key] = value;
    }

  }
  return res;
}

console.log(removeFalsy(obj));
