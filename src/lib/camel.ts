const obj = {
  first_name: "Prasanth",
  last_name: "Pittu",
  age: 22,
};

function camel(obj:Record<string,string>={}) {
  const res:Record<string, string> = {};
  if (typeof obj === "object") {
    for (const k of Object.keys(obj)) {
      const result = k.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      res[result] = obj[k];
    }
  }
  return res;
}

console.log(camel(obj));
