(function(){
  var root=document.documentElement;
  var body=document.body;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveal=document.querySelector('[data-reveal-screen]');
  var openButton=document.querySelector('[data-open-kroeg]');

  root.classList.add('motion-ready');

  var SEEN_KEY='vargo-intro-seen';
  function introAlreadySeen(){
    try{return window.sessionStorage&&window.sessionStorage.getItem(SEEN_KEY)==='1';}catch(e){return false;}
  }
  function markIntroSeen(){
    try{if(window.sessionStorage)window.sessionStorage.setItem(SEEN_KEY,'1');}catch(e){}
  }

  function closeReveal(fast){
    if(!reveal||reveal.classList.contains('is-opening'))return;
    markIntroSeen();
    var quick=fast||reduced;
    reveal.classList.add('is-opening');
    if(document.activeElement&&reveal.contains(document.activeElement))document.activeElement.blur();
    reveal.setAttribute('aria-hidden','true');
    body.classList.add('site-entered');
    window.setTimeout(function(){
      reveal.classList.add('is-hidden');
      body.classList.remove('has-intro');
      var firstLink=document.querySelector('.hero-actions a');
      if(firstLink)firstLink.focus({preventScroll:true});
    },quick?160:1180);
  }

  document.querySelectorAll('[data-open-kroeg]').forEach(function(button){
    button.addEventListener('click',function(){closeReveal(false)});
  });
  document.querySelectorAll('[data-skip-kroeg]').forEach(function(button){
    button.addEventListener('click',function(){closeReveal(true)});
  });
  if(reveal&&introAlreadySeen()){
    // Reveal al gezien deze sessie: meteen tonen zonder animatie
    reveal.classList.add('is-hidden');
    reveal.setAttribute('aria-hidden','true');
    body.classList.add('site-entered');
    reveal=null;
  }
  if(reveal){
    body.classList.add('has-intro');
    window.setTimeout(function(){if(openButton)openButton.focus({preventScroll:true})},80);
  }else{
    body.classList.add('site-entered');
  }

  var menu=document.querySelector('[data-menu-toggle]');
  var mobileNav=document.querySelector('[data-mobile-nav]');
  if(menu&&mobileNav){
    menu.addEventListener('click',function(){
      var open=mobileNav.classList.toggle('open');
      menu.setAttribute('aria-expanded',String(open));
      menu.textContent=open?'Sluiten ×':'Menu +';
    });
  }

  var faqButtons=document.querySelectorAll('[data-faq-button]');
  function setFaqState(button,open){
    var item=button.closest('.faq-item');
    var answer=item&&item.querySelector('.faq-answer');
    if(!item||!answer)return;
    item.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    answer.style.maxHeight=open?answer.scrollHeight+'px':'0px';
  }
  faqButtons.forEach(function(button){
    setFaqState(button,button.closest('.faq-item').classList.contains('is-open'));
    button.addEventListener('click',function(){
      setFaqState(button,!button.closest('.faq-item').classList.contains('is-open'));
    });
  });

  var motionItems=[];
  function addMotion(items,type,stagger){
    Array.prototype.forEach.call(items,function(item,index){
      if(item.classList.contains('motion-item'))return;
      item.classList.add('motion-item');
      item.setAttribute('data-motion',type||'rise');
      item.style.setProperty('--motion-delay',((index%(stagger||6))*70)+'ms');
      motionItems.push(item);
    });
  }

  addMotion(document.querySelectorAll('.top-copy > *, .page-hero .wrap > *, .hero-copy > *, .section-head > *, .copy > *, .story > *, .waitlist > *, .article-hero > *, .article-layout > *, .inline-cta > *'),'rise',5);
  addMotion(document.querySelectorAll('.feature, .timeline article, .occasion, .event-card, .article-card, .faq-item, .form-panel .field'),'card',6);
  addMotion(document.querySelectorAll('.gallery figure'),'image',5);
  addMotion(document.querySelectorAll('.intro-photo, .detail-tall, .detail-copy, .detail-wide, .blog-feature > *, .contact > *'),'image',4);

  document.querySelectorAll('[data-reveal]').forEach(function(item){
    item.classList.add('motion-container');
  });

  if(!reduced&&'IntersectionObserver'in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -7% 0px'});
    motionItems.forEach(function(item){observer.observe(item)});
  }else{
    motionItems.forEach(function(item){item.classList.add('is-visible')});
  }

  var progress=document.createElement('div');
  progress.className='scroll-progress';
  progress.setAttribute('aria-hidden','true');
  body.appendChild(progress);

  var header=document.querySelector('.site-header');
  var parallaxItems=reduced?[]:Array.prototype.slice.call(document.querySelectorAll('.hero-image, .page-hero-image, .intro-photo, .detail-tall, .detail-wide, .contact-image, .gallery .photo'));
  parallaxItems.forEach(function(item){
    item.classList.add('parallax-photo');
    item.style.backgroundPositionY='calc(50% + var(--parallax-y, 0px))';
  });

  var ticking=false;
  function updateScrollMotion(){
    var y=window.scrollY||window.pageYOffset;
    var scrollable=Math.max(1,root.scrollHeight-window.innerHeight);
    progress.style.transform='scaleX('+Math.min(1,y/scrollable)+')';
    if(header)header.classList.toggle('is-scrolled',y>42);
    parallaxItems.forEach(function(item){
      var rect=item.getBoundingClientRect();
      if(rect.bottom<0||rect.top>window.innerHeight)return;
      var center=rect.top+rect.height/2-window.innerHeight/2;
      var shift=Math.max(-26,Math.min(26,center*-.035));
      item.style.setProperty('--parallax-y',shift.toFixed(2)+'px');
    });
    ticking=false;
  }
  function requestScrollMotion(){
    if(!ticking){
      window.requestAnimationFrame(updateScrollMotion);
      ticking=true;
    }
  }
  window.addEventListener('scroll',requestScrollMotion,{passive:true});
  window.addEventListener('resize',function(){
    faqButtons.forEach(function(button){
      if(button.closest('.faq-item').classList.contains('is-open'))setFaqState(button,true);
    });
    requestScrollMotion();
  });
  requestScrollMotion();

  if(!reduced){
    var wipe=document.createElement('div');
    wipe.className='page-wipe';
    wipe.setAttribute('aria-hidden','true');
    body.appendChild(wipe);
    document.querySelectorAll('a[href]').forEach(function(link){
      link.addEventListener('click',function(event){
        var href=link.getAttribute('href');
        if(!href||href.charAt(0)==='#'||href.indexOf('mailto:')===0||link.target==='_blank'||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        var target=new URL(link.href,window.location.href);
        if(target.origin!==window.location.origin)return;
        event.preventDefault();
        wipe.classList.add('is-active');
        window.setTimeout(function(){window.location.href=target.href},360);
      });
    });
  }

  // Fail-proof wachtlijstformulier via Netlify Forms
  var waitlistForm=document.querySelector('form[name="vargo-wachtlijst"]');
  if(waitlistForm){
    waitlistForm.addEventListener('submit',function(event){
      var honeypot=waitlistForm.querySelector('[name="bot-field"]');
      if(honeypot&&honeypot.value){event.preventDefault();return;}
      event.preventDefault();
      var button=waitlistForm.querySelector('button[type="submit"]');
      var original=button?button.innerHTML:'';
      if(button){button.disabled=true;button.innerHTML='Versturen…';}
      var data=new FormData(waitlistForm);
      var encoded=new URLSearchParams();
      data.forEach(function(value,key){encoded.append(key,value);});
      function goThanks(){window.location.href='/bedankt.html';}
      function showError(){
        if(button){button.disabled=false;button.innerHTML=original;}
        var note=waitlistForm.querySelector('.form-note');
        if(note){note.textContent='Versturen lukte niet. Probeer opnieuw of mail naar feestje@vargo.be.';note.style.color='#E8873A';}
      }
      var settled=false;
      var safety=window.setTimeout(function(){if(!settled){settled=true;goThanks();}},8000);
      fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:encoded.toString()
      }).then(function(response){
        if(settled)return;settled=true;window.clearTimeout(safety);
        if(response.ok){goThanks();}else{showError();}
      }).catch(function(){
        if(settled)return;settled=true;window.clearTimeout(safety);
        showError();
      });
    });
  }

  // Slim stappenformulier (aanvraag)
  var flow=document.getElementById('vargo-flow');
  if(flow){
    var steps=Array.prototype.slice.call(flow.querySelectorAll('.flow-step'));
    var totalSteps=steps.length;
    var current=0;
    var bar=document.getElementById('flow-bar');
    var count=document.getElementById('flow-count');
    var backBtn=document.getElementById('flow-back');
    var nextBtn=document.getElementById('flow-next');
    var submitBtn=document.getElementById('flow-submit');
    var errorEl=document.getElementById('flow-error');
    var prijzen={'Select (vanaf 895)':'€ 895','Signature (vanaf 1295)':'€ 1.295','Reserve (vanaf 1595)':'€ 1.595','Grand Open (vanaf 1995)':'€ 1.995'};

    // Multi-select choices (dranken)
    var multiGroup=flow.querySelector('[data-multi="dranken"]');
    var drankenField=document.getElementById('field-dranken');
    function syncDranken(){
      if(!multiGroup||!drankenField)return;
      var picked=[];
      multiGroup.querySelectorAll('input:checked').forEach(function(cb){picked.push(cb.value);});
      drankenField.value=picked.join(', ');
    }
    flow.querySelectorAll('.choice input[type="checkbox"]').forEach(function(cb){
      cb.addEventListener('change',function(){
        cb.closest('.choice').classList.toggle('is-on',cb.checked);
        syncDranken();
      });
    });

    var flowFirstRender=true;
    function showStep(index){
      steps.forEach(function(s,i){s.classList.toggle('active',i===index);});
      current=index;
      var pct=Math.round(((index+1)/totalSteps)*100);
      if(bar)bar.style.width=pct+'%';
      if(count)count.textContent='Stap '+(index+1)+' van '+totalSteps;
      backBtn.hidden=index===0;
      nextBtn.hidden=index===totalSteps-1;
      submitBtn.hidden=index!==totalSteps-1;
      errorEl.textContent='';
      var firstInput=steps[index].querySelector('input,select,textarea');
      if(firstInput)firstInput.focus({preventScroll:true});
      if(flowFirstRender){flowFirstRender=false;return;}
      var headerH=90;
      var top=flow.getBoundingClientRect().top+window.pageYOffset-headerH;
      window.scrollTo({top:top,behavior:'smooth'});
    }

    function validateStep(index){
      var required=steps[index].querySelectorAll('[required]');
      for(var i=0;i<required.length;i++){
        var f=required[i];
        if((f.type==='checkbox'&&!f.checked)||(!f.value||!f.value.trim())){
          errorEl.textContent='Vul dit veld nog even in om verder te gaan.';
          f.focus({preventScroll:true});
          return false;
        }
      }
      return true;
    }

    nextBtn.addEventListener('click',function(){if(validateStep(current))showStep(current+1);});
    backBtn.addEventListener('click',function(){if(current>0)showStep(current-1);});

    flow.addEventListener('submit',function(event){
      var honeypot=flow.querySelector('[name="bot-field"]');
      if(honeypot&&honeypot.value){event.preventDefault();return;}
      event.preventDefault();
      if(!validateStep(current))return;
      syncDranken();
      submitBtn.disabled=true;submitBtn.innerHTML='Versturen…';
      var data=new FormData(flow);
      var encoded=new URLSearchParams();
      data.forEach(function(value,key){encoded.append(key,value);});

      function showDone(){
        var done=document.getElementById('flow-done');
        var shell=flow.closest('.flow-shell');
        if(shell)shell.querySelector('#vargo-flow').style.display='none';
        // Samenvatting opbouwen
        var g=function(n){var el=flow.querySelector('[name="'+n+'"]');return el?el.value:'';};
        var rows=[['Datum',g('datum')],['Gemeente',g('gemeente')],['Gelegenheid',g('gelegenheid')],['Gasten',g('gasten')],['Formule',g('formule')],['Dranken',g('dranken')]];
        var summary=document.getElementById('flow-summary');
        summary.innerHTML=rows.filter(function(r){return r[1];}).map(function(r){return '<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join('');
        var formule=g('formule');
        var ind=document.getElementById('flow-indicative');
        if(prijzen[formule]){ind.innerHTML='Indicatieve vanafprijs voor deze formule: <b>'+prijzen[formule]+'</b>';}
        else{ind.textContent='We stellen jullie voorstel persoonlijk samen op basis van deze aanvraag.';}
        done.classList.add('active');
        done.scrollIntoView({behavior:'smooth',block:'start'});
      }
      function showError(){
        submitBtn.disabled=false;submitBtn.innerHTML='Verstuur aanvraag <span>↗</span>';
        errorEl.textContent='Versturen lukte niet. Probeer opnieuw of mail naar feestje@vargo.be.';
      }
      var settled=false;
      var safety=window.setTimeout(function(){if(!settled){settled=true;showDone();}},8000);
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded.toString()})
        .then(function(r){if(settled)return;settled=true;window.clearTimeout(safety);if(r.ok){showDone();}else{showError();}})
        .catch(function(){if(settled)return;settled=true;window.clearTimeout(safety);showError();});
    });

    showStep(0);
  }
})();
