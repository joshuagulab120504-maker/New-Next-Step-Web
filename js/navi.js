/* Navi: search, stream browsing and career pathways. Data comes from data/navi.js. */
(function(){
var D=window.NAVI;
var P=D.profiles, S=D.streams, byId={}, sById={};
P.forEach(function(p){byId[p.id]=p}); S.forEach(function(s){sById[s.id]=s});

var STATUS={ok:['Confirmed route','A current official route was confirmed. Still check the entry rules for your intake.'],
  varies:['Route varies','The route exists but depends on the intake, employer or what is available locally.'],
  talent:['Talent matters most','Portfolio, talent or selection matters more than any single certificate.']};
var STAGES=[
  {k:'explore',when:'Forms 1 to 3',title:'Explore and build the base',labels:['Forms 1–3']},
  {k:'csec',when:'Forms 4 and 5',title:'CSEC subjects',labels:['Forms 4–5 — recommended CSEC','Forms 4–5','Forms 4–5/6','Helpful subjects']},
  {k:'cape',when:'Form 6',title:'CAPE subjects',labels:['Form 6 — recommended CAPE','Form 6 or post-CSEC']},
  {k:'after',when:'After secondary school',title:'Programmes and routes',labels:['Current routes','Current route','Routes','Route','Guyana pathway','Post-CSEC','Post-CSEC routes','Professional route','Alternative route','Specialisation','Current development'],notes:true,clamp:true},
  {k:'gate',when:'Before you can practise',title:'Licensing and registration',labels:['Professional gate'],clamp:true},
  {k:'jobs',when:'Your first job',title:'Where you start',labels:['First jobs','First roles','Employers'],goal:true}
];
var STREAM_SUBJECTS={
 'stream-science':['Biology','Chemistry','Physics','Additional Mathematics','Integrated Science','Geography','Information Technology','Agricultural Science'],
 'stream-business':['Principles of Business','Principles of Accounts','Economics','Office Administration','EDPM','Social Studies','Information Technology','One science, e.g. Integrated Science'],
 'stream-arts':['English B (Literature)','Caribbean History','Geography','Social Studies','Spanish or French','Visual Arts','Music','Theatre Arts'],
 'stream-tvet':['Technical Drawing','Building, Electrical or Mechanical Technology','Food, Nutrition and Health','Agricultural Science','CVQ/SCCP subjects','Integrated Science','Information Technology']
};
var ALIAS={'doctor':['Medical Doctor','Specialist Doctor'],'physician':['Medical Doctor'],'surgeon':['Specialist Doctor'],'eye doctor':['Optometrist'],'vet':['Veterinarian'],
 'paramedic':['Emergency Medical'],'ambulance':['Emergency Medical'],'x-ray':['Radiographer'],'xray':['Radiographer'],'lab tech':['Medical Laboratory','Laboratory Scientist'],
 'therapist':['Physiotherapist','Psychologist','Respiratory Therapist'],'counsellor':['Guidance Counsellor','Psychologist'],'nanny':['Early-Childhood','Caregiver'],'midwife':['Nurse'],
 'scientist':['Laboratory Scientist','Environmental Scientist','Agricultural Scientist','Data Scientist'],'programmer':['Software'],'coder':['Software'],'developer':['Software','Game'],
 'software engineer':['Software'],'hacker':['Cybersecurity'],'ai':['Data Scientist'],'computer':['Software','IT Support','Cloud','Cybersecurity'],'youtuber':['Content Creator'],
 'influencer':['Content Creator'],'designer':['Graphic Designer','Fashion Designer','Interior'],'singer':['Musician'],'actor':['Musician'],'artist':['Visual Artist','Musician'],
 'photographer':['Visual Artist'],'reporter':['Journalist'],'author':['Writer'],'attorney':['Lawyer'],'judge':['Magistrate'],'police':['Police Officer'],'cop':['Police Officer'],
 'army':['GDF'],'soldier':['GDF'],'military':['GDF'],'politician':['Elected Office'],'ambassador':['Diplomat'],'business':['Entrepreneur','Accountant','Banker','Marketing'],
 'economist':['Economics'],'finance':['Banker','Accountant','Actuary'],'hr':['Human Resources'],'farmer':['Crop / Livestock','Agricultural Scientist'],'fisherman':['Aquaculture','Fisheries'],
 'oil':['Petroleum'],'mining':['Geologist','Mining Engineer'],'mechanic':['Automotive Mechanic','Heavy-Equipment / Agricultural-Machinery','Small-Engine'],'builder':['Mason','Carpenter','Quantity Surveyor'],
 'ac':['Refrigeration'],'hairdresser':['Cosmetologist'],'barber':['Cosmetologist'],'makeup':['Cosmetologist'],'cook':['Chef','Cook / Baker'],'baker':['Cook / Baker'],'tailor':['Garment Maker'],
 'sailor':['Boat Master','Ocean-Going'],'captain':['Boat Master','Ocean-Going','Pilot'],'aviation':['Pilot','Aircraft Maintenance','Air-Traffic','Flight Dispatcher'],'professor':['Lecturer'],
 'athlete':['Track and Field','Cricketer','Footballer'],'pastor':['Religious Vocation'],'priest':['Religious Vocation'],'environment':['Environmental Scientist'],'solar':['Solar','Renewable-Energy'],'engineer':['Engineer']};
var POPULAR=[['career-medical-doctor','Doctor'],['career-lawyer-attorney-at-law','Lawyer'],['career-software-web-mobile-developer','Software developer'],['career-nurse-midwife','Nurse'],['career-civil-mechanical-and-electrical-engineer','Engineer'],['career-teacher','Teacher'],['career-pilot','Pilot']];

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function cap(h){return h.replace(/^((?:<[^>]+>)*)([a-z])/,function(m,a,b){return a+b.toUpperCase()})}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9+]+/g,' ').trim()}
function andList(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
P.forEach(function(p){p._n=norm(p.name);p._w=p._n.split(' ');p._a=[]});
Object.keys(ALIAS).forEach(function(k){ALIAS[k].forEach(function(f){P.forEach(function(p){if(p.name.toLowerCase().indexOf(f.toLowerCase())>-1&&p._a.indexOf(k)<0)p._a.push(k)})})});

function search(q){
  var n=norm(q); if(!n) return []; var ws=n.split(' '), r=[];
  P.forEach(function(p){var s=0;
    if(p._n.indexOf(n)===0)s=100; else if(p._w.some(function(w){return w.indexOf(n)===0}))s=85;
    else if(p._a.indexOf(n)>-1)s=80; else if(p._a.some(function(a){return a.indexOf(n)===0}))s=70; else if(p._n.indexOf(n)>-1)s=55;
    else if(ws.length>1&&ws.every(function(w){return p._w.some(function(x){return x.indexOf(w)===0})||p._a.some(function(a){return a.indexOf(w)>-1})}))s=50;
    if(s)r.push({p:p,s:s-p.name.length/200})});
  return r.sort(function(a,b){return b.s-a.s}).slice(0,7).map(function(x){return x.p});
}
function hl(name,q){var n=norm(q),i=name.toLowerCase().indexOf(n);if(!n||i<0)return esc(name);return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+n.length))+'</mark>'+esc(name.slice(i+n.length))}

/* search box */
var q=document.getElementById('q'),sug=document.getElementById('suggest'),combo=document.getElementById('combo'),items=[],act=-1;
function show(list){items=list;act=list.length?0:-1;
  if(!q.value.trim()){close();return}
  sug.innerHTML=list.length?list.map(function(p,i){return '<li role="option" id="o'+i+'" data-id="'+p.id+'" aria-selected="'+(i===0)+'">'+hl(p.name,q.value)+'</li>'}).join('')
    :'<li class="empty" role="option" aria-disabled="true">No career matches "'+esc(q.value)+'". Try a simpler word, or browse by stream below.</li>';
  sug.hidden=false;q.setAttribute('aria-expanded','true');q.setAttribute('aria-activedescendant',act>-1?'o0':'')}
function close(){sug.hidden=true;q.setAttribute('aria-expanded','false')}
function move(i){if(!items.length)return;act=(i+items.length)%items.length;
  [].forEach.call(sug.querySelectorAll('li[data-id]'),function(li,j){li.setAttribute('aria-selected',j===act)});
  q.setAttribute('aria-activedescendant','o'+act);var el=document.getElementById('o'+act);if(el)el.scrollIntoView({block:'nearest'})}
function pick(id){close();q.value='';q.blur();go(id)}
q.addEventListener('input',function(){show(search(q.value))});
q.addEventListener('keydown',function(e){
  if(e.key==='ArrowDown'){e.preventDefault();sug.hidden?show(search(q.value)):move(act+1)}
  else if(e.key==='ArrowUp'){e.preventDefault();move(act-1)}
  else if(e.key==='Enter'){e.preventDefault();if(items[act])pick(items[act].id)}
  else if(e.key==='Escape')close()});
sug.addEventListener('mousedown',function(e){var li=e.target.closest('li[data-id]');if(li){e.preventDefault();pick(li.getAttribute('data-id'))}});
document.addEventListener('click',function(e){if(!combo.contains(e.target))close()});

/* popular + streams */
var pop=document.getElementById('popular');
POPULAR.forEach(function(x){if(!byId[x[0]])return;var b=document.createElement('button');b.type='button';b.className='pop';b.textContent=x[1];b.addEventListener('click',function(){go(x[0])});pop.appendChild(b)});
var stabs=document.getElementById('stabs');
S.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='stab';b.setAttribute('data-s',s.id);b.setAttribute('aria-pressed','false');b.textContent=s.name;b.addEventListener('click',function(){go(s.id)});stabs.appendChild(b)});

/* views */
function chips(html,core){
  var plain=html.replace(/<[^>]+>/g,'');
  if(plain.length>230||/[;:]|\b(if|when|for|which|depending|should|may|ordinarily|according|where)\b/i.test(plain))return '<p class="txt">'+cap(html)+'</p>';
  var tail='',m=plain.match(/^(.*?)(,? as available\.?|,? where offered\.?)$/i);if(m){plain=m[1];tail='<p class="pill-note">Take these where your school offers them.</p>'}
  var parts=plain.replace(/\.$/,'').split(/,\s*|\s+and\s+|\s+or\s+/).map(function(s){return s.trim()}).filter(Boolean);
  if(parts.length<2||parts.some(function(s){return s.split(' ').length>6||/^(the|a|an|any|other|available|relevant|most)\b|subjects?\b|\bschool\b/i.test(s)}))return '<p class="txt">'+cap(html)+'</p>';
  return '<div class="nv-chips">'+parts.map(function(s){return '<span class="subj'+(core&&/^(english( a)?|mathematics)$/i.test(s)?' core':'')+'">'+esc(s)+'</span>'}).join('')+'</div>'+tail;
}
function career(p){
  var st=STATUS[p.status]||STATUS.varies,n=0;
  var fit='<section class="fit"><h2>Which CSEC stream fits?</h2><div class="sgrid">'+S.map(function(s){var f=p.streams[s.id];
    return '<button type="button" class="scell'+(f.fit?' ok':'')+'" data-s="'+s.id+'"><b>'+esc(s.name)+'</b><span>'+(f.fit?'Good fit':'Add '+esc(andList(f.add)))+'</span></button>'}).join('')+'</div></section>';
  var stages=STAGES.map(function(G){
    var fs=p.fields.filter(function(f){return G.labels.indexOf(f[0])>-1}),ns=G.notes?p.notes:[];
    if(!fs.length&&!ns.length)return '';n++;
    var body=fs.map(function(f){
      var subj=(G.k==='csec'||G.k==='cape')&&/recommended|Helpful/.test(f[0]);
      var lab={'Helpful subjects':'Most helpful','Current development':'Recent update','Alternative route':'Another way in','Specialisation':'Specialising','Professional route':'Professional route','Employers':'Employers'}[f[0]]||'';
      return (lab?'<span class="label">'+esc(lab)+'</span>':'')+(subj?chips(f[1],G.k==='csec'):'<p class="txt">'+cap(f[1])+'</p>')}).join('')
      +ns.map(function(t){return '<p class="txt">'+cap(t)+'</p>'}).join('');
    var long=G.clamp&&body.replace(/<[^>]+>/g,'').length>260;
    if(long)body='<div class="more clamp"><div class="more-body">'+body+'</div><button type="button" class="more-btn">More detail</button></div>';
    return '<li class="stage'+(G.goal?' goal':'')+'"><span class="node" aria-hidden="true">'+(G.goal?'★':n)+'</span><div class="sb"><p class="when">'+G.when+'</p><h3>'+G.title+'</h3>'+body+'</div></li>'}).join('');
  return '<article class="view"><h2 class="title">'+esc(p.name)+'</h2><span class="pill '+(p.status||'varies')+'">'+st[0]+'</span><p class="pill-note">'+st[1]+'</p>'+fit+
    '<ol class="path">'+stages+'</ol>'+
    '<div class="mentor"><div><h3>Talk to someone who has done it</h3><p>Our mentors have been through CSEC, CAPE and university.</p></div><a class="nv-btn" href="mentors.html">Meet the mentors</a></div>'+
    '<div class="verify"><div><b>Help us keep Navi accurate</b><p>We are always checking these pathways with students, mentors and schools. If something here is wrong or out of date, tell us and we will correct it.</p></div><a class="nv-btn-line" href="https://forms.gle/9TUT36DHD6t8ngKa7" target="_blank" rel="noopener">Send a correction</a></div>'+
    '<p class="source">From the Next Step Guyana Career Pathways Guide, last checked '+esc(D.meta['Last verified']||'')+'. Entry rules change, so always confirm with the school, college or university.</p></article>';
}
function stream(s){
  var good=P.filter(function(p){return p.streams[s.id].fit}),more=P.filter(function(p){return !p.streams[s.id].fit});
  var subj='<span class="subj core">English A</span><span class="subj core">Mathematics</span>'+STREAM_SUBJECTS[s.id].map(function(x){return '<span class="subj">'+esc(x)+'</span>'}).join('');
  function item(p,add){return '<button type="button" class="citem" data-id="'+p.id+'">'+esc(p.name)+(add?'<span>Add '+esc(andList(p.streams[s.id].add))+'</span>':'')+'</button>'}
  return '<article class="view"><p class="eyebrow" style="color:var(--slate)">CSEC stream</p><h2 class="title" style="margin-top:4px">'+esc(s.name)+'</h2><p class="lead">'+esc(s.blurb)+'</p>'+
    '<span class="label" style="margin-top:18px">Usual subjects</span><div class="nv-chips">'+subj+'</div><p class="pill-note">Exact subjects depend on what your school offers.</p>'+
    '<p class="callout">A stream is not a final decision. Careers in the second list are still possible if you add the subjects shown.</p>'+
    '<h3 class="group">Good fit<small>'+good.length+' careers</small></h3><div class="clist">'+good.map(function(p){return item(p,false)}).join('')+'</div>'+
    '<h3 class="group">Possible if you add subjects<small>'+more.length+' careers</small></h3><div class="clist">'+more.map(function(p){return item(p,true)}).join('')+'</div>'+'<div class="verify"><div><b>Help us keep Navi accurate</b><p>We are always checking these pathways with students, mentors and schools. If something here is wrong or out of date, tell us and we will correct it.</p></div><a class="nv-btn-line" href="https://forms.gle/9TUT36DHD6t8ngKa7" target="_blank" rel="noopener">Send a correction</a></div>'+'</article>';
}
var view=document.getElementById('view');
view.addEventListener('click',function(e){
  var b=e.target.closest('.more-btn');if(b){b.parentNode.classList.remove('clamp');return}
  var c=e.target.closest('[data-id]');if(c){go(c.getAttribute('data-id'));return}
  var s=e.target.closest('[data-s]');if(s)go(s.getAttribute('data-s'))});
function go(id,first){
  if(!byId[id]&&!sById[id])id='career-medical-doctor';
  view.innerHTML=byId[id]?career(byId[id]):stream(sById[id]);
  [].forEach.call(stabs.children,function(b){b.setAttribute('aria-pressed',b.getAttribute('data-s')===id)});
  try{history.replaceState(null,'','#'+id)}catch(e){}
  if(!first){var top=view.getBoundingClientRect().top+window.scrollY-90;window.scrollTo({top:Math.max(0,top),behavior:'smooth'})}
}
window.addEventListener('hashchange',function(){go(location.hash.slice(1))});
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#career-"]');if(a){e.preventDefault();go(a.getAttribute('href').slice(1))}});

go(location.hash.slice(1)||'career-medical-doctor',true);
})();
