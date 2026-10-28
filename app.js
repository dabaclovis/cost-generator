'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const names = {proposal:'Proposal',followup:'Follow-up',scope:'Scope of work'};
const statuses={draft:'Draft',sent:'Sent',won:'Won',lost:'Lost'};
const profileFields=['name','contact','email','phone','website','address'];
const tones=['Professional & warm','Short & direct','Premium & polished'];
const templates = [
 {name:'The everyday office',icon:'▤',client:'Oak & Co. offices',price:1250,description:'A dependable cleaning plan for a busy workspace.',notes:'A 5,000 sq ft office needs cleaning 3 times a week after 6 pm. There are 2 restrooms, a kitchen, a reception area, and mostly carpet. Include vacuuming, mopping hard floors, restroom cleaning, kitchen surfaces, and trash removal. The client prefers eco-friendly products. Exclude exterior windows and carpet extraction.'},
 {name:'The welcoming storefront',icon:'▦',client:'Willow retail store',price:800,description:'Help a retail space make its best first impression.',notes:'A 2,000 sq ft retail store needs cleaning twice a week before opening. Include dusting accessible shelving, cleaning interior entry glass, mopping hard floors, one restroom, and emptying bins. Do not move merchandise. Exterior windows and floor restoration are excluded.'},
 {name:'The shared workspace',icon:'☷',client:'Common Ground coworking',price:2200,description:'Keep shared spaces ready for whatever comes next.',notes:'An 8,000 sq ft coworking space needs cleaning 5 evenings per week. Include meeting rooms, shared desks when clear, 4 restrooms, two kitchens, vacuuming, mopping, and bins. Private offices are excluded. Ask the client to confirm access arrangements and consumables before finalizing.'},
 {name:'The ready-to-train gym',icon:'▤',client:'Summit fitness studio',price:1600,description:'A recurring plan for fitness studios and shared training spaces.',notes:'A 4,000 sq ft fitness studio needs cleaning 5 evenings per week after closing. Include reception, accessible equipment touchpoints, mirrors, sealed floors, 2 restrooms, and bins. Follow equipment manufacturers instructions and agreed product contact times. Exclude pool areas, saunas, laundry, and biohazard cleanup. Confirm who supplies consumables and how equipment is secured.'},
 {name:'The learning environment',icon:'▦',client:'Maple tutoring center',price:1450,description:'Clear expectations for classrooms and education centers.',notes:'A 6,000 sq ft tutoring center needs cleaning 4 evenings per week when students have left. Include clear desks, accessible shelves, classroom floors, reception, 3 restrooms, and bins. Do not move student records or teaching materials. Exclude food preparation areas, high-level work, and bodily fluid cleanup. Confirm safeguarding, background-check requirements, site access, and holiday schedules before agreeing the service.'},
 {name:'The welcoming apartment lobby',icon:'☷',client:'Parkside apartment community',price:1800,description:'Keep residential common areas presentable without entering homes.',notes:'An apartment community has 7,000 sq ft of indoor common areas needing cleaning 3 mornings per week. Include lobby glass within safe reach, elevator interiors, mail area surfaces, corridors, stairs, and 2 shared restrooms. Exclude individual apartments, exterior work, waste hauling, and hazardous spills. Confirm resident access, wet-floor controls, parking, and who provides restroom consumables.'},
 {name:'The community gathering space',icon:'▤',client:'Cedar community hall',price:950,description:'A routine cleaning scope for halls and places of worship.',notes:'A 5,500 sq ft community hall needs cleaning twice per week following scheduled gatherings. Include entrance, meeting room floors, accessible seating surfaces, 3 restrooms, and bins. Food-service equipment, delicate ceremonial items, high ceilings, and event teardown are excluded. Additional events require a separately agreed price. Confirm the regular calendar, access, and storage arrangements.'},
 {name:'The organized warehouse office',icon:'▦',client:'Northgate logistics offices',price:1350,description:'Separate office cleaning from industrial operations and equipment.',notes:'A warehouse site has 4,500 sq ft of offices and staff welfare areas needing cleaning 3 evenings per week. Include offices, breakroom surfaces, 2 restrooms, corridors, floors, and bins. Exclude warehouse aisles, loading bays, machinery, chemical storage, and industrial waste. Confirm induction, PPE requirements, approved walkways, and a service window separate from vehicle movements.'},
 {name:'The polished showroom',icon:'☷',client:'Avenue furnishings showroom',price:1750,description:'A presentation-focused scope for customer-facing showrooms.',notes:'A 9,000 sq ft furnishings showroom needs cleaning 3 mornings per week before opening. Include clear floor areas, reception, accessible entry glass, sales offices, 2 restrooms, and bins. Dust only display surfaces approved by the client. Do not move products or use unapproved products on display finishes. Exclude exterior glazing, high-level fixtures, upholstery treatment, and floor restoration.'},
 {name:'The restaurant front of house',icon:'▤',client:'Juniper dining room',price:1550,description:'Define routine dining-area cleaning separately from kitchen work.',notes:'A restaurant has a 3,000 sq ft front-of-house area needing cleaning 5 mornings per week before staff setup. Include dining-room floors, entrance glass within reach, agreed non-food-contact surfaces, 2 customer restrooms, and general bins. Exclude kitchens, food-contact surfaces, grease traps, extraction systems, pest treatment, and hazardous waste. Confirm food-safety site procedures, approved products, and handover responsibilities.'},
 {name:'The client-ready salon',icon:'▦',client:'Studio Elm salon',price:1050,description:'A focused plan for salon reception, floors, and shared areas.',notes:'A 2,500 sq ft salon needs cleaning 3 evenings per week after staff have secured tools and products. Include reception, accessible mirrors, floors, one restroom, and general bins. Staff retain responsibility for tools, instrument reprocessing, hair-color chemicals, sharps, and regulated waste. Exclude treatment equipment and chemical spills. Confirm compatible surface products and access arrangements.'},
 {name:'The professional branch office',icon:'☷',client:'Harbor financial branch',price:1400,description:'Routine cleaning with clear boundaries around secure areas.',notes:'A 4,000 sq ft financial branch needs cleaning 4 evenings per week in an agreed supervised window. Include public lobby floors, clear meeting-room surfaces, staff breakroom, 2 restrooms, and general bins. Do not handle paperwork, devices, confidential waste, or items on occupied desks. Exclude vaults, cash-handling rooms, and restricted areas. Confirm escort requirements and access procedures directly with the client; do not put access codes in these notes.'}
];
let task='proposal',currentId=null,ai=false,busy=false,toastTimer,profile={name:'Your cleaning company'},saved=[];
let config={contactEmail:'info@application.com',bookingUrl:''};
try { const p=JSON.parse(localStorage.getItem('bidwell-profile')); if(p!==null){if(!validProfile(p))throw new Error('Invalid profile');profile=cleanProfile(p);} } catch { toast('Your saved business profile could not be loaded from browser storage.'); }
try { const s=JSON.parse(localStorage.getItem('bidwell-drafts')); if(s!==null){if(!Array.isArray(s)||s.length>50||!s.every(validSaved)||new Set(s.map(x=>x.id)).size!==s.length)throw new Error('Invalid drafts');saved=s;} } catch { toast('Your saved drafts could not be loaded from browser storage.'); }
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000)}
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{toast('Browser storage is unavailable or full. Download your draft to keep it.');return false}}
function updateCount(){$('#saved-count').textContent=saved.length}
function view(name){$$('.view').forEach(v=>v.hidden=v.id!==name+'-view');$$('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===name);if(b.dataset.view===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});$('#page-name').textContent={workspace:'Proposal studio',saved:'My proposals',templates:'Template library'}[name];if(name==='saved')renderSaved();window.scrollTo({top:0,behavior:'smooth'})}
function setTask(value){task=value;$$('[data-task]').forEach(b=>{b.classList.toggle('selected',b.dataset.task===task);b.setAttribute('aria-pressed',String(b.dataset.task===task))});$('#generate').innerHTML='<span>✦</span> Create my '+(task==='followup'?'follow-up':task==='scope'?'scope of work':'proposal')+' <span>→</span>';}
function useTemplate(index){if(busy)return toast('Please wait for the current draft to finish.');const t=templates[index];view('workspace');currentId=null;$('#result').value='';$('#refine').value='';$('#result-panel').hidden=true;setTask('proposal');$('#notes').value=t.notes;$('#client').value=t.client;$('#price').value=t.price;$('#notes').dispatchEvent(new Event('input',{bubbles:true}));$('#notes').focus();toast('Example loaded. Replace the sample details and price with your own.');}
function data(){return {task,notes:$('#notes').value.trim(),client:$('#client').value.trim(),price:Number($('#price').value),tone:$('#tone').value,business:profile.name}}
const money = amount => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount);
function draft(d){const price=money(d.price);const premium=d.tone==='Premium & polished';const direct=d.tone==='Short & direct';const opening=direct?'Here is our proposed cleaning plan.':premium?'A thoughtfully maintained space makes a lasting impression. We would welcome the opportunity to care for yours.':'Thank you for considering '+d.business+'. We would love to help keep your space clean, welcoming, and ready for the work you do.';const header=d.business+'\n'+names[d.task].toUpperCase()+'\nPrepared for '+d.client+'\n'+new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
if(d.task==='followup')return 'Subject: Your cleaning proposal for '+d.client+'\n\nHello,\n\n'+(direct?'Have you had a chance to review our cleaning proposal?':premium?'I wanted to personally follow up on our proposed cleaning partnership for '+d.client+'.':'Just checking in on our cleaning proposal for '+d.client+'. I would be happy to answer any questions or walk through the scope together.')+'\n\nFor reference, the proposed monthly service price is '+price+'. Our proposed scope is:\n\n'+d.notes+'\n\nWould a short walkthrough or call be helpful to confirm the details? Let me know what works for you.\n\nThank you,\n'+d.business;
if(d.task==='scope')return header+'\n\nSERVICE SCOPE\n'+d.notes+'\n\nMONTHLY SERVICE PRICE\n'+price+' per month, subject to confirmation after a walkthrough.\n\nTO CONFIRM WITH THE CLIENT\n• Exact service days, arrival window, and start date\n• Access, keys, alarm instructions, and on-site contact\n• Who supplies cleaning products and consumables\n• Surface-specific requirements and excluded areas\n• Applicable taxes, payment terms, and approval process\n\nCHANGE REQUESTS\nWork outside the agreed scope requires a separate written price and approval before service.\n\nNEXT STEP\nReview the scope together and confirm the final details in writing before scheduling.';
return header+'\n\nA CLEAN SPACE. A CLEAR PLAN.\n'+opening+'\n\nYOUR SPACE & SERVICE SCOPE\n'+d.notes+'\n\nYOUR INVESTMENT\nMonthly cleaning service: '+price+'\nAnnualized value at this monthly rate: '+money(d.price*12)+' (illustrative; no annual commitment implied).\n\nThe monthly price covers only the scope described above. Applicable taxes, supplies, service dates, and payment terms must be confirmed before acceptance. Additional services require a separately approved quote.\n\nA SIMPLE NEXT STEP\nLet’s arrange a walkthrough to confirm the scope, access arrangements, and service schedule. Once the final details and terms are agreed in writing, we can set a start date.\n\nPrepared by '+d.business+'\n\nDRAFT — Confirm pricing, exclusions, and service terms before sending.';}
async function callAI(payload){const response=await fetch('api.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(60000)});const result=await response.json();if(!response.ok)throw new Error(result.error||'The AI service could not complete this request.');if(typeof result.text!=='string'||!result.text.trim())throw new Error('The AI service returned an empty draft.');return result.text}
function showResult(text){$('#result').value=text;$('#result-panel').hidden=false;$('#result-kind').textContent=names[task]+' · '+$('#client').value;$('#result-panel').scrollIntoView({behavior:'smooth',block:'start'})}
$('#proposal-form').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const d=data();if(d.notes.length<15||!d.client||!d.business.trim()){toast('Please add a client and at least 15 characters of job details.');return}busy=true;$('#generate').disabled=true;$('#generate').textContent=ai?'Writing your draft…':'Preparing your draft…';const contact=profileContact();try{const text=ai?await callAI(d):draft(d);currentId=null;showResult(text+(contact?'\n\nBUSINESS CONTACT\n'+contact:''));saveRecovery();toast(ai?'Your AI draft is ready. Review before sending.':'Your template draft is ready to edit.');}catch(error){toast(error.message||'Could not generate. Please try again.')}finally{busy=false;$('#generate').disabled=false;setTask(task)}});
$('#refine-form').addEventListener('submit',async e=>{e.preventDefault();if(!ai){toast('AI refinement is not connected yet. You can edit the draft directly.');return}if(busy)return;busy=true;$('#refine-button').disabled=true;$('#generate').disabled=true;try{const text=await callAI({...data(),draft:$('#result').value,instruction:$('#refine').value});$('#result').value=text;$('#refine').value='';saveRecovery();toast('Draft updated. Review the changes before sending.')}catch(error){toast(error.message||'Could not refine. Your draft is unchanged.')}finally{busy=false;$('#refine-button').disabled=false;$('#generate').disabled=false}});
$('#notes').addEventListener('input',()=>{$('#char-count').textContent=$('#notes').value.length.toLocaleString()+' / 5,000'});
function save(){
 if(!$('#result').value.trim())return toast('Create a draft first.');
 if(!$('#proposal-form').reportValidity())return;
 if(!currentId&&saved.length>=50)return toast('You have 50 saved proposals. Export a backup and delete one before adding another.');
 const id=currentId||newId(),previous=saved.find(x=>x.id===id);
 const item={...data(),id,text:$('#result').value,date:new Date().toISOString(),title:previous?.title||$('#client').value.trim(),status:previous?.status||'draft'};
 const next=[item,...saved.filter(x=>x.id!==id)];
 if(persist('bidwell-drafts',next)){saved=next;currentId=id;saveRecovery();updateCount();toast('Draft saved on this device.');}
}
function renderSaved(){
 const list=$('#saved-list'),query=$('#proposal-search').value.trim().toLowerCase(),status=$('#proposal-status').value;
 const matches=saved.filter(item=>(!status||(item.status||'draft')===status)&&[item.title,item.client,item.text].some(value=>(value||'').toLowerCase().includes(query)));
 $('#proposal-summary').textContent=matches.length+' of '+saved.length+' proposals · '+saved.filter(x=>x.status==='won').length+' won';
 list.replaceChildren();
 if(!matches.length){const empty=document.createElement('div');empty.className='empty-state';empty.textContent=saved.length?'No proposals match your search or status filter.':'No saved proposals yet. Create a draft and choose Save draft.';list.append(empty);return;}
 matches.forEach(item=>{
  const card=document.createElement('article');card.className='saved-card';
  const info=document.createElement('div'),title=document.createElement('h3'),meta=document.createElement('p');
  title.textContent=item.title||item.client;
  meta.textContent=item.client+' · '+names[item.task]+' · '+money(Number(item.price))+'/month · '+new Date(item.date).toLocaleDateString();
  info.append(title,meta);
  const controls=document.createElement('div');controls.className='saved-actions';
  const label=document.createElement('label');label.textContent='Status';
  const select=document.createElement('select');select.setAttribute('aria-label','Status for '+(item.title||item.client));
  Object.entries(statuses).forEach(([value,text])=>select.add(new Option(text,value)));
  select.value=item.status||'draft';select.onchange=()=>{if(!updateSaved(item.id,{status:select.value}))select.value=item.status||'draft';};label.append(select);controls.append(label);
  const button=(text,handler)=>{const b=document.createElement('button');b.className='tool-button';b.textContent=text;b.onclick=handler;controls.append(b);};
  button('Open',()=>openSaved(item));
  button('Rename',()=>renameSaved(item));
  button('Duplicate',()=>{
   if(saved.length>=50)return toast('You have 50 saved proposals. Delete one before duplicating.');
   const next=[{...item,id:newId(),title:(item.title||item.client).slice(0,113)+' (copy)',status:'draft',date:new Date().toISOString()},...saved];
   if(persist('bidwell-drafts',next)){saved=next;updateCount();renderSaved();toast('Proposal duplicated as a draft.');}
  });
  button('Delete',()=>{
   if(!confirm('Delete this saved proposal from this device?'))return;
   const next=saved.filter(x=>x.id!==item.id);
   if(persist('bidwell-drafts',next)){saved=next;if(currentId===item.id)currentId=null;saveRecovery();updateCount();renderSaved();toast('Proposal deleted.');}
  });
  card.append(info,controls);list.append(card);
 });
}
function download(text,filename){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function modal(content){$('#modal-content').innerHTML=content;$('#modal').showModal()}
function plans(){modal('<span class="offer-tag">SERVICE-ASSISTED LAUNCH PACKAGE</span><h2>Build a bid system.<br>Not another to-do list.</h2><p>A hands-on setup for commercial cleaning owners who want a consistent way to quote, present, and follow up.</p><div class="price">$2,000 <small>/ one-time setup</small></div><ul><li>A proposal template customized to your business</li><li>Your service scope and pricing worksheet</li><li>Three follow-up email templates</li><li>A 60-minute handoff and workflow session</li></ul><p>No contract wins or revenue guaranteed. Availability, delivery date, and scope are confirmed before payment. The free template workspace remains available.</p><div id="offer-contact"></div>');const target=$('#offer-contact');if(config.contactEmail){const a=document.createElement('a');a.className='primary-button contact-link';a.textContent='Ask about the launch package ↗';a.href='mailto:'+config.contactEmail+'?subject='+encodeURIComponent('Bidwell launch package inquiry')+'&body='+encodeURIComponent('Hi, I’m interested in the $2,000 Bidwell launch package.\n\nBusiness name:\nWebsite:\nWhat I need help with:\n');target.append(a)}else if(config.bookingUrl){const a=document.createElement('a');a.className='primary-button contact-link';a.textContent='Discuss your setup ↗';a.href=config.bookingUrl;a.target='_blank';a.rel='noopener noreferrer';target.append(a)}else{target.innerHTML='<p class="modal-callout">Package inquiries are opening soon. Try the free proposal studio today; no payment is collected here.</p><button class="primary-button" id="back-to-studio">Try the free studio →</button>';$('#back-to-studio').onclick=()=>{$('#modal').close();view('workspace')}}}
function profileModal(){
 modal('<h2>Your business details.</h2><p>Saved on this device. Contact details are added to new drafts; existing drafts are unchanged.</p><form id="profile-form"><label>Business name<input name="name" required maxlength="100" autocomplete="organization"></label><label>Contact name<input name="contact" maxlength="100" autocomplete="name"></label><label>Email<input name="email" type="email" maxlength="254" autocomplete="email"></label><label>Phone<input name="phone" type="tel" maxlength="50" autocomplete="tel"></label><label>Website<input name="website" type="url" placeholder="https://example.com" maxlength="300" autocomplete="url"></label><label>Business address<input name="address" maxlength="300" autocomplete="street-address"></label><button class="primary-button">Save business profile</button></form>');
 const form=$('#profile-form');profileFields.forEach(key=>form.elements.namedItem(key).value=profile[key]||'');
 form.onsubmit=e=>{e.preventDefault();const next=Object.fromEntries(profileFields.map(key=>[key,form.elements.namedItem(key).value.trim()]));if(!validProfile(next))return toast('Enter a business name and valid contact details. Website must use HTTP or HTTPS.');if(persist('bidwell-profile',next)){profile=next;updateProfileLabel();$('#modal').close();toast('Business profile updated.');}};
}
const actions={
 new:()=>{
  if(busy)return toast('Please wait for the current draft to finish.');
  view('workspace');currentId=null;$('#proposal-form').reset();$('#result-panel').hidden=true;$('#result').value='';$('#refine').value='';setTask('proposal');$('#notes').dispatchEvent(new Event('input',{bubbles:true}));$('#notes').focus();
 },
 example:()=>useTemplate(0),plans,profile:profileModal,save,
 download:()=>download($('#result').value,($('#client').value.replace(/[^a-z0-9]+/gi,'-')||'bidwell')+'-'+task+'.txt'),
 print:()=>{$('#print-document').textContent=$('#result').value;window.print();},
 copy:async()=>{try{await navigator.clipboard.writeText($('#result').value);toast('Copied to clipboard.');}catch{$('#result').focus();$('#result').select();toast('Select and copy the highlighted draft using your keyboard.');}}
};
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-view]');if(nav)view(nav.dataset.view);
 const type=e.target.closest('[data-task]');if(type){if(busy)return;setTask(type.dataset.task);saveRecovery();}
 const action=e.target.closest('[data-action]');if(action&&actions[action.dataset.action])actions[action.dataset.action]();
 if(e.target.id==='clear-data'){
  if(busy)return toast('Please wait for the current draft to finish.');
  if(!confirm('Clear all Bidwell drafts, unfinished work, and your business profile from this browser?'))return;
  try{
   ['bidwell-drafts','bidwell-profile','bidwell-workspace'].forEach(key=>localStorage.removeItem(key));
   saved=[];profile={name:'Your cleaning company'};currentId=null;$('#proposal-form').reset();$('#refine').value='';$('#result').value='';$('#result-panel').hidden=true;setTask('proposal');$('#char-count').textContent='0 / 5,000';
   updateProfileLabel();updateCount();renderSaved();$('#recovery-status').textContent='Unfinished work is saved on this device.';$('#modal').close();toast('Local drafts, unfinished work, and profile cleared.');
  }catch{toast('Your browser could not clear storage. Use browser settings.');}
 }
});
$('#close-modal').onclick=()=>$('#modal').close();$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close()}});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='n'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!$('#modal').open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();actions.new()}});
function renderTemplates(){
 const query=$('#template-search').value.trim().toLowerCase(),list=$('#template-list');
 list.replaceChildren();let count=0;
 templates.forEach((template,index)=>{
  if(![template.name,template.client,template.description,template.notes].some(text=>text.toLowerCase().includes(query)))return;
  count++;
  const card=document.createElement('article');card.className='template-card';
  const icon=document.createElement('span');icon.className='task-icon';icon.textContent=template.icon;icon.setAttribute('aria-hidden','true');
  const title=document.createElement('h3');title.textContent=template.name;
  const description=document.createElement('p');description.textContent=template.description;
  const price=document.createElement('p');price.className='template-price';price.textContent='Sample: '+money(template.price)+'/month · Replace before quoting';
  const button=document.createElement('button');button.className='primary-button';button.textContent='Use this template →';button.setAttribute('aria-label','Use '+template.name+' template');button.onclick=()=>useTemplate(index);
  card.append(icon,title,description,price,button);list.append(card);
 });
 $('#template-count').textContent=count+' of '+templates.length+' templates';
 if(!count){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='No templates match. Try a property type such as office, gym, or salon.';list.append(empty);}
}
$('#template-search').addEventListener('input',renderTemplates);
renderTemplates();
$('#year').textContent=new Date().getFullYear();updateCount();
fetch('api.php',{signal:AbortSignal.timeout(5000)}).then(r=>r.ok?r.json():null).then(c=>{if(!c)return;config.contactEmail=typeof c.contactEmail==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.contactEmail)?c.contactEmail:config.contactEmail;config.bookingUrl=typeof c.bookingUrl==='string'&&/^https:\/\//.test(c.bookingUrl)?c.bookingUrl:'';if(c.ai===true){ai=true;$('#mode-badge').innerHTML='<i></i> AI studio connected';$('#privacy-note').textContent='Job details are sent to AI when you create a draft.';$('#refine-note').textContent='Ask for changes or edit directly. Review AI-generated details and pricing before sending.'}}).catch(()=>{});

function newId(){return String(Date.now())+'-'+Math.random().toString(36).slice(2,10);}
function validProfile(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const limits={name:100,contact:100,email:254,phone:50,website:300,address:300};
 if(typeof value.name!=='string'||!value.name.trim())return false;
 if(!profileFields.every(key=>value[key]===undefined||(typeof value[key]==='string'&&value[key].length<=limits[key])))return false;
 if(value.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))return false;
 if(value.website){try{if(!['http:','https:'].includes(new URL(value.website).protocol))return false;}catch{return false;}}
 return true;
}
function cleanProfile(value){return Object.fromEntries(profileFields.map(key=>[key,(value[key]||'').trim()]));}
function validSaved(value){
 return !!value&&typeof value==='object'&&typeof value.id==='string'&&value.id.length>0&&value.id.length<=100
  &&Object.hasOwn(names,value.task)&&typeof value.client==='string'&&value.client.trim().length>0&&value.client.length<=100
  &&typeof value.notes==='string'&&value.notes.length<=5000&&typeof value.text==='string'&&value.text.length>0&&value.text.length<=100000
  &&['string','number'].includes(typeof value.price)&&Number.isFinite(Number(value.price))&&Number(value.price)>0&&Number(value.price)<=1000000
  &&typeof value.date==='string'&&Number.isFinite(Date.parse(value.date))
  &&(value.tone===undefined||tones.includes(value.tone))
  &&(value.business===undefined||(typeof value.business==='string'&&value.business.length<=100))
  &&(value.title===undefined||(typeof value.title==='string'&&value.title.trim().length>0&&value.title.length<=120))
  &&(value.status===undefined||Object.hasOwn(statuses,value.status));
}
function profileContact(){return ['contact','email','phone','website','address'].map(key=>profile[key]).filter(Boolean).join('\n');}
function updateProfileLabel(){
 const name=$('.profile>span:nth-child(2)');name.replaceChildren(document.createTextNode(profile.name));
 const small=document.createElement('small');small.textContent='Business profile';name.append(small);
}
function updateSaved(id,changes){
 const next=saved.map(item=>item.id===id?{...item,...changes}:item);
 if(!persist('bidwell-drafts',next))return false;
 saved=next;renderSaved();return true;
}
function openSaved(item){
 if(busy)return toast('Please wait for the current draft to finish.');
 view('workspace');setTask(item.task);$('#notes').value=item.notes;$('#client').value=item.client;$('#price').value=item.price;$('#tone').value=item.tone||tones[0];$('#refine').value='';currentId=item.id;showResult(item.text);
 $('#notes').dispatchEvent(new Event('input',{bubbles:true}));
}
function renameSaved(item){
 modal('<h2>Rename proposal</h2><form id="rename-form"><label>Proposal title<input id="proposal-title" required maxlength="120"></label><button class="primary-button">Save title</button></form>');
 $('#proposal-title').value=item.title||item.client;
 $('#rename-form').onsubmit=e=>{e.preventDefault();const title=$('#proposal-title').value.trim();if(!title)return toast('Enter a proposal title.');if(updateSaved(item.id,{title})){$('#modal').close();toast('Proposal renamed.');}};
}
function saveRecovery(){
 const snapshot={version:1,task,currentId,notes:$('#notes').value,client:$('#client').value,price:$('#price').value,tone:$('#tone').value,text:$('#result-panel').hidden?'':$('#result').value,refine:$('#refine').value};
 const ok=persist('bidwell-workspace',snapshot);
 $('#recovery-status').textContent=ok?'Unfinished work saved on this device.':'Autosave unavailable. Export or download your work.';
}
function restoreRecovery(){
 try{
  const raw=localStorage.getItem('bidwell-workspace');if(raw===null)return;
  const value=JSON.parse(raw);
  if(!value||value.version!==1||!Object.hasOwn(names,value.task)||!tones.includes(value.tone)
   ||!['notes','client','price','text','refine'].every(key=>typeof value[key]==='string')
   ||value.notes.length>5000||value.client.length>100||value.text.length>100000||value.refine.length>1000
   ||value.price.length>100||(value.price!==''&&!Number.isFinite(Number(value.price)))
   ||(value.currentId!==null&&typeof value.currentId!=='string'))throw new Error('Invalid unfinished work');
  setTask(value.task);$('#notes').value=value.notes;$('#client').value=value.client;$('#price').value=value.price;$('#tone').value=value.tone;$('#result').value=value.text;$('#refine').value=value.refine;
  currentId=saved.some(item=>item.id===value.currentId)?value.currentId:null;
  $('#result-panel').hidden=!value.text;$('#result-kind').textContent=names[task]+' · '+value.client;
  $('#char-count').textContent=value.notes.length.toLocaleString()+' / 5,000';
  $('#recovery-status').textContent='Unfinished work restored from this device.';
 }catch{toast('Unfinished work could not be restored. Your saved proposals are unchanged.');$('#recovery-status').textContent='Draft recovery failed. Check your saved proposals.';}
}
function calculator(){
 modal('<h2>Build your monthly price.</h2><p>An estimate from your own costs, not a market rate. Labor is total staff-hours per visit. Monthly visits use 52 weeks / 12 months. Taxes are not included.</p><form id="calculator-form"><div class="calculator-fields"><label>Staff-hours per visit<input name="hours" type="number" min="0.25" max="1000" step="0.25" value="2" required></label><label>Visits per week<input name="visits" type="number" min="0.25" max="21" step="0.25" value="3" required></label><label>Loaded labor cost / hour ($)<input name="labor" type="number" min="0.01" max="10000" step="0.01" value="25" required></label><label>Monthly supplies ($)<input name="supplies" type="number" min="0" max="100000" step="0.01" value="75" required></label><label>Overhead (% of direct costs)<input name="overhead" type="number" min="0" max="1000" step="0.1" value="15" required></label><label>Target profit margin (%)<input name="margin" type="number" min="0" max="95" step="0.1" value="25" required></label></div><div id="calculator-result" class="calculator-result" aria-live="polite"></div><p>Price = (labor + supplies) × (1 + overhead rate) / (1 − profit margin). Confirm scope, payroll burden, and local taxes before quoting.</p><button class="primary-button">Use monthly price</button></form>');
 const form=$('#calculator-form');
 const estimate=()=>{
  if(!form.checkValidity()){$('#calculator-result').textContent='Complete all fields within the listed limits to calculate a price.';return null;}
  const n=key=>Number(form.elements.namedItem(key).value);
  const labor=n('hours')*n('visits')*52/12*n('labor'),direct=labor+n('supplies'),cost=direct*(1+n('overhead')/100),price=Math.round(cost/(1-n('margin')/100)*100)/100;
  if(!Number.isFinite(price)||price<1||price>1000000){$('#calculator-result').textContent='The monthly price must be between $1 and $1,000,000. Review your inputs.';return null;}
  $('#calculator-result').textContent='Monthly labor: '+money(labor)+' · Total cost with overhead: '+money(cost)+' · Estimated profit: '+money(price-cost)+'\nSuggested monthly price: '+money(price);
  return price;
 };
 form.addEventListener('input',estimate);
 form.onsubmit=e=>{e.preventDefault();if(busy)return toast('Please wait for the current draft to finish.');const price=estimate();if(price===null)return;$('#price').value=price.toFixed(2);saveRecovery();$('#modal').close();view('workspace');$('#price').focus();toast('Estimated price applied. Regenerate any existing draft to update its price.');};
 estimate();
}
function exportBackup(){
 download(JSON.stringify({app:'bidwell',version:1,exportedAt:new Date().toISOString(),profile:cleanProfile(profile),drafts:saved},null,2),'bidwell-backup-'+new Date().toISOString().slice(0,10)+'.json');
 toast('Backup exported. It contains client details; keep it private.');
}
async function importBackup(file){
 if(!file)return;
 if(busy)return toast('Please wait for the current draft to finish.');
 try{
  if(file.size>10*1024*1024)throw new Error('Backup exceeds the 10 MB limit.');
  const value=JSON.parse(await file.text());
  if(!value||value.app!=='bidwell'||value.version!==1||!validProfile(value.profile)||!Array.isArray(value.drafts)||value.drafts.length>50||!value.drafts.every(validSaved)||new Set(value.drafts.map(item=>item.id)).size!==value.drafts.length)throw new Error('Not a valid Bidwell version 1 backup. Nothing was imported.');
  if(busy)return toast('Please wait for the current draft to finish, then import again.');
  if(!confirm('Replace your '+saved.length+' saved proposals and business profile with this backup ('+value.drafts.length+' proposals)? Export a backup first if needed. Your open workspace will be kept as an unsaved draft.'))return;
  const nextProfile=cleanProfile(value.profile),next=value.drafts.map(item=>Object.fromEntries(['id','task','client','notes','text','price','date','tone','title','status','business'].filter(key=>Object.hasOwn(item,key)).map(key=>[key,item[key]])));
  const oldDrafts=localStorage.getItem('bidwell-drafts'),oldProfile=localStorage.getItem('bidwell-profile');
  try{localStorage.setItem('bidwell-drafts',JSON.stringify(next));localStorage.setItem('bidwell-profile',JSON.stringify(nextProfile));}
  catch(error){
   try{for(const [key,old] of [['bidwell-drafts',oldDrafts],['bidwell-profile',oldProfile]]){if(old===null)localStorage.removeItem(key);else localStorage.setItem(key,old);}}
   catch{throw new Error('Import failed and storage rollback failed. Keep your backup and check browser storage before reloading.');}
   throw new Error('Import failed: browser storage is unavailable or full. Existing data was restored.');
  }
  saved=next;profile=nextProfile;currentId=null;saveRecovery();updateProfileLabel();updateCount();renderSaved();toast('Backup restored on this device.');
 }catch(error){toast(error instanceof SyntaxError?'The file is not valid JSON. Nothing was imported.':error.message||'Backup could not be imported.');}
}
actions.calculator=calculator;actions.backup=exportBackup;actions.restore=()=>$('#backup-file').click();
actions.help=()=>modal('<h2>Your bidding toolkit.</h2><ol><li>Save your business name and contact details under Business details.</li><li>Use the pricing calculator to estimate a monthly price from your own costs. It uses profit margin, not markup, and excludes taxes.</li><li>Create and edit a proposal, follow-up, or scope. Review every detail before sending.</li><li>Save it under My proposals. Search, rename, duplicate, or mark it Draft, Sent, Won, or Lost. Status changes do not send anything.</li><li>Export a JSON backup regularly. Import replaces saved proposals and your profile after confirmation.</li></ol><p>Unfinished notes and draft edits recover after refresh on this browser. New proposal intentionally resets that workspace. Saved proposals are separate, limited to 50, and never removed automatically. Data is not synced between devices.</p><p>Template mode needs no API. Connected AI sends job details and draft edits to the configured AI service. Business contacts are added locally to new drafts; if included in a draft submitted for refinement, they are sent to AI too. Avoid sensitive client information.</p>');
actions.privacy=()=>modal('<h2>Your work stays yours.</h2><p>Template mode runs locally. Saved proposals, business contact details, and unfinished work stay in this browser until you clear them. They are not synced. Exported backups contain this information; store them securely. Backups include saved proposals and your profile, not the unfinished workspace.</p><p>When connected, AI receives submitted job details and drafts sent for refinement, including contact details in those drafts. Requests use the site server and OpenAI with storage disabled. Avoid sensitive information.</p><p>Fonts load from Google Fonts. Contact links use your mail app or booking service. No payment processing or analytics is included.</p><button class="primary-button" id="clear-data">Clear all local data</button>');
$('#proposal-search').addEventListener('input',renderSaved);
$('#proposal-status').addEventListener('change',renderSaved);
$('#backup-file').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';await importBackup(file);});
$('#proposal-form').addEventListener('input',saveRecovery);
$('#proposal-form').addEventListener('change',saveRecovery);
$('#result').maxLength=100000;
$('#result').addEventListener('input',saveRecovery);
$('#refine').addEventListener('input',saveRecovery);
updateProfileLabel();restoreRecovery();
