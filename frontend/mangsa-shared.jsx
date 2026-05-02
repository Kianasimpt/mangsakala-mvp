console.log("[mangsa-shared] v8 loaded - hero ornament has directional rain and wind");
// mangsa-shared.jsx — palette + per-mangsa ornament shared across Almanac, Drift, Alert.
// Each mangsa has its own color triplet (a,b,c) and a unique SVG ornament motif
// reflecting its tanda alam. Use <MangsaOrnament n={1..12}/> inside any container
// that has --m-a / --m-b / --m-c set on it (or wrapping element).

var MANGSA_THEME = {
  1:  { a: "#B56A3A", b: "#6F4B2E", c: "#F1C27D", pattern: "retak tanah, daun jatuh" },
  2:  { a: "#A87436", b: "#7A5A2B", c: "#E8B98C", pattern: "randu berbuah" },
  3:  { a: "#8D7A3D", b: "#4F5F35", c: "#D7C879", pattern: "umbi tumbuh" },
  4:  { a: "#7A8450", b: "#405738", c: "#C8D68A", pattern: "burung pulang bersarang" },
  5:  { a: "#C8553D", b: "#9C3823", c: "#F2B36D", pattern: "hujan pertama turun" },
  6:  { a: "#B2643C", b: "#6E3E28", c: "#E7A56F", pattern: "buah-buahan matang" },
  7:  { a: "#2F5D7A", b: "#1F3E56", c: "#8EC7E8", pattern: "hujan deras, banjir" },
  8:  { a: "#4C7898", b: "#2F526B", c: "#B1D7EA", pattern: "padi bunting" },
  9:  { a: "#C49A3A", b: "#836323", c: "#F0D37A", pattern: "padi menguning" },
  10: { a: "#7A8450", b: "#55623A", c: "#D9E29D", pattern: "burung bersarang" },
  11: { a: "#9B6B8F", b: "#5A3A58", c: "#E1B9D7", pattern: "lebah berkumpul" },
  12: { a: "#6B8F71", b: "#3D5D45", c: "#B8D7B7", pattern: "air mulai surut" },
};

function normalizeMangsa(n, fallback) {
  var fb = Number(fallback) || 5;
  if (n === null || n === undefined || n === "") return Math.max(1, Math.min(12, Math.round(fb)));
  var v = Number(n);
  if (!Number.isFinite(v)) v = fb;
  return Math.max(1, Math.min(12, Math.round(v)));
}

function getStoredActiveMangsa(fallback) {
  try {
    return normalizeMangsa(window.localStorage.getItem("mangsakala.activeMangsa"), fallback);
  } catch (e) {
    return normalizeMangsa(fallback, 5);
  }
}

function setStoredActiveMangsa(n) {
  var v = normalizeMangsa(n, 5);
  try {
    window.localStorage.setItem("mangsakala.activeMangsa", String(v));
  } catch (e) {}
  return v;
}

function mangsaThemeStyle(n) {
  var v = normalizeMangsa(n, 5);
  var theme = MANGSA_THEME[v] || MANGSA_THEME[5];
  return {"--m-a": theme.a, "--m-b": theme.b, "--m-c": theme.c};
}

var MANGSA_NAMES = {
  1:"Kasa", 2:"Karo", 3:"Katelu", 4:"Kapat", 5:"Kalima", 6:"Kanem",
  7:"Kapitu", 8:"Kawolu", 9:"Kasanga", 10:"Kasadasa", 11:"Desta", 12:"Sadha",
};

var MANGSA_INFO = {
  1:  { name: "Kasa",     roman: "I",    musim: "Mareng",   tanda: "Daun jatuh, tanah retak" },
  2:  { name: "Karo",     roman: "II",   musim: "Mareng",   tanda: "Pohon randu berbuah" },
  3:  { name: "Katelu",   roman: "III",  musim: "Mareng",   tanda: "Umbi mulai tumbuh" },
  4:  { name: "Kapat",    roman: "IV",   musim: "Labuh",    tanda: "Burung kembali bersarang" },
  5:  { name: "Kalima",   roman: "V",    musim: "Labuh",    tanda: "Hujan pertama turun" },
  6:  { name: "Kanem",    roman: "VI",   musim: "Labuh",    tanda: "Buah-buahan matang" },
  7:  { name: "Kapitu",   roman: "VII",  musim: "Rendheng", tanda: "Hujan deras, banjir" },
  8:  { name: "Kawolu",   roman: "VIII", musim: "Rendheng", tanda: "Padi bunting" },
  9:  { name: "Kasanga",  roman: "IX",   musim: "Rendheng", tanda: "Padi menguning" },
  10: { name: "Kasadasa", roman: "X",    musim: "Mareng",   tanda: "Burung bersarang" },
  11: { name: "Desta",    roman: "XI",   musim: "Mareng",   tanda: "Lebah berkumpul" },
  12: { name: "Sadha",    roman: "XII",  musim: "Mareng",   tanda: "Air mulai surut" },
};

// Ornament SVG library — each entry is a "scene" with elements that animate per mangsa.
// className tags below ("rain", "bird", "wave"...) are hooked to keyframes in styles.css.
var MANGSA_ORNAMENTS = {
  // 1 KASA — tanah retak + daun jatuh
  1: (
    <>
      <path className="crack c1" d="M30 60 L62 95 L48 130 L80 165 L60 200" stroke="rgba(245,230,211,0.4)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path className="crack c2" d="M280 30 L308 70 L294 105 L322 138 L308 178" stroke="rgba(245,230,211,0.36)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path className="crack c3" d="M170 100 L190 130 L175 160 L200 190" stroke="rgba(245,230,211,0.32)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path className="leaf l1" d="M50 0 q5 -10 12 0 q-5 10 -12 0z" fill="var(--m-c)" opacity="0.7"/>
      <path className="leaf l2" d="M180 0 q5 -10 12 0 q-5 10 -12 0z" fill="var(--m-c)" opacity="0.6"/>
      <path className="leaf l3" d="M290 0 q5 -10 12 0 q-5 10 -12 0z" fill="var(--m-c)" opacity="0.7"/>
    </>
  ),
  // 2 KARO — biji randu menggantung dan mengayun
  2: (
    <>
      <path d="M20 36 Q140 20 240 38" stroke="rgba(245,230,211,0.34)" strokeWidth="1" fill="none"/>
      <g className="pod p1" style={{transformOrigin: "75px 38px"}}>
        <path d="M75 38 L75 60" stroke="rgba(245,230,211,0.4)" strokeWidth="1"/>
        <ellipse cx="75" cy="72" rx="6" ry="13" fill="var(--m-c)" opacity="0.6"/>
      </g>
      <g className="pod p2" style={{transformOrigin: "118px 40px"}}>
        <path d="M118 40 L118 66" stroke="rgba(245,230,211,0.4)" strokeWidth="1"/>
        <ellipse cx="118" cy="78" rx="6" ry="13" fill="var(--m-c)" opacity="0.5"/>
      </g>
      <g className="pod p3" style={{transformOrigin: "162px 38px"}}>
        <path d="M162 38 L162 60" stroke="rgba(245,230,211,0.4)" strokeWidth="1"/>
        <ellipse cx="162" cy="72" rx="6" ry="13" fill="var(--m-c)" opacity="0.55"/>
      </g>
      <g className="pod p4" style={{transformOrigin: "210px 36px"}}>
        <path d="M210 36 L210 58" stroke="rgba(245,230,211,0.36)" strokeWidth="1"/>
        <ellipse cx="210" cy="70" rx="5" ry="11" fill="var(--m-c)" opacity="0.45"/>
      </g>
      <circle className="seed s1" cx="320" cy="180" r="3" fill="var(--m-c)" opacity="0.6"/>
      <circle className="seed s2" cx="40" cy="200" r="2" fill="var(--m-c)" opacity="0.5"/>
    </>
  ),
  // 3 KATELU — akar tumbuh + umbi membesar
  3: (
    <>
      <path className="vine" d="M180 28 Q170 80 200 110 T185 200" stroke="rgba(245,230,211,0.4)" strokeWidth="1.2" fill="none"/>
      <path className="root r1" d="M60 175 Q40 165 28 145" stroke="rgba(245,230,211,0.36)" strokeWidth="1" fill="none"/>
      <path className="root r2" d="M68 178 Q92 175 104 158" stroke="rgba(245,230,211,0.36)" strokeWidth="1" fill="none"/>
      <ellipse className="bulb b1" cx="60" cy="180" rx="14" ry="9" fill="var(--m-c)" opacity="0.55" style={{transformOrigin: "60px 180px"}}/>
      <ellipse className="bulb b2" cx="320" cy="60" rx="9" ry="6" fill="var(--m-c)" opacity="0.45" style={{transformOrigin: "320px 60px"}}/>
      <path className="root r3" d="M320 54 Q310 42 300 36" stroke="rgba(245,230,211,0.32)" strokeWidth="1" fill="none"/>
      <circle className="seed s1" cx="40" cy="40" r="3" fill="var(--m-c)" opacity="0.7"/>
    </>
  ),
  // 4 KAPAT — burung pulang melintas
  4: (
    <>
      <path className="bird b1" d="M0 50 l11 -8 l11 8" stroke="rgba(245,230,211,0.6)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path className="bird b2" d="M0 90 l9 -7 l9 7" stroke="rgba(245,230,211,0.5)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path className="bird b3" d="M0 130 l9 -7 l9 7" stroke="rgba(245,230,211,0.45)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path className="bird b4" d="M0 70 l13 -10 l13 10" stroke="rgba(245,230,211,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path className="bird b5" d="M0 160 l9 -7 l9 7" stroke="rgba(245,230,211,0.4)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <circle cx="60" cy="200" r="3" fill="var(--m-c)" opacity="0.6"/>
      <circle cx="320" cy="210" r="2" fill="var(--m-c)" opacity="0.4"/>
    </>
  ),
  // 5 KALIMA — hujan pertama (drops fall + splash)
  5: (
    <>
      <path className="rdrop d1" d="M40 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.75)"/>
      <path className="rdrop d2" d="M90 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.65)"/>
      <path className="rdrop d3" d="M140 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.7)"/>
      <path className="rdrop d4" d="M195 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.6)"/>
      <path className="rdrop d5" d="M245 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.7)"/>
      <path className="rdrop d6" d="M295 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.65)"/>
      <path className="rdrop d7" d="M340 0 q3 8 0 14 q-3 -6 0 -14z" fill="rgba(245,230,211,0.55)"/>
      <ellipse className="splash sp1" cx="55" cy="220" rx="6" ry="1.4" fill="var(--m-c)" opacity="0.75" style={{transformOrigin: "55px 220px"}}/>
      <ellipse className="splash sp2" cx="185" cy="222" rx="8" ry="1.4" fill="var(--m-c)" opacity="0.65" style={{transformOrigin: "185px 222px"}}/>
      <ellipse className="splash sp3" cx="305" cy="218" rx="6" ry="1.4" fill="var(--m-c)" opacity="0.7" style={{transformOrigin: "305px 218px"}}/>
    </>
  ),
  // 6 KANEM — buah matang (bobbing fruits)
  6: (
    <>
      <circle className="fruit f1" cx="60" cy="50" r="9" fill="var(--m-c)" opacity="0.55" style={{transformOrigin: "60px 50px"}}/>
      <path d="M60 41 Q63 35 68 38" stroke="rgba(245,230,211,0.5)" strokeWidth="1" fill="none"/>
      <circle className="fruit f2" cx="48" cy="200" r="6" fill="var(--m-c)" opacity="0.45" style={{transformOrigin: "48px 200px"}}/>
      <circle className="fruit f3" cx="320" cy="80" r="11" fill="var(--m-c)" opacity="0.5" style={{transformOrigin: "320px 80px"}}/>
      <path d="M320 69 Q323 63 328 66" stroke="rgba(245,230,211,0.5)" strokeWidth="1" fill="none"/>
      <circle className="fruit f4" cx="290" cy="180" r="5" fill="var(--m-c)" opacity="0.6" style={{transformOrigin: "290px 180px"}}/>
      <circle className="fruit f5" cx="160" cy="36" r="3" fill="var(--m-c)" opacity="0.65" style={{transformOrigin: "160px 36px"}}/>
    </>
  ),
  // 7 KAPITU — hujan deras + ombak banjir
  7: (
    <>
      <line className="hrain h1" x1="40"  y1="0" x2="18"  y2="44" stroke="rgba(245,230,211,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
      <line className="hrain h2" x1="100" y1="0" x2="78"  y2="44" stroke="rgba(245,230,211,0.5)"  strokeWidth="1.6" strokeLinecap="round"/>
      <line className="hrain h3" x1="160" y1="0" x2="138" y2="44" stroke="rgba(245,230,211,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="hrain h4" x1="220" y1="0" x2="198" y2="44" stroke="rgba(245,230,211,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
      <line className="hrain h5" x1="280" y1="0" x2="258" y2="44" stroke="rgba(245,230,211,0.46)" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="hrain h6" x1="335" y1="0" x2="313" y2="44" stroke="rgba(245,230,211,0.5)"  strokeWidth="1.5" strokeLinecap="round"/>
      <path className="flood-wave fw1" d="M-60 200 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="var(--m-c)" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path className="flood-wave fw2" d="M-60 220 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="rgba(245,230,211,0.45)" strokeWidth="1.2" fill="none"/>
    </>
  ),
  // 8 KAWOLU — bulir padi membusung
  8: (
    <>
      <g className="grain-cluster gc1" style={{transformOrigin: "58px 56px"}}>
        <ellipse cx="48" cy="50" rx="3" ry="7" fill="var(--m-c)" opacity="0.6"/>
        <ellipse cx="58" cy="56" rx="3" ry="7" fill="var(--m-c)" opacity="0.65"/>
        <ellipse cx="68" cy="50" rx="3" ry="7" fill="var(--m-c)" opacity="0.6"/>
        <ellipse cx="53" cy="68" rx="3" ry="7" fill="var(--m-c)" opacity="0.55"/>
        <ellipse cx="63" cy="68" rx="3" ry="7" fill="var(--m-c)" opacity="0.55"/>
      </g>
      <g className="grain-cluster gc2" style={{transformOrigin: "315px 184px"}}>
        <ellipse cx="305" cy="180" rx="3" ry="7" fill="var(--m-c)" opacity="0.5"/>
        <ellipse cx="315" cy="186" rx="3" ry="7" fill="var(--m-c)" opacity="0.55"/>
        <ellipse cx="325" cy="180" rx="3" ry="7" fill="var(--m-c)" opacity="0.5"/>
      </g>
      <path d="M40 38 Q72 60 70 92" stroke="rgba(245,230,211,0.36)" strokeWidth="1" fill="none"/>
      <path d="M315 168 Q288 196 290 224" stroke="rgba(245,230,211,0.36)" strokeWidth="1" fill="none"/>
      <circle className="seed-tiny" cx="200" cy="40" r="2.5" fill="var(--m-c)" opacity="0.7"/>
    </>
  ),
  // 9 KASANGA — bulir padi merunduk goyang
  9: (
    <>
      <g className="ear-stalk es1" style={{transformOrigin: "40px 28px"}}>
        <path d="M40 28 Q58 60 50 92" stroke="rgba(245,230,211,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="50" cy="92" r="2.8" fill="var(--m-c)" opacity="0.8"/>
      </g>
      <g className="ear-stalk es2" style={{transformOrigin: "70px 28px"}}>
        <path d="M70 28 Q88 64 80 100" stroke="rgba(245,230,211,0.45)" strokeWidth="1" fill="none"/>
        <circle cx="80" cy="100" r="2.8" fill="var(--m-c)" opacity="0.8"/>
      </g>
      <g className="ear-stalk es3" style={{transformOrigin: "100px 32px"}}>
        <path d="M100 32 Q116 66 108 102" stroke="rgba(245,230,211,0.4)" strokeWidth="1" fill="none"/>
        <circle cx="108" cy="102" r="2.5" fill="var(--m-c)" opacity="0.7"/>
      </g>
      <g className="ear-stalk es4" style={{transformOrigin: "278px 40px"}}>
        <path d="M278 40 Q298 72 290 108" stroke="rgba(245,230,211,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="290" cy="108" r="2.8" fill="var(--m-c)" opacity="0.8"/>
      </g>
      <g className="ear-stalk es5" style={{transformOrigin: "308px 30px"}}>
        <path d="M308 30 Q328 64 320 100" stroke="rgba(245,230,211,0.45)" strokeWidth="1" fill="none"/>
        <circle cx="320" cy="100" r="2.8" fill="var(--m-c)" opacity="0.8"/>
      </g>
      <circle cx="180" cy="200" r="3" fill="var(--m-c)" opacity="0.55"/>
    </>
  ),
  // 10 KASADASA — sarang teranyam + telur (eggs pulse, twigs sway)
  10: (
    <>
      <path className="weave w1" d="M28 175 Q60 152 92 175 Q124 198 156 175" stroke="rgba(245,230,211,0.45)" strokeWidth="1.1" fill="none"/>
      <path className="weave w2" d="M28 188 Q60 165 92 188 Q124 211 156 188" stroke="rgba(245,230,211,0.35)" strokeWidth="1" fill="none"/>
      <ellipse className="egg e1" cx="78" cy="172" rx="5" ry="4" fill="var(--m-c)" opacity="0.72" style={{transformOrigin: "78px 172px"}}/>
      <ellipse className="egg e2" cx="100" cy="172" rx="5" ry="4" fill="var(--m-c)" opacity="0.55" style={{transformOrigin: "100px 172px"}}/>
      <ellipse className="egg e3" cx="89" cy="166" rx="5" ry="4" fill="var(--m-c)" opacity="0.65" style={{transformOrigin: "89px 166px"}}/>
      <path className="bird b1" d="M0 40 l13 -10 l13 10" stroke="rgba(245,230,211,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path className="bird b2" d="M0 80 l9 -6 l9 6" stroke="rgba(245,230,211,0.4)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <circle cx="320" cy="120" r="2.5" fill="var(--m-c)" opacity="0.6"/>
    </>
  ),
  // 11 DESTA — sarang lebah + lebah zigzag
  11: (
    <>
      <polygon className="hex hx1" points="48,28 64,28 72,42 64,56 48,56 40,42" stroke="rgba(245,230,211,0.5)" strokeWidth="1" fill="rgba(255,255,255,0.04)" style={{transformOrigin: "56px 42px"}}/>
      <polygon className="hex hx2" points="72,42 88,42 96,56 88,70 72,70 64,56" stroke="rgba(245,230,211,0.4)" strokeWidth="1" fill="rgba(255,255,255,0.04)" style={{transformOrigin: "80px 56px"}}/>
      <polygon className="hex hx3" points="48,56 64,56 72,70 64,84 48,84 40,70" stroke="rgba(245,230,211,0.4)" strokeWidth="1" fill="rgba(255,255,255,0.04)" style={{transformOrigin: "56px 70px"}}/>
      <polygon className="hex hx4" points="288,176 304,176 312,190 304,204 288,204 280,190" stroke="rgba(245,230,211,0.45)" strokeWidth="1" fill="var(--m-c)" fillOpacity="0.22" style={{transformOrigin: "296px 190px"}}/>
      <polygon className="hex hx5" points="312,190 328,190 336,204 328,218 312,218 304,204" stroke="rgba(245,230,211,0.35)" strokeWidth="1" fill="rgba(255,255,255,0.04)" style={{transformOrigin: "320px 204px"}}/>
      <circle className="bee" cx="180" cy="120" r="3.5" fill="var(--m-c)" stroke="rgba(42,31,18,0.8)" strokeWidth="0.8" style={{transformOrigin: "180px 120px"}}/>
    </>
  ),
  // 12 SADHA — air mengalir (moving waves)
  12: (
    <>
      <path className="wave wv1" d="M-40 60 Q40 50 120 60 T280 60 T440 60" stroke="rgba(245,230,211,0.4)" strokeWidth="1.2" fill="none"/>
      <path className="wave wv2" d="M-40 90 Q40 80 120 90 T280 90 T440 90" stroke="rgba(245,230,211,0.5)" strokeWidth="1.2" fill="none"/>
      <path className="wave wv3" d="M-40 200 Q40 190 120 200 T280 200 T440 200" stroke="rgba(245,230,211,0.55)" strokeWidth="1.4" fill="none"/>
      <path className="wave wv4" d="M-40 220 Q40 210 120 220 T280 220 T440 220" stroke="rgba(245,230,211,0.4)" strokeWidth="1.2" fill="none"/>
      <circle className="bubble bb1" cx="60" cy="60" r="2.5" fill="var(--m-c)" opacity="0.7" style={{transformOrigin: "60px 60px"}}/>
      <circle className="bubble bb2" cx="300" cy="200" r="2.5" fill="var(--m-c)" opacity="0.7" style={{transformOrigin: "300px 200px"}}/>
      <circle className="bubble bb3" cx="180" cy="90" r="2" fill="var(--m-c)" opacity="0.6" style={{transformOrigin: "180px 90px"}}/>
    </>
  ),
};

// ---------- Hero-scale FX (Almanac hero card ~220-260px tall) ----------
// Built from absolute-positioned <i> divs because CSS transforms on raw SVG
// paths inside a `preserveAspectRatio="none"` viewport don't animate reliably
// in Chrome — drops would technically translate but stay invisible.
// Hero scenes use ~14-18px-tall elements and ranges suited for the big card.
var MANGSA_HERO_FX = {
  // 1 KASA — daun jatuh + retak berkilau
  1: (
    <>
      <i className="hfx-leaf l1"/><i className="hfx-leaf l2"/><i className="hfx-leaf l3"/>
      <i className="hfx-leaf l4"/><i className="hfx-leaf l5"/>
      <i className="hfx-crack k1"/><i className="hfx-crack k2"/><i className="hfx-crack k3"/>
      <i className="hfx-gust g1"/><i className="hfx-gust g2"/><i className="hfx-gust g3"/>
    </>
  ),
  // 2 KARO — pod menggantung berayun
  2: (
    <>
      <i className="hfx-pod p1"/><i className="hfx-pod p2"/><i className="hfx-pod p3"/>
      <i className="hfx-pod p4"/><i className="hfx-pod p5"/><i className="hfx-pod p6"/>
    </>
  ),
  // 3 KATELU — umbi membesar + tunas naik
  3: (
    <>
      <i className="hfx-bulb bu1"/><i className="hfx-bulb bu2"/>
      <i className="hfx-sprout sp1"/><i className="hfx-sprout sp2"/>
      <i className="hfx-sprout sp3"/><i className="hfx-sprout sp4"/>
      <i className="hfx-sprout sp5"/>
    </>
  ),
  // 4 KAPAT — burung melintas
  4: (
    <>
      <i className="hfx-bird b1"/><i className="hfx-bird b2"/><i className="hfx-bird b3"/>
      <i className="hfx-bird b4"/><i className="hfx-bird b5"/>
    </>
  ),
  // 5 KALIMA — hujan pertama (drops + splashes)
  5: (
    <>
      <i className="hfx-drop r1"/><i className="hfx-drop r2"/><i className="hfx-drop r3"/>
      <i className="hfx-drop r4"/><i className="hfx-drop r5"/><i className="hfx-drop r6"/>
      <i className="hfx-drop r7"/><i className="hfx-drop r8"/><i className="hfx-drop r9"/>
      <i className="hfx-drop r10"/><i className="hfx-drop r11"/><i className="hfx-drop r12"/>
      <i className="hfx-splash s1"/><i className="hfx-splash s2"/><i className="hfx-splash s3"/>
    </>
  ),
  // 6 KANEM — buah memantul
  6: (
    <>
      <i className="hfx-fruit f1"/><i className="hfx-fruit f2"/><i className="hfx-fruit f3"/>
      <i className="hfx-fruit f4"/><i className="hfx-fruit f5"/><i className="hfx-fruit f6"/>
    </>
  ),
  // 7 KAPITU — hujan deras + ombak
  7: (
    <>
      <i className="hfx-hrain hh1"/><i className="hfx-hrain hh2"/><i className="hfx-hrain hh3"/>
      <i className="hfx-hrain hh4"/><i className="hfx-hrain hh5"/><i className="hfx-hrain hh6"/>
      <i className="hfx-hrain hh7"/><i className="hfx-hrain hh8"/><i className="hfx-hrain hh9"/>
      <i className="hfx-hrain hh10"/><i className="hfx-hrain hh11"/><i className="hfx-hrain hh12"/>
      <i className="hfx-hrain hh13"/><i className="hfx-hrain hh14"/>
      <i className="hfx-flood fl1"/><i className="hfx-flood fl2"/>
    </>
  ),
  // 8 KAWOLU — bulir membusung
  8: (
    <>
      <i className="hfx-grain gr1"/><i className="hfx-grain gr2"/><i className="hfx-grain gr3"/>
      <i className="hfx-grain gr4"/><i className="hfx-grain gr5"/><i className="hfx-grain gr6"/>
      <i className="hfx-grain gr7"/>
    </>
  ),
  // 9 KASANGA — tangkai padi merunduk
  9: (
    <>
      <i className="hfx-stalk st1"/><i className="hfx-stalk st2"/><i className="hfx-stalk st3"/>
      <i className="hfx-stalk st4"/><i className="hfx-stalk st5"/><i className="hfx-stalk st6"/>
    </>
  ),
  // 10 KASADASA — telur menyala + induk burung pulang
  10: (
    <>
      <i className="hfx-egg eg1"/><i className="hfx-egg eg2"/><i className="hfx-egg eg3"/>
      <i className="hfx-egg eg4"/>
      <i className="hfx-bird-h bh1"/><i className="hfx-bird-h bh2"/>
    </>
  ),
  // 11 DESTA — sarang lebah + lebah zigzag
  11: (
    <>
      <i className="hfx-hex hx1"/><i className="hfx-hex hx2"/><i className="hfx-hex hx3"/>
      <i className="hfx-hex hx4"/><i className="hfx-hex hx5"/>
      <i className="hfx-bee be1"/><i className="hfx-bee be2"/>
    </>
  ),
  // 12 SADHA — air mengalir + gelembung
  12: (
    <>
      <i className="hfx-wave wv1"/><i className="hfx-wave wv2"/><i className="hfx-wave wv3"/>
      <i className="hfx-wave wv4"/>
      <i className="hfx-bubble bu1"/><i className="hfx-bubble bu2"/>
      <i className="hfx-bubble bu3"/><i className="hfx-bubble bu4"/>
    </>
  ),
};

function MangsaOrnament({ n }) {
  var v = Math.max(1, Math.min(12, Number(n) || 5));
  return (
    <div className={"mangsa-ornament mangsa-orn-" + v + " mh-fx mh-fx-" + v} aria-hidden="true">
      {MANGSA_HERO_FX[v]}
    </div>
  );
}

// ---------- Strip-scale mini FX ----------
// The compact MangsaActiveStrip is ~26px tall — far too small for the hero
// SVG ornament. These scenes use absolute-positioned <i> nodes whose CSS keyframes
// stay within the visible band so the motion is actually visible.
var MANGSA_STRIP_FX = {
  // 1 KASA — debu/daun terbang horizontal di lahan yang retak
  1: (
    <>
      <i className="fxk-dust d1"/><i className="fxk-dust d2"/><i className="fxk-dust d3"/>
      <i className="fxk-dust d4"/><i className="fxk-dust d5"/><i className="fxk-dust d6"/>
      <i className="fxk-crack k1"/><i className="fxk-crack k2"/>
    </>
  ),
  // 2 KARO — biji randu menggantung mengayun
  2: (
    <>
      <i className="fxr-pod p1"/><i className="fxr-pod p2"/><i className="fxr-pod p3"/>
      <i className="fxr-pod p4"/><i className="fxr-pod p5"/><i className="fxr-pod p6"/>
    </>
  ),
  // 3 KATELU — tunas naik dari bawah
  3: (
    <>
      <i className="fxt-sprout s1"/><i className="fxt-sprout s2"/><i className="fxt-sprout s3"/>
      <i className="fxt-sprout s4"/><i className="fxt-sprout s5"/><i className="fxt-sprout s6"/>
    </>
  ),
  // 4 KAPAT — burung melintas
  4: (
    <>
      <i className="fxb-bird b1"/><i className="fxb-bird b2"/><i className="fxb-bird b3"/>
      <i className="fxb-bird b4"/>
    </>
  ),
  // 5 KALIMA — hujan putih jatuh (utama)
  5: (
    <>
      <i className="fxq-drop r1"/><i className="fxq-drop r2"/><i className="fxq-drop r3"/>
      <i className="fxq-drop r4"/><i className="fxq-drop r5"/><i className="fxq-drop r6"/>
      <i className="fxq-drop r7"/><i className="fxq-drop r8"/><i className="fxq-drop r9"/>
      <i className="fxq-drop r10"/><i className="fxq-drop r11"/><i className="fxq-drop r12"/>
    </>
  ),
  // 6 KANEM — buah masak memantul
  6: (
    <>
      <i className="fxn-fruit f1"/><i className="fxn-fruit f2"/><i className="fxn-fruit f3"/>
      <i className="fxn-fruit f4"/><i className="fxn-fruit f5"/><i className="fxn-fruit f6"/>
    </>
  ),
  // 7 KAPITU — hujan deras miring
  7: (
    <>
      <i className="fxh-rain h1"/><i className="fxh-rain h2"/><i className="fxh-rain h3"/>
      <i className="fxh-rain h4"/><i className="fxh-rain h5"/><i className="fxh-rain h6"/>
      <i className="fxh-rain h7"/><i className="fxh-rain h8"/><i className="fxh-rain h9"/>
      <i className="fxh-rain h10"/><i className="fxh-rain h11"/><i className="fxh-rain h12"/>
      <i className="fxh-rain h13"/><i className="fxh-rain h14"/>
    </>
  ),
  // 8 KAWOLU — bulir padi membusung
  8: (
    <>
      <i className="fxw-grain g1"/><i className="fxw-grain g2"/><i className="fxw-grain g3"/>
      <i className="fxw-grain g4"/><i className="fxw-grain g5"/><i className="fxw-grain g6"/>
      <i className="fxw-grain g7"/>
    </>
  ),
  // 9 KASANGA — tangkai padi merunduk goyang
  9: (
    <>
      <i className="fxg-stalk s1"/><i className="fxg-stalk s2"/><i className="fxg-stalk s3"/>
      <i className="fxg-stalk s4"/><i className="fxg-stalk s5"/><i className="fxg-stalk s6"/>
    </>
  ),
  // 10 KASADASA — sarang telur berdenyut + burung pulang
  10: (
    <>
      <i className="fxs-egg e1"/><i className="fxs-egg e2"/><i className="fxs-egg e3"/>
      <i className="fxs-egg e4"/>
      <i className="fxs-bird b1"/><i className="fxs-bird b2"/>
    </>
  ),
  // 11 DESTA — lebah zigzag + sel sarang berdenyut
  11: (
    <>
      <i className="fxd-cell c1"/><i className="fxd-cell c2"/><i className="fxd-cell c3"/>
      <i className="fxd-cell c4"/>
      <i className="fxd-bee b1"/><i className="fxd-bee b2"/>
    </>
  ),
  // 12 SADHA — air mengalir + gelembung naik
  12: (
    <>
      <i className="fxa-wave w1"/><i className="fxa-wave w2"/><i className="fxa-wave w3"/>
      <i className="fxa-bubble bb1"/><i className="fxa-bubble bb2"/><i className="fxa-bubble bb3"/>
      <i className="fxa-bubble bb4"/>
    </>
  ),
};

function MangsaStripFX({ n }) {
  var v = Math.max(1, Math.min(12, Number(n) || 5));
  return (
    <div className={"ms-fx ms-fx-" + v} aria-hidden="true">
      {MANGSA_STRIP_FX[v]}
    </div>
  );
}

/* MangsaActiveStrip — compact themed banner showing the active mangsa.
   Drop this anywhere; pass n (1..12) and optional label. The card recolors and
   swaps ornament motif as n changes. */
function MangsaActiveStrip({ n, label }) {
  var v = Math.max(1, Math.min(12, Number(n) || 5));
  var theme = MANGSA_THEME[v];
  var info = MANGSA_INFO[v];
  return (
    <div
      className={"mangsa-strip mangsa-strip-" + v}
      style={{"--m-a": theme.a, "--m-b": theme.b, "--m-c": theme.c}}
    >
      <MangsaStripFX n={v}/>
      <div className="ms-row">
        <span className="ms-live"/>
        <span className="ms-name">{info.name}</span>
        <span className="ms-pill">{info.roman} · {info.musim}</span>
        <span className="ms-tanda">{info.tanda}</span>
      </div>
    </div>
  );
}
