export function getToken(){return sessionStorage.getItem('academy-token');}
export async function api(path,body){const response=await fetch('/game/'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',...(getToken()?{authorization:`Bearer ${getToken()}`}:{})},body:body?JSON.stringify(body):undefined});const data=await response.json();if(!response.ok)throw Error(data.error||'Verzoek mislukt.');return data;}
export function saveSession(data){sessionStorage.setItem('academy-token',data.token);}
