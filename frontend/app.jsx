const { useState } = React;

// 12 Pranata Mangsa — traditional Javanese agricultural calendar
const MANGSA = [
  { n: 1,  name: "Kasa",      tradisional: "22 Jun – 1 Agu",  adaptif: "18 Jun – 28 Jul",  geser: -4,  musim: "Mareng",   tanda: "Daun jatuh, tanah retak" },
  { n: 2,  name: "Karo",      tradisional: "2 Agu – 24 Agu",  adaptif: "29 Jul – 21 Agu",  geser: -3,  musim: "Mareng",   tanda: "Pohon randu berbuah" },
  { n: 3,  name: "Katelu",    tradisional: "25 Agu – 17 Sep", adaptif: "22 Agu – 13 Sep",  geser: -4,  musim: "Mareng",   tanda: "Umbi mulai tumbuh" },
  { n: 4,  name: "Kapat",     tradisional: "18 Sep – 12 Okt", adaptif: "14 Sep – 9 Okt",   geser: -4,  musim: "Labuh",    tanda: "Burung kembali bersarang" },
  { n: 5,  name: "Kalima",    tradisional: "13 Okt – 8 Nov",  adaptif: "10 Okt – 4 Nov",   geser: -4,  musim: "Labuh",    tanda: "Hujan pertama turun" },
  { n: 6,  name: "Kanem",     tradisional: "9 Nov – 21 Des",  adaptif: "5 Nov – 16 Des",   geser: -5,  musim: "Labuh",    tanda: "Buah-buahan matang" },
  { n: 7,  name: "Kapitu",    tradisional: "22 Des – 2 Feb",  adaptif: "17 Des – 28 Jan",  geser: -5,  musim: "Rendheng", tanda: "Hujan deras, banjir" },
  { n: 8,  name: "Kawolu",    tradisional: "3 Feb – 28 Feb",  adaptif: "29 Jan – 23 Feb",  geser: -5,  musim: "Rendheng", tanda: "Padi bunting, ulat muncul" },
  { n: 9,  name: "Kasanga",   tradisional: "1 Mar – 25 Mar",  adaptif: "24 Feb – 20 Mar",  geser: -5,  musim: "Rendheng", tanda: "Padi menguning, jangkrik" },
  { n: 10, name: "Kasadasa",  tradisional: "26 Mar – 18 Apr", adaptif: "21 Mar – 13 Apr",  geser: -5,  musim: "Mareng",   tanda: "Burung membuat sarang" },
  { n: 11, name: "Desta",     tradisional: "19 Apr – 11 Mei", adaptif: "14 Apr – 6 Mei",   geser: -5,  musim: "Mareng",   tanda: "Lebah berkumpul" },
  { n: 12, name: "Sadha",     tradisional: "12 Mei – 21 Jun", adaptif: "7 Mei – 17 Jun",   geser: -5,  musim: "Mareng",   tanda: "Air mulai surut" },
];

const ACTIVE_MANGSA = 5; // Kalima — early rains, planting window

const REGIONS = [
  "Sleman, DIY",
  "Klaten, Jateng",
  "Bantul, DIY",
  "Magelang, Jateng",
  "Karanganyar, Jateng",
  "Boyolali, Jateng",
];

function Header({ region, setRegion, regionOpen, setRegionOpen }) {
  return (
    <div className="header">
      <div className="header-row">
        <div className="brand">
          <div className="brand-mark">
            {/* simple rice-grain mark */}
            <svg viewBox="0 0 32 32" width="28" height="28">
              <ellipse cx="16" cy="10" rx="4.5" ry="7" fill="#F5E6D3"/>
              <ellipse cx="11" cy="18" rx="4.5" ry="7" transform="rotate(-25 11 18)" fill="#F5E6D3" opacity="0.85"/>
              <ellipse cx="21" cy="18" rx="4.5" ry="7" transform="rotate(25 21 18)" fill="#F5E6D3" opacity="0.85"/>
              <path d="M16 24 L16 30" stroke="#F5E6D3" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">Mangsakala</div>
            <div className="brand-sub">Pranata Mangsa Adaptif</div>
          </div>
        </div>
        <button className="bell" aria-label="Notifikasi">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F5E6D3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="bell-dot"/>
        </button>
      </div>

      <button className="region-pill" onClick={() => setRegionOpen(!regionOpen)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3E2F1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="region-label">Wilayah</span>
        <span className="region-value">{region}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3E2F1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform: regionOpen ? "rotate(180deg)" : "none", transition: "transform .2s"}}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {regionOpen && (
        <div className="region-menu">
          {REGIONS.map(r => (
            <button
              key={r}
              className={"region-item " + (r === region ? "is-active" : "")}
              onClick={() => { setRegion(r); setRegionOpen(false); }}
            >
              <span>{r}</span>
              {r === region && (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C8553D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroCard() {
  return (
    <div className="hero-card">
      <div className="hero-top">
        <div className="hero-icon">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#F5E6D3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="6" width="24" height="22" rx="2.5"/>
            <path d="M4 12h24"/>
            <path d="M10 3v6M22 3v6"/>
            <circle cx="11" cy="18" r="1.2" fill="#F5E6D3"/>
            <circle cx="16" cy="18" r="1.2" fill="#F5E6D3"/>
            <circle cx="21" cy="18" r="1.2" fill="#F5E6D3"/>
            <circle cx="11" cy="23" r="1.2" fill="#F5E6D3"/>
            <circle cx="16" cy="23" r="1.2" fill="#F5E6D3"/>
          </svg>
        </div>
        <div className="hero-titles">
          <div className="hero-eyebrow">Rekomendasi untuk Anda</div>
          <div className="hero-title">Jendela Tanam Padi</div>
        </div>
        <div className="confidence">
          <span className="conf-dot"/>
          <span className="conf-label">Tinggi</span>
        </div>
      </div>

      <div className="hero-dates">
        <div className="date-block">
          <div className="date-mini">Mulai</div>
          <div className="date-day">28</div>
          <div className="date-mo">Oktober</div>
        </div>
        <div className="hero-arrow">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#F5E6D3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </div>
        <div className="date-block">
          <div className="date-mini">Sampai</div>
          <div className="date-day">14</div>
          <div className="date-mo">November</div>
        </div>
      </div>

      <div className="hero-foot">
        <div className="foot-stat">
          <div className="foot-num">18</div>
          <div className="foot-lbl">hari</div>
        </div>
        <div className="foot-divider"/>
        <div className="foot-text">
          Curah hujan stabil, tanah lembab.
          <br/>Cocok semai benih varietas Ciherang.
        </div>
      </div>
    </div>
  );
}

function MangsaCard({ m, isActive }) {
  const geserText = m.geser === 0 ? "tepat" : `${m.geser > 0 ? "+" : ""}${m.geser} hari`;
  return (
    <div className={"mc " + (isActive ? "mc-active" : "")}>
      {isActive && <div className="mc-now">DETIK INI</div>}
      <div className="mc-top">
        <div className="mc-num">{romanize(m.n)}</div>
        <div className="mc-musim">{m.musim}</div>
      </div>
      <div className="mc-name">{m.name}</div>
      <div className="mc-rows">
        <div className="mc-row">
          <div className="mc-row-lbl">Tradisional</div>
          <div className="mc-row-val">{m.tradisional}</div>
        </div>
        <div className="mc-row">
          <div className="mc-row-lbl">Adaptif</div>
          <div className="mc-row-val mc-row-val--em">{m.adaptif}</div>
        </div>
      </div>
      <div className="mc-shift">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>{geserText}</span>
      </div>
    </div>
  );
}

function romanize(n) {
  const map = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  return map[n - 1];
}

function App() {
  const [region, setRegion] = useState("Sleman, DIY");
  const [regionOpen, setRegionOpen] = useState(false);

  return (
    <div className="screen">
      <Header region={region} setRegion={setRegion} regionOpen={regionOpen} setRegionOpen={setRegionOpen} />

      <div className="body">
        <HeroCard />

        <div className="section-head">
          <div className="section-title">12 Mangsa Tahun Ini</div>
          <div className="section-sub">Ketuk untuk detail tanda alam</div>
        </div>

        <div className="grid">
          {MANGSA.map(m => (
            <MangsaCard key={m.n} m={m} isActive={m.n === ACTIVE_MANGSA} />
          ))}
        </div>

        <div className="legend">
          <div className="legend-row">
            <span className="legend-sw legend-sw--trad"/>
            <span>Tanggal warisan, tetap dari leluhur</span>
          </div>
          <div className="legend-row">
            <span className="legend-sw legend-sw--ada"/>
            <span>Tanggal adaptif, sesuai iklim kini</span>
          </div>
        </div>

        <div className="footer-spacer"/>
      </div>

      <div className="tabbar">
        <button className="tab tab-active">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span>Mangsa</span>
        </button>
        <button className="tab">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22a10 10 0 0 1 20 0"/>
            <path d="M12 2v6M8 6l4-4 4 4"/>
            <path d="M5 14c2-2 5-2 7 0s5 2 7 0"/>
          </svg>
          <span>Sawah</span>
        </button>
        <button className="tab">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
            <circle cx="10" cy="7" r="4"/>
            <path d="M21 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Tetangga</span>
        </button>
        <button className="tab">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 2"/>
          </svg>
          <span>Saya</span>
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
