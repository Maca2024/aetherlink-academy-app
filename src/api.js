export function getToken(){return sessionStorage.getItem('academy-token');}
async function request(path,body,token=false,method=body?'POST':'GET'){const response=await fetch(path,{method,headers:{'content-type':'application/json',...(token&&getToken()?{authorization:`Bearer ${getToken()}`}:{})},body:body?JSON.stringify(body):undefined}),data=response.status===204?null:await response.json();if(!response.ok)throw Error(data?.error||'Verzoek mislukt.');return data;}
export const api=(path,body)=>request('/game/'+path,body,true);
export const apiMethod=(method,path,body)=>request('/game/'+path,body,true,method);
export const authApi=(path,body)=>request('/auth/'+path,body);
export function saveSession(data){sessionStorage.setItem('academy-token',data.token);}
