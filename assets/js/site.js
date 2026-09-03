(function(){
  var root=document.documentElement;
  var body=document.body;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveal=document.querySelector('[data-reveal-screen]');
  var openButton=document.querySelector('[data-open-kroeg]');
  // Houd deze overgang gelijk met de langste deurtransitie in site.css.
  // Zo verdwijnt het introvenster niet terwijl de deuren nog openen.
  var INTRO_HANDOFF_MS=1360;

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
    // Eén paint tussen start en de hero-animatie voorkomt een zichtbare sprong
    // op tragere mobiele toestellen.
    window.requestAnimationFrame(function(){body.classList.add('site-entered');});
    window.setTimeout(function(){
      reveal.classList.add('is-hidden');
      body.classList.remove('has-intro');
      var firstLink=document.querySelector('.hero-actions a');
      if(firstLink)firstLink.focus({preventScroll:true});
    },quick?160:INTRO_HANDOFF_MS);
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
      item.style.setProperty('--motion-delay',((index%(stagger||6))*35)+'ms');
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
    },{threshold:.01,rootMargin:'0px 0px 18% 0px'});
    motionItems.forEach(function(item){observer.observe(item)});
  }else{
    motionItems.forEach(function(item){item.classList.add('is-visible')});
  }

  var progress=document.createElement('div');
  progress.className='scroll-progress';
  progress.setAttribute('aria-hidden','true');
  body.appendChild(progress);

  var header=document.querySelector('.site-header');
  var parallaxItems=reduced?[]:Array.prototype.slice.call(document.querySelectorAll('.hero-image, .page-hero-image'));
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


  // Wachtlijstformulier via Netlify Forms via Netlify Forms
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
      var safety=window.setTimeout(function(){if(!settled){settled=true;showError();}},15000);
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
    var prijzen={'Select':'€ 895','Signature':'€ 1.295','Reserve':'€ 1.595','Grand Open':'€ 1.995'};
    // Deze URL is publiek, maar de app bewaart zelf alle gevoelige sleutels.
    // Een aanvraag gaat rechtstreeks vanaf vargo.be naar de beveiligde leadgrens.
    var leadEndpoint='https://folipduhllpfkiqpqacg.supabase.co/functions/v1/website-lead';
    var submissionId=null;

    var aanvraagWaarden={
      flexibiliteit:{'Vaste datum':'fixed','Enkele weken speling':'weeks','Volledig flexibel':'flexible'},
      gelegenheid:{
        'Verjaardag':'birthday','Tuinfeest':'garden_party','Familiefeest':'family_party',
        'Huwelijk':'wedding','Bedrijfsfeest':'company_party','Communie of lentefeest':'communion',
        'Vrijgezellenfeest':'bachelor_party','Match night / sportavond':'match_night','Andere':'other'
      },
      gasten:{'Tot 20':'under_20','20 tot 40':'20_40','40 tot 75':'40_75','75 tot 150':'75_150','Meer dan 150':'over_150'},
      formule:{'Adviseer mij':'advice','Select':'select','Signature':'signature','Reserve':'reserve','Grand Open':'grand_open'},
      dranken:{
        'Pils':'pils','Speciaalbier':'special_beer','Wijn':'wine','Prosecco / spritz':'spritz',
        'Gin-tonic':'gin_tonic','Whisky / rum':'whisky_rum','Alcoholvrij':'non_alcoholic','Koffie':'coffee'
      },
      bediening:{'':'not_sure','Zelf schenken':'self_service','Bediening gewenst':'staffed','Adviseer mij':'advice'}
    };

    function uuidVoorAanvraag(){
      if(window.crypto&&typeof window.crypto.randomUUID==='function')return window.crypto.randomUUID();
      if(!window.crypto||typeof window.crypto.getRandomValues!=='function')return null;
      var bytes=new Uint8Array(16);window.crypto.getRandomValues(bytes);
      bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
      var hex=Array.prototype.map.call(bytes,function(b){return b.toString(16).padStart(2,'0');}).join('');
      return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
    }

    function zoekUtm(){
      var utm={};var zoek=new URLSearchParams(window.location.search);
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(naam){
        if(zoek.get(naam))utm[naam]=zoek.get(naam);
      });
      return utm;
    }

    function waardeVoorApp(naam){
      var veld=flow.querySelector('[name="'+naam+'"]');
      return veld&&typeof veld.value==='string'?veld.value.trim():'';
    }

    function keuzeVoorApp(groep,waarde){
      return aanvraagWaarden[groep][waarde]||null;
    }

    function aanvraagVoorApp(){
      submissionId=submissionId||uuidVoorAanvraag();
      var dranken=waardeVoorApp('dranken').split(',').map(function(waarde){
        return keuzeVoorApp('dranken',waarde.trim());
      }).filter(Boolean);
      return {
        client_submission_id:submissionId,
        terms_accepted:true,
        consent_version:'vargo-website-2026-09',
        first_name:waardeVoorApp('voornaam'),last_name:waardeVoorApp('naam'),
        email:waardeVoorApp('email'),phone:waardeVoorApp('telefoon'),
        requested_date:waardeVoorApp('datum')||null,alternative_date:waardeVoorApp('datum-alt')||null,
        date_flexibility:keuzeVoorApp('flexibiliteit',waardeVoorApp('flexibel')),
        postal_code:waardeVoorApp('postcode')||null,municipality:waardeVoorApp('gemeente')||null,
        occasion:keuzeVoorApp('gelegenheid',waardeVoorApp('gelegenheid')),
        guest_range:keuzeVoorApp('gasten',waardeVoorApp('gasten')),
        package_preference:keuzeVoorApp('formule',waardeVoorApp('formule')),
        drink_preferences:dranken,
        service_preference:keuzeVoorApp('bediening',waardeVoorApp('bediening')),
        favorite_brands:waardeVoorApp('merken')||null,event_notes:waardeVoorApp('wens')||null,
        page_url:window.location.href,referrer:document.referrer||null,utm:zoekUtm(),
        vargo_bericht_extra:waardeVoorApp('bot-field')
      };
    }

    function stuurNaarVargoApp(){
      var payload=aanvraagVoorApp();
      if(!payload.client_submission_id)return Promise.reject(new Error('Geen veilige inzendingssleutel beschikbaar.'));
      return fetch(leadEndpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      }).then(function(response){
        return response.json().catch(function(){return null;}).then(function(body){
          if(response.ok&&body&&body.ok===true)return body;
          throw new Error(body&&body.reason?body.reason:'VARGO-app antwoordde niet geldig.');
        });
      });
    }

    // Multi-select choices (dranken)
    var multiGroup=flow.querySelector('[data-multi="dranken"]');
    var drankenField=document.getElementById('field-dranken');
    function syncDranken(){
      if(!multiGroup||!drankenField)return;
      var picked=[];
      multiGroup.querySelectorAll('input:checked').forEach(function(cb){picked.push(cb.value);});
      drankenField.value=picked.join(', ');
    }
    // Klik op een link in een aanvinkveld opent de link, zonder het vinkje te wijzigen
    flow.querySelectorAll('.choice a').forEach(function(link){
      link.addEventListener('click',function(event){event.stopPropagation();});
    });
    flow.querySelectorAll('.choice input[type="checkbox"]').forEach(function(cb){
      // beginstand meteen juist zetten (bv. na terugkeer in het formulier)
      cb.closest('.choice').classList.toggle('is-on',cb.checked);
      cb.addEventListener('change',function(){
        cb.closest('.choice').classList.toggle('is-on',cb.checked);
        if(errorEl)errorEl.textContent='';
        syncDranken();
      });
    });
    flow.querySelectorAll('.choice input[type="radio"]').forEach(function(radio){
      radio.closest('.choice').classList.toggle('is-on',radio.checked);
      radio.addEventListener('change',function(){
        flow.querySelectorAll('.choice input[name="'+radio.name+'"]').forEach(function(other){other.closest('.choice').classList.toggle('is-on',other.checked);});
        if(errorEl)errorEl.textContent='';
      });
    });

    // Formule uit de aanbodpagina vooraf selecteren (?formule=Signature)
    try{
      var requested=new URLSearchParams(window.location.search).get('formule');
      if(requested){
        var match=flow.querySelector('input[name="formule"][value="'+requested.replace(/"/g,'\\"')+'"]');
        if(match){match.checked=true;match.dispatchEvent(new Event('change'));}
      }
    }catch(e){}

    flow.setAttribute('novalidate','novalidate');
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
        if(f.type==='checkbox'&&!f.checked){
          errorEl.textContent=f.name==='voorwaarden'
            ? 'Vink de algemene voorwaarden aan om je aanvraag te versturen.'
            : 'Vink dit vakje aan om verder te gaan.';
          f.focus({preventScroll:true});
          return false;
        }
        if(f.type==='radio'){
          if(!steps[index].querySelector('input[name="'+f.name+'"]:checked')){errorEl.textContent='Kies één optie om verder te gaan.';f.focus({preventScroll:true});return false;}
        }else if(f.type!=='checkbox'&&(!f.value||!f.value.trim())){
          errorEl.textContent='Vul dit veld nog even in om verder te gaan.';
          f.focus({preventScroll:true});
          return false;
        }
      }
      return true;
    }

    nextBtn.addEventListener('click',function(){if(validateStep(current))showStep(current+1);});
    backBtn.addEventListener('click',function(){if(current>0)showStep(current-1);});
    // Eigen validatie vóór de browser zijn standaardmelding toont
    submitBtn.addEventListener('click',function(event){
      if(!validateStep(current)){event.preventDefault();}
    });

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
        var rows=[['Datum',g('datum')],['Gemeente',g('gemeente')],['Gelegenheid',g('gelegenheid')],['Gasten',g('gasten')],['Formule',g('formule')],['Dranken',g('dranken')],['Bediening',g('bediening')]];
        var summary=document.getElementById('flow-summary');
        while(summary.firstChild)summary.removeChild(summary.firstChild);
        rows.filter(function(r){return r[1];}).forEach(function(r){
          var row=document.createElement('div');var label=document.createElement('span');var value=document.createElement('b');
          label.textContent=r[0];value.textContent=r[1];row.appendChild(label);row.appendChild(value);summary.appendChild(row);
        });
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
      var safety=window.setTimeout(function(){if(!settled){settled=true;showError();}},15000);
      // Netlify bewaart nog steeds een onafhankelijke kopie voor de bestaande
      // e-mailmelding. De app is de bron voor een geslaagde aanvraag: pas als
      // die ontvangstfunctie antwoordt, tonen we de bevestiging aan de klant.
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded.toString()})
        .then(function(r){if(!r.ok)console.warn('Netlify kon de reservekopie niet bewaren.');})
        .catch(function(){console.warn('Netlify kon de reservekopie niet bewaren.');});
      stuurNaarVargoApp()
        .then(function(){if(settled)return;settled=true;window.clearTimeout(safety);showDone();})
        .catch(function(){if(settled)return;settled=true;window.clearTimeout(safety);showError();});
    });

    showStep(0);
  }
})();
