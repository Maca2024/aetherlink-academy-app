// Slide HTML helpers ported from the agent-native slides template:
// hashSlideContent (shared/slide-fit.ts), sanitizeSlideContent
// (actions/export-html.ts), the `.fmd-slide` wrapper contract and templates
// (.agents/skills/create-deck) and ensureUniqueSlideIds (shared/slide-ids.ts).
import {randomBytes} from 'node:crypto';
import type {Layout,SlideInput} from './schema.ts';

/** FNV-1a, identical to upstream so hashes stay comparable across tools. */
export function hashSlideContent(content:string):string{
 let hash=2166136261;
 for(let index=0;index<content.length;index+=1){hash^=content.charCodeAt(index);hash=Math.imul(hash,16777619);}
 return (hash>>>0).toString(16);
}

const BLOCKED=/<(script|iframe|object|embed|form|meta|base|link|style)\b[\s\S]*?<\/\1>/gi;
const BLOCKED_VOID=/<(script|iframe|object|embed|form|meta|base|link)\b[^>]*\/?>/gi;
const HANDLERS=/\s+on[a-z][\w:-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const SRCDOC=/\s+srcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URL=/\s(href|src|xlink:href|action|formaction)\s*=\s*(["']?)\s*(?:javascript|vbscript|data:text\/html)[^"'\s>]*\2/gi;
/** Strip active content. Stored HTML is rendered inside the app and in exports. */
export function sanitizeSlideContent(html:string):string{
 let previous='';let next=html;
 while(previous!==next){previous=next;next=next.replace(BLOCKED,'').replace(BLOCKED_VOID,'').replace(HANDLERS,'').replace(SRCDOC,'').replace(DANGEROUS_URL,' $1="#"');}
 return next;
}

export function escapeHtml(value:string):string{
 return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
}

/** Plain-text preview for compact reads (upstream get-deck compact mode). */
export function textPreview(html:string,max=160):string{
 const text=html.replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
 return text.length>max?text.slice(0,max-1)+'…':text;
}

export const newSlideId=()=>`slide-${randomBytes(6).toString('base64url')}`;

/** Every slide starts from the same semantic `--deck-*` wrapper contract. */
export const SLIDE_WRAPPER_STYLE='--deck-bg: var(--ds-bg, Canvas); --deck-ink: var(--ds-text, CanvasText); --deck-muted: var(--ds-text-muted, GrayText); --deck-accent: var(--ds-accent, currentColor); --deck-surface: var(--ds-surface, transparent); --deck-heading-font: var(--ds-heading-font, sans-serif); --deck-body-font: var(--ds-body-font, sans-serif); --deck-radius: var(--ds-radius, 0px); background: var(--deck-bg); color: var(--deck-ink); padding: 64px 80px; display: flex; flex-direction: column; font-family: var(--deck-body-font);';
const wrap=(inner:string,extra='justify-content: flex-start; gap: 18px;')=>`<div class="fmd-slide" style="${SLIDE_WRAPPER_STYLE} ${extra}">\n${inner}\n</div>`;
const label=(text:string|undefined)=>text?`  <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--deck-accent);">${escapeHtml(text)}</div>\n`:'';
const heading=(text:string|undefined,level:'h1'|'h2')=>text?`  <${level} style="font-size: ${level==='h1'?56:34}px; font-weight: 750; font-family: var(--deck-heading-font); line-height: ${level==='h1'?1.05:1.12}; letter-spacing: -0.03em; margin: 0; max-width: 760px;">${escapeHtml(text)}</${level}>\n`:'';
const point=(text:string)=>`    <div style="border-left: 3px solid var(--deck-accent); padding: 12px 16px; background: var(--deck-surface); border-radius: var(--deck-radius); font-size: 18px; line-height: 1.4;">${escapeHtml(text)}</div>`;
const placeholder=(text:string)=>`    <div class="fmd-img-placeholder" style="min-height: 220px; border-radius: var(--deck-radius); display: grid; place-items: center; color: var(--deck-muted); border: 1px dashed var(--deck-muted);">${escapeHtml(text)}</div>`;

/** Build wrapper HTML from structured fields when an author gives no `content`. */
export function templateSlide(input:Pick<SlideInput,'heading'|'body'|'label'|'layout'>):{content:string;layout:Layout}{
 const layout:Layout=input.layout??(input.body?.length?'content':'title');
 const body=input.body??[];
 switch(layout){
  case 'title':return {layout,content:wrap(label(input.label)+heading(input.heading,'h1')+(body[0]?`  <p style="font-size: 20px; color: var(--deck-muted); margin: 4px 0 0;">${escapeHtml(body[0])}</p>`:''),'justify-content: center; align-items: flex-start; gap: 18px;')};
  case 'two-column':{const half=Math.ceil(body.length/2);const column=(items:string[])=>`    <div style="display: flex; flex-direction: column; gap: 14px;">\n${items.map(point).join('\n')}\n    </div>`;return {layout,content:wrap(label(input.label)+heading(input.heading,'h2')+`  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">\n${column(body.slice(0,half))}\n${column(body.slice(half))}\n  </div>`)};}
  case 'image':return {layout,content:wrap(label(input.label)+heading(input.heading,'h2')+`  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">\n    <div style="display: flex; flex-direction: column; gap: 14px;">\n${body.slice(0,3).map(point).join('\n')}\n    </div>\n${placeholder(input.body?.[3]??'[Visual]')}\n  </div>`)};
  case 'blank':return {layout,content:wrap(input.heading?heading(input.heading,'h2'):'')};
  default:return {layout:'content',content:wrap(label(input.label)+heading(input.heading,'h2')+`  <div style="display: flex; flex-direction: column; gap: 14px;">\n${body.map(point).join('\n')}\n  </div>`)};
 }
}

/** Repair missing or duplicate ids without renaming the first occurrence. */
export function ensureUniqueSlideIds<T extends {id?:string}>(slides:readonly T[]):T[]{
 const used=new Set<string>();
 return slides.map(slide=>{
  if(slide.id&&!used.has(slide.id)){used.add(slide.id);return slide;}
  let next=newSlideId();while(used.has(next))next=newSlideId();used.add(next);
  return {...slide,id:next};
 });
}
