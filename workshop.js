(function(){
var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// word split
document.querySelectorAll('.rw').forEach(function(el){
  (function walk(node){
    [].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(p){
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}
          var s=document.createElement('span');s.className='wd';s.textContent=p;frag.appendChild(s);
        });
        node.replaceChild(frag,n);
      }else if(n.nodeType===1&&n.tagName!=='BR'){walk(n)}
    });
  })(el);
  el.querySelectorAll('.wd').forEach(function(w,i){w.style.transitionDelay=(i*.075)+'s'});
});

// light dust field
var cv=document.getElementById('dust'),ctx=cv&&cv.getContext('2d'),pts=[],W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2);
function sizeCv(){if(!cv)return;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  var n=Math.round(Math.min(110,W*H/16000));pts=[];
  for(var i=0;i<n;i++){pts.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*.9+.1,r:Math.random()*1.6+.5,s:Math.random()*.11+.02,tw:Math.random()*6.28})}
}
var px=0,py=0,tx=0,ty=0;
function draw(){
  if(!ctx)return;
  px+=(tx-px)*.05;py+=(ty-py)*.05;
  ctx.clearRect(0,0,W,H);
  for(var i=0;i<pts.length;i++){
    var p=pts[i];p.y-=p.s;p.tw+=.018;
    if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
    var a=(.1+Math.abs(Math.sin(p.tw))*.28)*p.z;
    ctx.beginPath();ctx.arc(p.x+px*20*p.z,p.y+py*20*p.z,p.r*p.z+.2,0,6.284);
    ctx.fillStyle='rgba(33,79,152,'+a+')';ctx.fill();
  }
  requestAnimationFrame(draw);
}
if(cv&&!reduce){sizeCv();window.addEventListener('resize',sizeCv);draw()}

// pointer effects
var cur=document.getElementById('cur');
if(fine&&!reduce){
  window.addEventListener('pointermove',function(e){
    tx=e.clientX/window.innerWidth-.5;ty=e.clientY/window.innerHeight-.5;
    if(cur){cur.classList.add('on');cur.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)'}
  },{passive:true});
  document.querySelectorAll('.mag').forEach(function(b){
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      b.style.setProperty('--bx',(x*100)+'%');b.style.setProperty('--by',(y*100)+'%');
      b.style.transform='translate('+((x-.5)*9)+'px,'+((y-.5)*6)+'px)';
    });
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });
  document.querySelectorAll('.tlt').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

// nav
var nav=document.getElementById('nav');
window.addEventListener('scroll',function(){nav.classList.toggle('stuck',(window.scrollY||0)>8)},{passive:true});
var brg=document.getElementById('brg'),mn=document.getElementById('mn');
if(brg&&mn){
  brg.addEventListener('click',function(){var o=mn.classList.toggle('open');brg.setAttribute('aria-expanded',o)});
  mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');brg.setAttribute('aria-expanded','false')})});
}

// countdown to 20 September 2026, 11:00 AM IST
var TARGET=new Date('2026-09-20T11:00:00+05:30').getTime();
var cD=document.getElementById('cD'),cH=document.getElementById('cH'),cM=document.getElementById('cM'),cS=document.getElementById('cS');
function pad(n){return n<10?'0'+n:''+n}
function tick(){
  if(!cD)return;
  var d=TARGET-Date.now();
  if(d<0)d=0;
  var s=Math.floor(d/1000);
  cD.textContent=pad(Math.floor(s/86400));
  cH.textContent=pad(Math.floor(s%86400/3600));
  cM.textContent=pad(Math.floor(s%3600/60));
  cS.textContent=pad(s%60);
}
tick();setInterval(tick,1000);

// registration forms
document.querySelectorAll('.wf form').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var card=f.closest('.wf');
    var nm=(f.querySelector('[name=name]')||{}).value||'';
    var out=card.querySelector('.ok .nm-out');
    if(out)out.textContent=nm.trim().split(' ')[0]||'there';
    card.classList.add('done');
  });
});

// what-happens selector (3 parts)
var AUD=[
 {k:'Part 1 · ~45 minutes',h:'The Tamil Nadu Opportunity',p:'Why the demand is real, where the money is, and why almost nobody is trained to meet it yet.',l:['Why Tamil Nadu schools and colleges desperately need trained counsellors, and why almost none exist','How NEP 2020 made career guidance mandatory in every school, and why most schools still have nobody to deliver it','The real earning models: per-session fees, annual school contracts, parent seminars','Why career counselling in Tamil Nadu has almost zero trained competition right now'],c:'Register for ₹499'},
 {k:'Part 2 · ~60 minutes',h:'The Thisai AI Platform: Live Walkthrough',p:'A live look at the exact platform you will use with your own clients, assessment to report to session.',l:["How Thisai's AI conducts a full career assessment in under 30 minutes",'How to read and explain an AI-generated career report to a student and their parent','How to use Thisai for students from Class 9 all the way to working professionals','Why an AI-backed session builds more trust with parents than any manual method'],c:'Register for ₹499'},
 {k:'Part 3 · ~45 minutes',h:'Building Your Practice in Tamil Nadu',p:'The part nobody teaches: getting schools to say yes, pricing correctly, and landing your first paid session.',l:['How to pitch yourself to a school principal and walk out with an agreement','What parents in Tamil Nadu will pay, and how to price your services right','How to get your first 5 clients: schools, coaching centres, word-of-mouth, social media','Your first 30 days: a step-by-step action plan to your first paid session'],c:'Register for ₹499'}
];
var audL=document.getElementById('audL'),audP=document.getElementById('audP'),audBody=document.getElementById('audBody');
function renderAud(i){
  var d=AUD[i];
  audBody.className='fade';
  audBody.innerHTML='<div class="pk">'+d.k+'</div><h3>'+d.h+'</h3><p>'+d.p+'</p><div class="pl">'+d.l.map(function(x){return '<div><svg><use href="#k-check"/></svg>'+x+'</div>'}).join('')+'</div>';
  var btn=document.createElement('a');btn.className='btn btn-p mag';btn.href='#register';btn.innerHTML='<span>'+d.c+' <svg><use href="#k-arr"/></svg></span>';
  audBody.appendChild(btn);
  if(!reduce){audP.classList.remove('flash');void audP.offsetWidth;audP.classList.add('flash')}
}
if(audL){
  audL.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(){
      audL.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on');renderAud(+b.dataset.i);
    });
  });
  renderAud(0);
}

// why-now accordion
document.querySelectorAll('#cats .cat').forEach(function(c){
  var h=c.querySelector('.cat-h'),b=c.querySelector('.cat-b'),t=c.querySelector('h3');
  h.addEventListener('click',function(){
    var open=c.classList.contains('open');
    document.querySelectorAll('#cats .cat.open').forEach(function(o){o.classList.remove('open');o.querySelector('.cat-b').style.maxHeight='0px'});
    if(!open){c.classList.add('open');b.style.maxHeight=b.scrollHeight+'px';
      if(!reduce){t.classList.remove('gl');void t.offsetWidth;t.classList.add('gl')}}
  });
});

// faq
document.querySelectorAll('#faqList .q').forEach(function(q){
  var btn=q.querySelector('button'),a=q.querySelector('.a');
  btn.addEventListener('click',function(){
    var open=q.classList.contains('open');
    document.querySelectorAll('#faqList .q.open').forEach(function(o){o.classList.remove('open');o.querySelector('.a').style.maxHeight='0px';o.querySelector('button').setAttribute('aria-expanded','false')});
    if(!open){q.classList.add('open');a.style.maxHeight=a.scrollHeight+'px';btn.setAttribute('aria-expanded','true')}
  });
});

// lead-magnet popup
var pop=document.getElementById('pop'),popR=document.getElementById('popR');
var POPKEY='ws_pop_seen';
function popOpen(){
  if(!pop||pop.classList.contains('on'))return;
  pop.classList.add('on');document.body.style.overflow='hidden';
  var f=pop.querySelector('input');if(f&&fine)setTimeout(function(){f.focus()},420);
}
function popClose(){
  if(!pop)return;
  pop.classList.remove('on');document.body.style.overflow='';
  try{localStorage.setItem(POPKEY,'1')}catch(e){}
}
if(pop){
  pop.querySelectorAll('[data-close-pop]').forEach(function(b){b.addEventListener('click',popClose)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')popClose()});
  document.querySelectorAll('[data-open-pop]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();popOpen()})});
  // on mobile the hero form is replaced by the popup, route #register there
  document.querySelectorAll('a[href="#register"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(window.matchMedia('(max-width:760px)').matches){e.preventDefault();popOpen()}
    });
  });
  var seen=false;try{seen=!!localStorage.getItem(POPKEY)}catch(e){}
  if(!seen)setTimeout(popOpen,5000);
  var pf=popR&&popR.querySelector('form');
  if(pf)pf.addEventListener('submit',function(e){
    e.preventDefault();
    var nm=(pf.querySelector('[name=name]')||{}).value||'';
    var out=popR.querySelector('.ok .nm-out');
    if(out)out.textContent=nm.trim().split(' ')[0]||'there';
    popR.classList.add('done');
    try{localStorage.setItem(POPKEY,'1')}catch(e2){}
  });
}

// reveals + chapter light
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    if(e.target.classList.contains('ch'))e.target.classList.add('lit');
    io.unobserve(e.target);
  });
},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.rw,.ch,.fin').forEach(function(n){io.observe(n)});
// safety sweep, guarantees in-view content is revealed even if the observer misses (offline/bundled loads)
function sweep(){
  document.querySelectorAll('.rv,.rw,.ch,.fin').forEach(function(n){
    var r=n.getBoundingClientRect();
    if(r.top<window.innerHeight*.94&&r.bottom>0){n.classList.add('in');if(n.classList.contains('ch'))n.classList.add('lit')}
  });
}
sweep();window.addEventListener('load',function(){sweep();setTimeout(sweep,500)});setTimeout(sweep,1400);
window.addEventListener('scroll',sweep,{passive:true});

// sticky mobile CTA: appears once the hero scrolls away, hides over the final form
var sbar=document.getElementById('sbar'),fin=document.getElementById('final');
function sbarSync(){
  if(!sbar)return;
  var past=window.scrollY>window.innerHeight*.62;
  var atEnd=fin&&fin.getBoundingClientRect().top<window.innerHeight*.72;
  sbar.classList.toggle('on',past&&!atEnd);
}
sbarSync();window.addEventListener('scroll',sbarSync,{passive:true});window.addEventListener('resize',sbarSync);
})();
