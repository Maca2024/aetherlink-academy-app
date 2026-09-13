#!/usr/bin/env node
import {serveStdio} from '@modelcontextprotocol/server/stdio';
import {createAcademyMcpServer} from './mcp-tools.mjs';
const base=process.env.ACADEMY_URL||'http://127.0.0.1:4317';
const token=process.env.ACADEMY_TOKEN;
if(!token){console.error('ACADEMY_TOKEN ontbreekt. Maak een persoonlijke MCP-token in Mijn leercoach.');process.exit(1);}
serveStdio(()=>createAcademyMcpServer(async(tool,args)=>{const response=await fetch(`${base}/game/mcp/${tool}`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(25000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Gameverzoek mislukt.');return data;}));
