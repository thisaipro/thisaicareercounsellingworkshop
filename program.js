(function(){
var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// word split for .rw headlines
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

// nav shadow + mobile menu
var nav=document.getElementById('nav');
if(nav)window.addEventListener('scroll',function(){nav.classList.toggle('stuck',(window.scrollY||0)>8)},{passive:true});
var brg=document.getElementById('brg'),mn=document.getElementById('mn');
if(brg&&mn){
  brg.addEventListener('click',function(){var o=mn.classList.toggle('open');brg.setAttribute('aria-expanded',o)});
  mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');brg.setAttribute('aria-expanded','false')})});
}

// curriculum accordion
document.querySelectorAll('#curriculum-list .cat').forEach(function(c){
  var h=c.querySelector('.cat-h'),b=c.querySelector('.cat-b'),t=c.querySelector('h3');
  h.addEventListener('click',function(){
    var open=c.classList.contains('open');
    document.querySelectorAll('#curriculum-list .cat.open').forEach(function(o){o.classList.remove('open');o.querySelector('.cat-b').style.maxHeight='0px'});
    if(!open){c.classList.add('open');b.style.maxHeight=b.scrollHeight+'px';
      if(!reduce&&t){t.classList.remove('gl');void t.offsetWidth;t.classList.add('gl')}}
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

// plan buttons → preselect the plan in the enquiry form, then scroll
document.querySelectorAll('[data-plan]').forEach(function(a){
  a.addEventListener('click',function(){
    var sel=document.getElementById('e-plan');
    if(sel){var want=a.getAttribute('data-plan');
      [].slice.call(sel.options).forEach(function(o){if(o.text.indexOf(want)===0)sel.value=o.value});
    }
  });
});

// enquiry form → hand the lead to WhatsApp with details prefilled
var WA='919345512955';
var form=document.querySelector('#enrollForm form');
if(form)form.addEventListener('submit',function(e){
  e.preventDefault();
  if(form.checkValidity&&!form.checkValidity()){if(form.reportValidity)form.reportValidity();return}
  function v(n){var el=form.querySelector('[name='+n+']');return el&&el.value?el.value.trim():''}
  var msg='Hi Thisai, I want to become a career counsellor.'
    +'\nName: '+v('name')
    +'\nPhone: '+v('phone')
    +'\nCity: '+v('city')
    +(v('email')?'\nEmail: '+v('email'):'')
    +'\nPlan: '+(v('plan')||'Not sure yet');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
});

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
function sweep(){
  document.querySelectorAll('.rv,.rw,.ch,.fin').forEach(function(n){
    var r=n.getBoundingClientRect();
    if(r.top<window.innerHeight*.94&&r.bottom>0){n.classList.add('in');if(n.classList.contains('ch'))n.classList.add('lit')}
  });
}
sweep();window.addEventListener('load',function(){sweep();setTimeout(sweep,500)});setTimeout(sweep,1400);
window.addEventListener('scroll',sweep,{passive:true});

// sticky CTA bar
var sbar=document.getElementById('sbar'),enroll=document.getElementById('enroll');
function sbarSync(){
  if(!sbar)return;
  var past=window.scrollY>window.innerHeight*.62;
  var atEnd=enroll&&enroll.getBoundingClientRect().top<window.innerHeight*.72;
  sbar.classList.toggle('on',past&&!atEnd);
}
sbarSync();window.addEventListener('scroll',sbarSync,{passive:true});window.addEventListener('resize',sbarSync);
})();
