document.addEventListener('DOMContentLoaded',()=>{

// NAVBAR scroll state
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

// mobile menu
const burger=document.getElementById('navBurger');
const mobileMenu=document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('open');
});
document.querySelectorAll('[data-nav]').forEach(link=>{
  link.addEventListener('click',()=>mobileMenu.classList.remove('open'));
});

// custom cursor dot (desktop only)
const cursorDot=document.getElementById('cursorDot');
if(window.matchMedia('(hover:hover)').matches){
  window.addEventListener('mousemove',e=>{
    cursorDot.style.left=e.clientX+'px';
    cursorDot.style.top=e.clientY+'px';
  });
}

// scroll reveal via IntersectionObserver
const revealEls=document.querySelectorAll('.reveal');
const io=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{threshold:.15,rootMargin:'0px 0px -60px 0px'});
revealEls.forEach((el,i)=>{
  el.style.transitionDelay=(i%4)*70+'ms';
  io.observe(el);
});

// story trace svg draw-in
const storyVisual=document.querySelector('.story-visual');
if(storyVisual){
  const io2=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in');io2.unobserve(entry.target);}
    });
  },{threshold:.4});
  io2.observe(storyVisual);
}

// animated counters
const counters=document.querySelectorAll('.stat-num');
const countIO=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      const target=parseInt(el.dataset.count,10);
      const duration=1400;
      const start=performance.now();
      function tick(now){
        const p=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.floor(eased*target);
        if(p<1)requestAnimationFrame(tick);else el.textContent=target;
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    }
  });
},{threshold:.6});
counters.forEach(c=>countIO.observe(c));

// process rail fill
const rail=document.getElementById('railLine');
const railFill=document.getElementById('railFill');
if(rail){
  const railIO=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){railFill.style.width='100%';railIO.unobserve(entry.target);}
    });
  },{threshold:.3});
  railIO.observe(rail);
}

// tilt effect on founder cards
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

// testimonial auto-scroll track
const track=document.getElementById('testiTrack');
if(track){
  let pos=0;
  let paused=false;
  track.addEventListener('mouseenter',()=>paused=true);
  track.addEventListener('mouseleave',()=>paused=false);
  function loopScroll(){
    if(!paused){
      pos-=0.4;
      const resetPoint=-(track.scrollWidth/2);
      if(pos<resetPoint)pos=0;
      track.style.transform=`translateX(${pos}px)`;
    }
    requestAnimationFrame(loopScroll);
  }
  // duplicate cards for seamless loop on wide screens
  if(window.innerWidth>720){
    track.innerHTML+=track.innerHTML;
    requestAnimationFrame(loopScroll);
  }
}

// book form submit (front-end only demo)
const bookForm=document.getElementById('bookForm');
const formNote=document.getElementById('formNote');
if(bookForm){
  bookForm.addEventListener('submit',e=>{
    e.preventDefault();
    formNote.textContent='Brief received — we\'ll reply within one business day.';
    bookForm.reset();
  });
}

// smooth anchor scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    const targetId=this.getAttribute('href');
    if(targetId.length>1){
      const target=document.querySelector(targetId);
      if(target){
        e.preventDefault();
        const offset=80;
        const top=target.getBoundingClientRect().top+window.scrollY-offset;
        window.scrollTo({top,behavior:'smooth'});
      }
    }
  });
});

});