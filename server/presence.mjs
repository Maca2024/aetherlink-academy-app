import Redis from 'ioredis';
export class Presence {
 constructor(url,{prefix='academy',ttl=15}={}){
  const parsed=new URL(url);
  if(parsed.protocol!=='rediss:')throw Error('Redis requires TLS');
  if(!/^[a-zA-Z0-9:_-]+$/.test(prefix))throw Error('Invalid presence namespace');
  this.prefix=prefix;this.ttl=ttl;
  this.redis=new Redis(url,{lazyConnect:true,maxRetriesPerRequest:1,connectTimeout:10000,tls:{rejectUnauthorized:true},retryStrategy:attempt=>Math.min(attempt*250,3000)});
  this.redis.on('error',()=>{});
 }
 async connect(){await this.redis.connect();if(await this.redis.ping()!=='PONG')throw Error('Redis is unavailable');return this;}
 key(room,person){return `${this.prefix}:presence:${encodeURIComponent(room)}:${encodeURIComponent(person)}`;}
 async touch(room,person){await this.redis.set(this.key(room,person),'1','EX',this.ttl);}
 async members(room,people){if(!people.length)return new Set();const values=await this.redis.mget(...people.map(person=>this.key(room,person)));return new Set(people.filter((_,i)=>values[i]!==null));}
 async remove(room,person){await this.redis.del(this.key(room,person));}
 close(){this.redis.disconnect();}
}
