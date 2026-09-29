'use strict';
const providers=[
 {id:'chatgpt',name:'ChatGPT',icon:'◎',description:'Ideas, writing & everyday questions',url:'https://chatgpt.com/',parameter:'q',color:'#247660',bg:'#e8f4ee'},
 {id:'claude',name:'Claude',icon:'✳',description:'Thoughtful writing & analysis',url:'https://claude.ai/new',parameter:'q',color:'#bb6c4c',bg:'#faeee8'},
 {id:'perplexity',name:'Perplexity',icon:'⌘',description:'Research & source discovery',url:'https://www.perplexity.ai/search',parameter:'q',color:'#31858b',bg:'#e5f2f3'},
 {id:'gemini',name:'Gemini',icon:'✦',description:'Explore ideas with Google AI',url:'https://gemini.google.com/app',color:'#557bd6',bg:'#edf0ff'},
 {id:'copilot',name:'Copilot',icon:'C',description:'Your Microsoft AI companion',url:'https://copilot.microsoft.com/',color:'#478b95',bg:'#e8f4f2'},
 {id:'grok',name:'Grok',icon:'𝕏',description:'Questions, ideas & conversation',url:'https://grok.com/',color:'#383643',bg:'#eeeeF2'},
 {id:'deepseek',name:'DeepSeek',icon:'D',description:'Reasoning & coding questions',url:'https://chat.deepseek.com/',color:'#526bdd',bg:'#ebefff'},
 {id:'mistral',name:'Mistral Le Chat',icon:'M',description:'Create, explore & solve',url:'https://chat.mistral.ai/',color:'#db8b24',bg:'#fff3dd'},
 {id:'poe',name:'Poe',icon:'P',description:'Explore a variety of AI bots',url:'https://poe.com/',color:'#8262bb',bg:'#f0eafa'}
];
let selected=0;
const promptBox=document.querySelector('#prompt'),launch=document.querySelector('#launch'),feedback=document.querySelector('#feedback'),retry=document.querySelector('#retry');
const grid=document.querySelector('#tools');
providers.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='tool';b.setAttribute('role','radio');b.setAttribute('aria-checked',String(i===selected));b.tabIndex=i===selected?0:-1;b.setAttribute('aria-label',p.name+', '+(p.parameter?'prompt link':'copy and open'));b.innerHTML=`<span class="tool-icon" style="--color:${p.color};--bg:${p.bg}" aria-hidden="true">${p.icon}</span><span class="tool-body"><span class="tool-name">${p.name}</span><span class="tool-desc">${p.description}</span><span class="tool-mode ${p.parameter?'direct':''}">${p.parameter?'Prompt link':'Copy & open'}</span></span><span class="radio" aria-hidden="true"></span>`;b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{const delta=['ArrowRight','ArrowDown'].includes(e.key)?1:['ArrowLeft','ArrowUp'].includes(e.key)?-1:0;if(delta){e.preventDefault();select((selected+delta+providers.length)%providers.length);grid.children[selected].focus();}});grid.append(b);});
function select(i){selected=i;[...grid.children].forEach((b,n)=>{b.setAttribute('aria-checked',String(n===i));b.tabIndex=n===i?0:-1});launch.textContent=providers[i].parameter?'Ask '+providers[i].name:'Copy & open '+providers[i].name;feedback.textContent='';retry.hidden=true;}
function getPrompt(){const q=promptBox.value.trim();if(!q){feedback.textContent='Start with a question above, then choose your AI.';promptBox.focus();return null}return q;}
function fallbackCopy(q){const start=promptBox.selectionStart,end=promptBox.selectionEnd;promptBox.focus();promptBox.select();let ok=false;try{ok=document.execCommand('copy')}catch{}promptBox.setSelectionRange(start,end);return ok;}
async function copyText(q){try{await navigator.clipboard.writeText(q);return true}catch{return fallbackCopy(q)}}
document.querySelector('#copy').addEventListener('click',async()=>{const q=getPrompt();if(!q)return;feedback.textContent=await copyText(q)?'Prompt copied. Paste it into any AI tool.':'Copy was blocked. Select your prompt and copy it manually.';});
document.querySelector('#clear').addEventListener('click',()=>{promptBox.value='';feedback.textContent='';retry.hidden=true;promptBox.focus();});
launch.addEventListener('click',async()=>{const q=getPrompt();if(!q)return;const p=providers[selected],url=new URL(p.url);const direct=Boolean(p.parameter)&&q.length<=6000;if(direct)url.searchParams.set(p.parameter,q);retry.href=url.href;retry.textContent='Open '+p.name+' manually';retry.hidden=true;
// Open synchronously so browser user activation is preserved during clipboard permission prompts.
const tab=window.open('about:blank','_blank');if(tab){tab.opener=null;tab.location.replace(url.href)}else{retry.hidden=false;}
if(direct){feedback.textContent=tab?'Opened '+p.name+'. If your question isn’t filled in, copy it here and paste it there.':'Your browser blocked the new tab. Use the link below.';return;}
const copied=await copyText(q);feedback.textContent=(copied?'Prompt copied. Paste it into '+p.name+'.':'Copy was blocked. Select and copy your prompt manually, then paste it into '+p.name+'.')+(tab?'':' Use the link below to open the tool.');
});
promptBox.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();launch.click();}});
