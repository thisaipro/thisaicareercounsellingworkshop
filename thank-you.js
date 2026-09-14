(function(){
var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// nav shadow on scroll
var nav=document.getElementById('nav');
if(nav)window.addEventListener('scroll',function(){nav.classList.toggle('stuck',(window.scrollY||0)>8)},{passive:true});

// light dust field (matches the landing page)
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

// cursor glow + magnetic buttons
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
}

// reveal on scroll
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    if(e.target.classList.contains('ch'))e.target.classList.add('lit');
    io.unobserve(e.target);
  });
},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.ch,.fin').forEach(function(n){io.observe(n)});
function sweep(){
  document.querySelectorAll('.rv,.ch,.fin').forEach(function(n){
    var r=n.getBoundingClientRect();
    if(r.top<window.innerHeight*.94&&r.bottom>0){n.classList.add('in');if(n.classList.contains('ch'))n.classList.add('lit')}
  });
}
sweep();window.addEventListener('load',function(){sweep();setTimeout(sweep,500)});setTimeout(sweep,1400);
window.addEventListener('scroll',sweep,{passive:true});

// ── calendar links ── (20 Sep 2026, 11:00 IST = 05:30 UTC, 3h → 08:30 UTC)
var EV={
  title:'Thisai Career Counsellor Workshop',
  start:'20260920T053000Z',
  end:'20260920T083000Z',
  details:'Live online career counsellor workshop with Jayachandran, Co-Founder of Thisai. Tamil + English. The joining link is shared in the workshop WhatsApp group.',
  location:'Live Online'
};
var gc=document.getElementById('gcal');
if(gc)gc.href='https://calendar.google.com/calendar/render?action=TEMPLATE'+
  '&text='+encodeURIComponent(EV.title)+
  '&dates='+EV.start+'/'+EV.end+
  '&details='+encodeURIComponent(EV.details)+
  '&location='+encodeURIComponent(EV.location);
var ic=document.getElementById('ics');
if(ic){
  var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Thisai//Career Counsellor Workshop//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
    'BEGIN:VEVENT','UID:'+EV.start+'-thisai-workshop@thisai.pro','DTSTAMP:'+EV.start,'DTSTART:'+EV.start,'DTEND:'+EV.end,
    'SUMMARY:'+EV.title,'DESCRIPTION:'+EV.details.replace(/([,;])/g,'\\$1'),'LOCATION:'+EV.location,
    'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Thisai workshop tomorrow','END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  try{ic.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));ic.setAttribute('download','thisai-workshop.ics');}
  catch(e){ic.href='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);ic.setAttribute('download','thisai-workshop.ics');}
}

// ── share the workshop page ──
var shareUrl=(location.origin&&location.origin!=='null')
  ? location.origin+location.pathname.replace(/[^\/]*$/,'')
  : 'https://www.thisai.pro';
var waMsg="I just registered for Tamil Nadu's first AI-powered Career Counsellor Workshop by Thisai — 20 September 2026, live online. Only 50 seats. Register here: ";
var wa=document.getElementById('waShare');
if(wa)wa.href='https://wa.me/?text='+encodeURIComponent(waMsg+shareUrl);

var cp=document.getElementById('copyBtn');
if(cp)cp.addEventListener('click',function(){
  var lbl=cp.querySelector('.lbl');
  function done(){if(!lbl)return;var old=lbl.textContent;lbl.textContent='Link copied ✓';setTimeout(function(){lbl.textContent=old},2000)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(shareUrl).then(done,done)}
  else{var t=document.createElement('textarea');t.value=shareUrl;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.focus();t.select();try{document.execCommand('copy')}catch(e){}t.remove();done()}
});
})();
