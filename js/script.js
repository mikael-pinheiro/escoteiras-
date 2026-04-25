(function(){
  var fmt=function(d){return d.toLocaleDateString('pt-BR')};
  var today=new Date();
  var tomorrow=new Date();
  tomorrow.setDate(today.getDate()+1);
  document.querySelectorAll('[data-today]').forEach(function(el){el.textContent=fmt(today)});
  document.querySelectorAll('[data-tomorrow]').forEach(function(el){el.textContent=fmt(tomorrow)});

  var iframe=document.getElementById('miniVsl');
  var overlay=document.querySelector('.video-overlay');
  var playing=false;
  function send(method,value){
    if(!iframe||!iframe.contentWindow)return;
    iframe.contentWindow.postMessage(JSON.stringify({method:method,value:value}),'https://player.vimeo.com');
  }
  function setPlaying(value){
    playing=value;
    if(overlay){
      overlay.classList.toggle('playing',playing);
      overlay.setAttribute('aria-label',playing?'Pausar vídeo':'Iniciar vídeo');
    }
  }
  if(overlay){
    overlay.addEventListener('click',function(){
      if(playing){send('pause');setPlaying(false)}else{send('play');setPlaying(true)}
    });
  }
  window.addEventListener('message',function(event){
    if(event.origin!=='https://player.vimeo.com')return;
    var data=event.data;
    if(typeof data==='string'){
      try{data=JSON.parse(data)}catch(e){return}
    }
    if(data.event==='play')setPlaying(true);
    if(data.event==='pause')setPlaying(false);
    if(data.event==='ended'){send('setCurrentTime',0);setPlaying(false)}
  });

  var carousel=document.querySelector('[data-carousel]');
  if(carousel){
    var track=carousel.querySelector('.carousel-track');
    var slides=carousel.querySelectorAll('article');
    var dotsWrap=document.querySelector('.carousel-dots');
    var current=0;
    function render(){
      track.style.transform='translateX(-'+(current*100)+'%)';
      dotsWrap.querySelectorAll('button').forEach(function(btn,i){btn.classList.toggle('active',i===current)});
    }
    slides.forEach(function(_,i){
      var dot=document.createElement('button');
      dot.type='button';
      dot.setAttribute('aria-label','Ir para exemplo '+(i+1));
      dot.addEventListener('click',function(){current=i;render()});
      dotsWrap.appendChild(dot);
    });
    carousel.querySelector('.prev').addEventListener('click',function(){current=(current-1+slides.length)%slides.length;render()});
    carousel.querySelector('.next').addEventListener('click',function(){current=(current+1)%slides.length;render()});
    render();
    setInterval(function(){current=(current+1)%slides.length;render()},3500);
  }

  document.querySelectorAll('.faq button').forEach(function(btn){
    btn.addEventListener('click',function(){
      var content=btn.nextElementSibling;
      var isOpen=content.classList.contains('open');
      document.querySelectorAll('.faq button').forEach(function(b){b.classList.remove('active')});
      document.querySelectorAll('.faq div').forEach(function(d){d.classList.remove('open')});
      if(!isOpen){btn.classList.add('active');content.classList.add('open')}
    });
  });

  var modal=document.querySelector('[data-offer-modal]');
  function openModal(){modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
  function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
  document.querySelectorAll('[data-open-offer]').forEach(function(btn){btn.addEventListener('click',openModal)});
  document.querySelectorAll('[data-close-offer]').forEach(function(btn){btn.addEventListener('click',closeModal)});
  if(modal){modal.addEventListener('click',function(e){if(e.target===modal)closeModal()})}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal&&modal.classList.contains('open'))closeModal()});

  var proofs=[{name:'Bruno S.',city:'RJ',plan:'Premium'},{name:'Fernanda L.',city:'SP',plan:'Premium'},{name:'Ricardo M.',city:'MG',plan:'Básico'},{name:'Juliana P.',city:'PR',plan:'Premium'},{name:'Marcos A.',city:'SC',plan:'Premium'}];
  var proofBox=document.querySelector('.social-proof');
  var proofIndex=0;
  function showProof(){
    if(!proofBox)return;
    var p=proofs[proofIndex];
    proofBox.querySelector('strong').textContent=p.name+' — '+p.city;
    proofBox.querySelector('small').textContent='Comprou o '+p.plan;
    proofBox.classList.add('show');
    setTimeout(function(){proofBox.classList.remove('show');proofIndex=(proofIndex+1)%proofs.length},3000);
  }
  setTimeout(showProof,5000);
  setInterval(showProof,8000);
})();
