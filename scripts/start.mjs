import {spawn} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,existsSync,cpSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {loadEnvFile} from 'node:process';
import {validateRuntimeEnvironment} from '../server/runtime-config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
if(process.env.ACADEMY_ENV_FILE)loadEnvFile(path.resolve(process.env.ACADEMY_ENV_FILE));
const storageMode=process.env.ACADEMY_STORAGE||'postgres';
validateRuntimeEnvironment(process.env);
const dir=path.resolve(process.env.ACADEMY_DATA||path.join(root,'.data'));
mkdirSync(dir,{recursive:true,mode:0o700});
const snapshots=path.join(dir,'snapshots');
const legacySnapshots=path.join(root,'vendor/proof-sdk/snapshots');
if(existsSync(legacySnapshots))cpSync(legacySnapshots,snapshots,{recursive:true,force:false,errorOnExist:false});
mkdirSync(snapshots,{recursive:true,mode:0o700});
const keyFile=path.join(dir,'proof-signing-key');
if(!process.env.PROOF_COLLAB_SIGNING_SECRET&&!existsSync(keyFile))writeFileSync(keyFile,randomBytes(32).toString('hex'),{mode:0o600});
const signingSecret=process.env.PROOF_COLLAB_SIGNING_SECRET||readFileSync(keyFile,'utf8');
const port=Number(process.env.PORT||4317),proofPort=Number(process.env.PROOF_PORT||4400);
const publicUrl=process.env.ACADEMY_PUBLIC_URL||`http://127.0.0.1:${port}`;
let storage;
if(storageMode==='postgres'){
 const {createStorage}=await import('../server/storage.mjs');
 storage=await createStorage({databaseUrl:process.env.DATABASE_URL,redisUrl:process.env.REDIS_URL||process.env.KV_URL,schema:process.env.ACADEMY_DATABASE_SCHEMA||'academy',prefix:process.env.ACADEMY_REDIS_PREFIX||'academy'});
}
const proof=spawn(process.execPath,['--import','tsx','server/index.ts'],{cwd:path.join(root,'vendor/proof-sdk'),env:{...process.env,PORT:String(proofPort),HOST:'127.0.0.1',PROOF_COLLAB_SIGNING_SECRET:signingSecret,COLLAB_ATTACH_TO_MAIN_HTTP:'true',COLLAB_PUBLIC_BASE_URL:publicUrl.replace(/^http/,'ws')+'/ws',PROOF_PUBLIC_BASE_URL:publicUrl,VITE_ENABLE_TELEMETRY:'false'},stdio:['ignore','inherit','inherit']});
let server,stopping=false;
async function stop(code=0){
 if(stopping)return;stopping=true;
 const deadline=setTimeout(()=>{proof.kill('SIGKILL');process.exit(code||1);},25000);deadline.unref();
 server?.close();server?.closeAllConnections();
 const proofExit=new Promise(resolve=>{if(proof.exitCode!==null||proof.signalCode!==null)resolve();else{proof.once('exit',resolve);proof.kill('SIGTERM');}});
 await Promise.all([proofExit,storage?.close()]);
 clearTimeout(deadline);process.exit(code);
}
process.on('SIGINT',()=>void stop());process.on('SIGTERM',()=>void stop());
proof.on('error',()=>void stop(1));
proof.on('exit',()=>{if(!stopping){console.error('Proof is gestopt; Academy stopt zodat de supervisor beide kan herstarten.');void stop(1);}});
try{
 let ready=false;
 for(let i=0;i<80;i++){try{const res=await fetch(`http://127.0.0.1:${proofPort}/health`,{signal:AbortSignal.timeout(1000)});if(res.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
 if(!ready)throw Error('Proof kon niet starten.');
 const {createApp}=await import('../server/app.mjs');
 ({server}=createApp({dir,root,proofBase:`http://127.0.0.1:${proofPort}`,hostKey:process.env.ACADEMY_HOST_KEY,publicBaseUrl:publicUrl,...storage}));
 server.on('error',()=>void stop(1));
 server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Academy: http://127.0.0.1:${port}\nAcademy storage: ${storageMode}. Proof storage: PostgreSQL, shared Redis.\nFacilitator-startsleutel: ${process.env.ACADEMY_HOST_KEY?'serveromgeving':path.join(dir,'host-key')}\nProof is alleen op loopback bereikbaar.`));
}catch(error){console.error(error.message);await stop(1);}
