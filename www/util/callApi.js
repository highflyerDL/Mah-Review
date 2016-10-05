import fetch from 'isomorphic-fetch';
import {getItemLocalStorage} from "../util/storageFactory";

const api_url = "http://localhost:3000/api/";

function callJsonApi(api, body, method="get"){
  return fetch(api_url+api, {
    headers: { 'content-type': 'application/json' },
    method,
    body: JSON.stringify(body)
  })
  .then(response => response.json().then(json => ({json, response})))
  .then(({json, response})=>{
    if(!response.ok){
      return Promise.reject(json); 
    }

    return json;
  });
}  

function callQueryParamsApi(api, params, method="get"){
  var keys = Object.keys(params);
  var esc = encodeURIComponent;
  if(keys.length > 0){
    var query = keys
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
    api += "?"+query;
  }
  return fetch(api_url+api, {
    headers: {}, method
  })
  .then(response => response.json().then(json => ({json, response})))
  .then(({json, response})=>{
    if(!response.ok){
      return Promise.reject(json); 
    }

    return json;
  });
}

function callFormDataApi(api, body, method="get"){
  return fetch(api_url+api, {
    headers: {
      "Authorization": getItemLocalStorage("token")
    },
    method,
    body: body
  })
  .then(response => response.json().then(json => ({json, response})))
  .then(({json, response})=>{
    if(!response.ok){
      return Promise.reject(json); 
    }

    return json;
  });
}

export {callJsonApi, callQueryParamsApi, callFormDataApi};