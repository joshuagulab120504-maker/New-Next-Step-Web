"""Rebuild data/navi.js from the Career Pathways Guide (markdown).
Usage: python3 tools/build-navi.py path/to/CareersV3.md
"""
import re, json, sys, html
src=open(sys.argv[1],encoding='utf-8').read().split('\n')

def inline(t):
    t=html.escape(t.strip(), quote=False)
    def link(m):
        txt,url=m.group(1),m.group(2)
        if url.startswith('#career-'): return '<a href="#%s" class="xref">%s</a>'%(url[1:],txt)
        if url.startswith('#bucket-'): return '<a href="#%s" class="xref">%s</a>'%(url[1:],txt)
        return '<a href="%s" target="_blank" rel="noopener">%s</a>'%(html.escape(url,quote=True),txt)
    t=re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)',link,t)
    t=re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',t)
    t=re.sub(r'(?<![\w*])\*([^*]+)\*(?!\w)',r'<i>\1</i>',t)
    return t

# ---- buckets (Part 2 matrix) ----
start=src.index('## Eleven-bucket subject-planning matrix'); end=[i for i,l in enumerate(src) if l.startswith('# PART 3')][0]
buckets=[]; cur=None
for l in src[start:end]:
    m=re.match(r'<a id="(bucket-[^"]+)"></a>',l)
    if m: cur={'id':m.group(1),'fields':[]}; buckets.append(cur); continue
    if cur and l.startswith('## '): cur['name']=l[3:].strip(); continue
    m=re.match(r'\*\*([^*]+?):\*\*\s*(.*)',l)
    if cur and m: cur['fields'].append([m.group(1),inline(m.group(2))])

# ---- profiles (Part 5) ----
pstart=[i for i,l in enumerate(src) if l.startswith('# PART 5')][0]; pend=[i for i,l in enumerate(src) if l.startswith('# PART 6')][0]
profiles=[]; cur=None
for l in src[pstart:pend]:
    m=re.match(r'<a id="(career-[^"]+)"></a>',l)
    if m: cur={'id':m.group(1),'fields':[],'notes':[]}; profiles.append(cur); continue
    if not cur: continue
    if l.startswith('## '):
        t=l[3:].strip(); st=''
        for e,k in [('✅','ok'),('🟡','varies'),('⚠️','talent')]:
            if e in t: st=k; t=t.replace(e,'').strip()
        cur['name']=t; cur['status']=st; continue
    if l.strip() in ('','---'): continue
    m=re.match(r'\*\*([^*]+?):\*\*\s*(.*)',l)
    if m:
        lab,val=m.group(1).strip(),m.group(2)
        if lab=='Buckets':
            cur['buckets']=re.findall(r'\]\(#(bucket-[^)]+)\)',val); continue
        cur['fields'].append([lab,inline(val)]); continue
    t=l.strip()
    if t.startswith('- '): t=t[2:]
    if cur['fields'] and not l.startswith(('-','**')) and cur['fields'][-1] and False: pass
    cur['notes'].append(inline(t))
meta={}
for l in src[:12]:
    m=re.match(r'\*\*(Edition|Last verified|Coverage):\*\*\s*(.*)',l)
    if m: meta[m.group(1)]=m.group(2).strip()
out={'meta':meta,'buckets':buckets,'profiles':profiles}
d=out

# ---- streams ----
import collections
SUBJ=[ # canonical, regex (order matters for overlaps)
 ('Human & Social Biology',r'human and social biology|human & social biology|social biology|biology/human'),
 ('Biology',r'(?<!social )\bbiology\b'),
 ('Chemistry',r'\bchemistry\b'),('Physics',r'\bphysics\b'),
 ('Integrated Science',r'integrated science'),
 ('Additional Mathematics',r'additional mathematics|additional maths'),
 ('Agricultural Science',r'agricultural science|cvq agro'),
 ('Information Technology',r'information technology|\bIT\b|computer science'),
 ('EDPM',r'\bEDPM\b'),
 ('Principles of Business',r'principles of business|principles of accounts/business|business subjects|business administration'),
 ('Principles of Accounts',r'principles of accounts|\baccounts\b'),
 ('Economics',r'\beconomics\b'),('Office Administration',r'office administration'),
 ('Social Studies',r'social studies'),('Geography',r'\bgeography\b'),
 ('Caribbean History',r'caribbean history|\bhistory\b'),
 ('English B',r'english b\b|literature'),('Modern language',r'modern language|spanish|french'),
 ('Music',r'\bmusic\b'),('Theatre Arts',r'theatre arts'),('Visual Arts',r'visual arts'),
 ('Physical Education',r'physical education'),
 ('Technical Drawing',r'technical drawing'),
 ('Industrial Technology',r'industrial technology|building technology|mechanical(?:/metalwork)? technology|mechanical engineering technology|electrical(?:/| and | & )?(?:electronic )?technology|electronics|technical subjects|the most relevant technical'),
 ('CVQ/SCCP',r'\bcvq\b|\bsccp\b'),
 ('Food & Nutrition',r'food(?:,| and)? nutrition|family and resource|clothing|commercial food'),
 ('A science',r'accepted science|\bthe sciences\b|\bscience\b(?! and)'),
]
STREAMS=[
 {'id':'stream-science','name':'Science','blurb':'For health, engineering, technology, lab and environmental careers.',
  'subjects':['Biology','Chemistry','Physics','Integrated Science','Human & Social Biology','Additional Mathematics','Agricultural Science','Geography','Information Technology','Physical Education','A science']},
 {'id':'stream-business','name':'Business','blurb':'For accounting, banking, management, marketing and running a business.',
  'subjects':['Principles of Business','Principles of Accounts','Economics','Office Administration','EDPM','Information Technology','Social Studies','Geography','Integrated Science','Human & Social Biology','Physical Education','A science']},
 {'id':'stream-arts','name':'Arts / Humanities','blurb':'For law, media, teaching, languages, public service and the creative arts.',
  'subjects':['English B','Caribbean History','Geography','Social Studies','Modern language','Music','Theatre Arts','Visual Arts','Information Technology','Integrated Science','Human & Social Biology','Physical Education','A science']},
 {'id':'stream-tvet','name':'Technical / TVET','blurb':'For trades, construction, energy, mechanics and other hands-on technical careers.',
  'subjects':['Technical Drawing','Industrial Technology','CVQ/SCCP','Food & Nutrition','Agricultural Science','Information Technology','Integrated Science','Physical Education','A science']},
]
def subjects(text):
    t=re.sub('<[^>]+>','',text); found=[]
    for name,rx in SUBJ:
        for m in re.finditer(rx,t,re.I): found.append((m.start(),name))
    found.sort(); out=[]
    for _,n in found:
        if n not in out: out.append(n)
    # generic 'A science' is redundant if a named science is present
    if 'A science' in out and any(s in out for s in ['Biology','Chemistry','Physics','Integrated Science','Human & Social Biology']): out.remove('A science')
    return out
stats=collections.Counter()
for p in d['profiles']:
    src=[v for l,v in p['fields'] if l=='Forms 4–5 — recommended CSEC'] or [v for l,v in p['fields'] if l.startswith('Forms 4–5')] or [v for l,v in p['fields'] if l=='Helpful subjects']
    key=subjects(' '.join(src))[:3]
    p['key']=key; p['streams']={}
    for s in STREAMS:
        miss=[k for k in key if k not in s['subjects']]
        fit = not miss or (len(key)==3 and miss==[key[2]])
        p['streams'][s['id']]={'fit':fit,'add':[] if fit else miss[:2]}
        stats[(s['name'],fit)]+=1
d['streams']=STREAMS

d.pop('buckets',None)
for x in d['profiles']: x.pop('buckets',None); x.pop('key',None)
import os
here=os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here,'..','data','navi.js'),'w',encoding='utf-8') as f:
    f.write("""/* =====================================================================
   NAVI DATA: generated from the Next Step Guyana Career Pathways Guide.
   Don't edit this file by hand. To update careers, edit the guide
   (CareersV3.md) and rebuild this file with tools/build-navi.py:
     python3 tools/build-navi.py path/to/CareersV3.md
   ===================================================================== */
window.NAVI = """+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(d['profiles']),'careers written to data/navi.js')
