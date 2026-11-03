const $=s=>document.querySelector(s);

// ── Theme toggle (runs on every page) ────────────────────────────────────────
$("#theme").onclick=()=>{
  const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme=dark?"light":"dark"};

// ── Mobile nav (runs on every page) ──────────────────────────────────────────
$("#menu").onclick=()=>$("#nav").classList.toggle("open");
$("#nav").onclick=e=>{if(e.target.tagName==="A")$("#nav").classList.remove("open")};

// ── Footer year (runs on every page) ─────────────────────────────────────────
if($("#yr"))$("#yr").textContent=new Date().getFullYear();

// ── Portfolio grid & lightbox (portfolio.html only) ───────────────────────────
if($("#grid")){
  // To add photos: put your image files in an "images/" folder next to this file,
  // then add entries below in the format:
  //   { title, category, src, alt }
  // category must be one of: Weddings, Portraits, Brand  (or add your own)
  // src is the path to the image file, e.g. "images/my-photo.jpg"
  const photos=[
    { title:"Golden hour vows",  category:"Weddings",  src:"assets/WhatsApp Image 2026-11-03 at 09.40.19.jpeg",  alt:"Couple during golden hour ceremony" },
    { title:"Studio portrait",   category:"Portraits", src:"assets/WhatsApp Image 2026-11-03 at 10.27.03.jpeg", alt:"Studio portrait session" },
    { title:"Product launch",    category:"Brand",     src:"assets/WhatsApp Image 2026-11-03 at 10.27.04.jpeg",     alt:"Brand product launch shoot" },
    { title:"First dance",       category:"Weddings",  src:"assets/IMG-20261103-WA0023.jpg",  alt:"Couple sharing their first dance" },
    { title:"Quiet morning",     category:"Portraits", src:"assets/IMG-20261103-WA0020.jpg", alt:"Candid morning portrait" },
    { title:"Team headshots",    category:"Brand",     src:"assets/IMG-20261103-WA0013.jpg",     alt:"Corporate team headshots" },
    { title:"Ceremony light",    category:"Weddings",  src:"assets/IMG-20261103-WA0022.jpg",  alt:"Wedding ceremony in natural light" },
    { title:"Family together",   category:"Portraits", src:"assets/IMG-20261103-WA0016.jpg", alt:"Family portrait session" }
  ];

  const cats=["All",...new Set(photos.map(p=>p.category))];
  let cur="All",shown=[],idx=0;

  function render(){
    $("#filters").innerHTML=cats.map(c=>`<button class="${c===cur?"on":""}" data-c="${c}">${c}</button>`).join("");
    shown=photos.filter(p=>cur==="All"||p.category===cur);
    $("#grid").innerHTML=shown.map((p,i)=>`
      <button class="tile" data-i="${i}" aria-label="${p.alt}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy">
        <span>${p.title} · ${p.category}</span>
      </button>`).join("");
  }

  $("#filters").onclick=e=>{const c=e.target.dataset.c;if(c){cur=c;render()}};
  $("#grid").onclick=e=>{const t=e.target.closest(".tile");if(t){idx=+t.dataset.i;open()}};

  function open(){
    const p=shown[idx];
    // clear previous content and show the full-size image in the lightbox
    $("#pic").innerHTML=`<img src="${p.src}" alt="${p.alt}">`;
    $("#cap").textContent=p.title+" · "+p.category;
    $("#lb").classList.add("open");
  }
  const step=d=>{idx=(idx+d+shown.length)%shown.length;open()};

  $(".lb .x").onclick=()=>$("#lb").classList.remove("open");
  $(".lb .p").onclick=()=>step(-1);$(".lb .n").onclick=()=>step(1);
  $("#lb").onclick=e=>{if(e.target.id==="lb")$("#lb").classList.remove("open")};
  addEventListener("keydown",e=>{if(!$("#lb").classList.contains("open"))return;
    if(e.key==="Escape")$("#lb").classList.remove("open");
    if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});

  render();
}

// ── Contact form (contact.html only) ─────────────────────────────────────────
if($("#form")){
  $("#form").onsubmit=e=>{
    e.preventDefault();const f=e.target,v=n=>f[n].value.trim();let ok=true;
    const set=(n,m)=>{f[n].nextElementSibling.textContent=m;if(m)ok=false};
    set("name",v("name")?"":"Please enter your name.");
    set("email",/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))?"":"Please enter a valid email.");
    set("msg",v("msg").length>=10?"":"Tell me a little more (10+ characters).");
    if(!ok)return;
    $("#ok").hidden=false;$("#ok").innerHTML=`<h3>Thank you, ${v("name").replace(/[<>&]/g,"")}!</h3><p style="color:var(--muted)">Your ${f.type.value.toLowerCase()} enquiry is in. I'll reply within 24 hours.</p>`;
    f.hidden=true};
}
