import fetch from 'isomorphic-fetch';

const api_url = "http://localhost:3000/api/";

export default function callApi(api, method="get", body){
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