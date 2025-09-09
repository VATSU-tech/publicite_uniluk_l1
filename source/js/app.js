
  // ===== UTIL =====
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // ===== SNOW =====
  const snow = (()=>{
    const canvas = document.getElementById('snow');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth;
    let H = canvas.height = innerHeight;
    let flakes = [];
    const baseCount = Math.min(220, Math.max(100, Math.floor(W*H/25000)));

    function reset(){
      W = canvas.width = innerWidth; H = canvas.height = innerHeight;
      const count = Math.floor(baseCount * (eco()? .35 : 1));
      flakes = new Array(count).fill(0).map(()=>({
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random()*2.2+0.6,
        v: Math.random()*0.6+0.2,
        w: Math.random()*0.7+0.1,
        o: Math.random()*0.5+0.3
      }));
    }

    function eco(){return document.getElementById('eco').checked}

    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = 'lighter';
      for(const f of flakes){
        f.y += f.v * (eco()? .6 : 1);
        f.x += Math.sin(f.y*0.02)*f.w;
        if(f.y>H+10){f.y=-10; f.x=Math.random()*W}
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = '#bff7ff';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    addEventListener('resize', reset);
    document.getElementById('eco').addEventListener('change', reset);
    reset(); draw();
  })();

  // ===== STATS COUNTERS =====
  const animCounter = (el, to, dur=1600)=>{
    let t0 = performance.now();
    const from = 0; const ease = x=>1-Math.pow(1-x,3);
    const step = (now)=>{
      const p = Math.min(1, (now-t0)/dur);
      el.textContent = (to>=10 ? '+' : '') + Math.floor(from + (to-from)*ease(p)).toLocaleString('fr-FR');
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  addEventListener('load', ()=>{
    animCounter(qs('#stat-1'), 120);
    animCounter(qs('#stat-2'), 2, 1000);
    animCounter(qs('#stat-3'), 35, 1400);
    qs('#year').textContent = new Date().getFullYear();
  });

  // ===== ECO MODE (reduce heavy layers) =====
  const ecoBox = document.getElementById('eco');
  ecoBox.addEventListener('change',()=>{
    document.body.style.setProperty('--glass', ecoBox.checked ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.08)');
    document.querySelector('.waves').style.display = ecoBox.checked ? 'none' : 'block';
    document.querySelector('.pcb').style.opacity = ecoBox.checked ? .45 : .8;
  });

  // ===== SMOOTH SCROLL =====
  qsa('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
   }); 