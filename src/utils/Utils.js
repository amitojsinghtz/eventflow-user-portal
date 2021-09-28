import _ from "lodash";

export const isEmpty = (obj) => {
  if (Array.isArray(obj)) {
    if (obj.length > 0)
      return false;
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
  }
  return true;
}

export const setFormParams = (params, formData, str, returnurl) => {
  let data = '', key = '', end = '';
  params.forEach((o) => {
    key = o.toLowerCase();
    data = formData[key];
    if(key==='namecode')
      end = `&${key}=${encodeURIComponent(data)}`;
    else
      str = `${str}${key}=${encodeURIComponent(data)}&`;
  })
  if(returnurl)
    str = `${str}returnurl=${encodeURIComponent(formData.returnurl)}${end}`
  else
    str = str.slice(0, -1)+end;

  console.log(str);

  return str;
  //console.log(str);
  //return encodeURI(str.slice(0, -1));
  //setFormData({ ...formData, params: encodeURI(str) });
}

export const checkParamsValue = (params, data, formData)=>{
  params.forEach((o) => {
    if(data[o]){
      formData = {...formData, [o.toLowerCase()]:data[o]};
    }
  })
  return formData; 
}

export const extractValues = (keys, data)=>{
  console.log(data);
  let results = [];
  for (const key in data) {
    if((keys.indexOf(data[key].name)>-1) && data[key].answer)
    results.push(data[key]);
  };
  return results;
  //console.log(results);
  //const results = _.pluck(data, 'answers');
  //console.log(results);
}