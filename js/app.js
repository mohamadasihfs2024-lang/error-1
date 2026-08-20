document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- fill in data-driven text ---------------- */
  document.getElementById('i-line1').textContent = birthdayData.intro1;
  document.getElementById('i-line2').textContent = birthdayData.intro2;
  document.getElementById('heroName').textContent = birthdayData.name + ' ❤️';
  document.getElementById('heroTag').textContent = birthdayData.heroTagline;
  document.getElementById('galleryCaption').textContent = birthdayData.memories[0].caption;
  document.getElementById('letterText').textContent = birthdayData.finalMessage;
  document.querySelectorAll('#finalHeadline').forEach(el=>{
    el.innerHTML = 'Happy Birthday,<br>' + birthdayData.name + ' ❤️';
  });

  const timelineList = document.getElementById('timelineList');
  birthdayData.timeline.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'tl-item reveal';
    div.innerHTML = `<div class="tl-dot"></div><div class="tl-card"><h3>${item.title}</h3><p>${item.text}</p></div>`;
    timelineList.appendChild(div);
  });

  const nsList = document.getElementById('neverSaidList');
  birthdayData.thingsNeverSaid.forEach((msg) => {
    const p = document.createElement('p');
    p.className = 'ns-quote reveal';
    p.textContent = msg;
    nsList.appendChild(p);
  });

  /* ---------------- background stars canvas ---------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;
  function resizeCanvas(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initStars(){
    const count = Math.min(120, Math.floor((W*H)/14000));
    stars = Array.from({length:count}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.4+.3,
      tw: Math.random()*Math.PI*2,
      speed: Math.random()*0.015+0.004
    }));
  }
  resizeCanvas(); initStars();
  window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

  function drawStars(t){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      const alpha = 0.35 + Math.sin(t*s.speed*60 + s.tw)*0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(244,236,221,${Math.max(0,alpha)})`;
      ctx.fill();
    }
  }
  let raf;
  function loop(t){
    drawStars(t/1000);
    raf = requestAnimationFrame(loop);
  }
  if(!reduceMotion){ raf = requestAnimationFrame(loop); } else { drawStars(0); }

  /* ---------------- petals ---------------- */
  function spawnPetal(){
    if(reduceMotion) return;
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = Math.random() > .5 ? '❀' : '✿';
    p.style.left = Math.random()*100 + 'vw';
    p.style.setProperty('--drift', (Math.random()*120-60)+'px');
    const dur = 7+Math.random()*6;
    p.style.animationDuration = dur+'s';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), dur*1000+200);
  }
  let petalInterval = setInterval(spawnPetal, 1400);

  /* ---------------- floating hearts ---------------- */
  function spawnHeart(){
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.innerHTML = '❤';
    h.style.left = (20+Math.random()*60) + 'vw';
    h.style.bottom = '10vh';
    h.style.fontSize = (0.8+Math.random()*1.2)+'rem';
    h.style.setProperty('--hx', (Math.random()*80-40)+'px');
    const dur = 3.5+Math.random()*2;
    h.style.animationDuration = dur+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), dur*1000+200);
  }

  /* ---------------- ripple on buttons ---------------- */
  document.querySelectorAll('.lux-btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size+'px';
      ripple.style.left = (e.clientX - rect.left - size/2)+'px';
      ripple.style.top = (e.clientY - rect.top - size/2)+'px';
      this.appendChild(ripple);
      setTimeout(()=>ripple.remove(), 700);
    });
  });

  /* ================= SCENE SEQUENCE ================= */
  const sceneIntro = document.getElementById('scene-intro');
  const sceneGift = document.getElementById('scene-gift');
  const site = document.getElementById('site');
  const body = document.body;

  // intro reveal timing
  setTimeout(()=>document.getElementById('i-eyebrow').classList.add('in'), 300);
  setTimeout(()=>document.getElementById('i-line1').classList.add('in'), 900);
  setTimeout(()=>document.getElementById('i-line2').classList.add('in'), 2200);
  setTimeout(()=>document.getElementById('openBtn').classList.add('in'), 3200);

  document.getElementById('openBtn').addEventListener('click', () => {
    sceneIntro.classList.add('fade-out');
    setTimeout(() => {
      sceneIntro.classList.add('hidden');
      sceneGift.classList.remove('hidden');
    }, 1000);
  });

  /* ---- gift opening sequence : THE MAIN SHOCK MOMENT ---- */
  const giftBox = document.getElementById('giftBox');
  const lightBurst = document.getElementById('lightBurst');
  const flashOverlay = document.getElementById('flashOverlay');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const bgMusic = document.getElementById('bgMusic');
  let giftOpened = false;

  function openGift(){
    if(giftOpened) return;
    giftOpened = true;

    giftBox.classList.add('opening');
    lightBurst.classList.add('burst');

    // gentle slow-down feel via a brief pause before the burst
    setTimeout(() => {
      // confetti + petals
      if (window.confetti) {
        confetti({
          particleCount: 130,
          spread: 100,
          startVelocity: 42,
          origin: { y: 0.55 },
          colors: ['#cba14c', '#e9cd8c', '#f4ecdd', '#d9a3c7']
        });
        setTimeout(()=>confetti({
          particleCount: 80, spread: 130, startVelocity: 30,
          origin: { y: 0.5 }, colors: ['#cba14c','#e9cd8c','#d9a3c7']
        }), 300);
      }
      for(let i=0;i<10;i++) setTimeout(spawnPetal, i*120);

      // music - start after user interaction, gracefully handle autoplay block
      bgMusic.volume = 0.75;
      bgMusic.play().then(()=>{
        document.getElementById('music-player').classList.add('show');
      }).catch(()=>{
        // autoplay blocked or file missing - show player anyway so she can hit play
        document.getElementById('music-player').classList.add('show');
      });

    }, 550);

    // transition into the main site
    setTimeout(() => {
      sceneGift.classList.add('fade-out');
    }, 1500);

    setTimeout(() => {
      sceneGift.classList.add('hidden');
      site.classList.remove('hidden');
      body.classList.remove('locked');
      window.scrollTo(0,0);
      revealHero();
    }, 2500);
  }
  openGiftBtn.addEventListener('click', openGift);
  giftBox.addEventListener('click', openGift);

  function revealHero(){
    setTimeout(()=>document.getElementById('heroFrame').classList.add('in'), 150);
    setTimeout(()=>document.getElementById('heroHeading').classList.add('in'), 700);
    setTimeout(()=>document.getElementById('heroName').classList.add('in'), 1050);
    setTimeout(()=>document.getElementById('heroTag').classList.add('in'), 1450);
  }

  /* ================= SCROLL REVEAL (IntersectionObserver) ================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // stagger timeline / never-said items slightly
  document.querySelectorAll('.tl-item.reveal').forEach((el,i)=>{
    el.style.transitionDelay = (i*0.08)+'s';
  });
  document.querySelectorAll('.ns-quote.reveal').forEach((el,i)=>{
    el.style.transitionDelay = (i*0.15)+'s';
  });

  /* ---------------- typewriter message ---------------- */
  let typed = false;
  const twBox = document.getElementById('typewriterBox');
  const twObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !typed){
        typed = true;
        typeMessage(birthdayData.birthdayMessage, twBox);
      }
    });
  }, {threshold:0.4});
  twObserver.observe(document.getElementById('message-section'));

  function typeMessage(text, container){
    let i = 0;
    const caret = container.querySelector('.caret');
    const speed = reduceMotion ? 0 : 18;
    function step(){
      if(i <= text.length){
        container.textContent = text.slice(0,i);
        container.appendChild(caret);
        i++;
        if(speed===0){ container.textContent = text; return; }
        setTimeout(step, speed);
      }
    }
    step();
  }

  document.getElementById('moreBtn').addEventListener('click', ()=>{
    document.getElementById('gallery-section').scrollIntoView({behavior:'smooth'});
  });

  /* ---------------- final surprise sequence ---------------- */
  let finalTriggered = false;
  const fsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !finalTriggered){
        finalTriggered = true;
        runFinalSurprise();
      }
    });
  }, {threshold:0.55});
  fsObserver.observe(document.getElementById('final-surprise-section'));

  function runFinalSurprise(){
    const l1 = document.getElementById('fsLine1');
    const l2 = document.getElementById('fsLine2');
    const l3 = document.getElementById('fsLine3');
    const cd = document.getElementById('countdownNum');
    const headline = document.getElementById('finalHeadline');

    const t = reduceMotion ? (ms)=>Math.min(ms,50) : (ms)=>ms;

    setTimeout(()=>l1.classList.add('in'), t(200));
    setTimeout(()=>l1.classList.remove('in'), t(1600));
    setTimeout(()=>l2.classList.add('in'), t(1900));
    setTimeout(()=>l2.classList.remove('in'), t(3400));
    setTimeout(()=>l3.classList.add('in'), t(3700));
    setTimeout(()=>l3.classList.remove('in'), t(5300));

    const nums = ['3','2','1'];
    nums.forEach((n,i)=>{
      setTimeout(()=>{
        cd.textContent = n;
        cd.classList.remove('in');
        void cd.offsetWidth;
        cd.classList.add('in');
      }, t(5700 + i*750));
    });
    setTimeout(()=>{ cd.classList.remove('in'); }, t(5700+3*750));

    setTimeout(()=>{
      flashOverlay.classList.add('flash');
      headline.classList.add('in');
      if(window.confetti){
        confetti({ particleCount:160, spread:120, startVelocity:45, origin:{y:.5},
          colors:['#cba14c','#e9cd8c','#f4ecdd','#d9a3c7'] });
        const fireworks = setInterval(()=>{
          confetti({
            particleCount: 40, spread: 70, startVelocity: 35,
            origin: { x: Math.random(), y: Math.random()*0.4 },
            colors:['#cba14c','#e9cd8c','#d9a3c7']
          });
        }, 400);
        setTimeout(()=>clearInterval(fireworks), 2400);
      }
      let hc = 0;
      const heartTimer = setInterval(()=>{ spawnHeart(); hc++; if(hc>14) clearInterval(heartTimer); }, 200);
    }, t(8100));
  }

  /* ---------------- envelope / letter ---------------- */
  document.getElementById('envelope').addEventListener('click', function(){
    this.classList.toggle('open');
  });

  /* ---------------- music player controls ---------------- */
  const mpPlayPause = document.getElementById('mpPlayPause');
  const mpMute = document.getElementById('mpMute');
  const mpBars = document.getElementById('mpBars');

  mpPlayPause.addEventListener('click', ()=>{
    if(bgMusic.paused){
      bgMusic.play().catch(()=>{});
      mpPlayPause.textContent = '❚❚';
      mpBars.classList.remove('paused');
    } else {
      bgMusic.pause();
      mpPlayPause.textContent = '▶';
      mpBars.classList.add('paused');
    }
  });
  mpMute.addEventListener('click', ()=>{
    bgMusic.muted = !bgMusic.muted;
    mpMute.textContent = bgMusic.muted ? '🔇' : '🔊';
  });

});
