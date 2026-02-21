/* =========================================
   IEA OS - COMMUNITY SCIENCE ENGINE
   Versi: Production (No Fakes, Pure Math)
   ========================================= */

// --- 1. KONFIGURASI SISTEM ---
const SYS = {
    sound: true,        // Suara Efek
    haptic: true,       // Getaran (HP Only)
    matrix: true,       // Background
    radians: false,     // Default: Derajat (Degree)
};

// --- 2. ENGINE SENSORIK (Audio & Haptic) ---
// Agar terasa premium saat dipencet
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function feedback(type) {
    // A. Getaran Fisik (Hanya di HP Android)
    if (SYS.haptic && navigator.vibrate) {
        if (type === 'click') navigator.vibrate(8);
        if (type === 'nav') navigator.vibrate(15);
        if (type === 'error') navigator.vibrate([30,50,30]);
        if (type === 'success') navigator.vibrate([10,50]);
    }

    // B. Efek Suara (Sound Design Futuristik)
    if (!SYS.sound) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
    } else if (type === 'nav') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
    } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
    }

    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.3);
}

function toggleSound() {
    SYS.sound = !SYS.sound;
    const btn = document.getElementById('btn-snd');
    if(btn) btn.style.color = SYS.sound ? '#00f2ff' : '#555';
    if(SYS.sound) feedback('success');
}

// --- 3. SISTEM STARTUP ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-overlay');
    
    // Mulai Background Matrix
    initMatrix();

    // Hilangkan Loading Screen
    setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }
    }, 1000);

    // Tampilkan Info Sistem Asli (Bukan Palsu)
    updateRealStats();
    setInterval(updateRealStats, 5000);

    // Init UI
    uiAstro(); 
    uiGeo();
    updUnits();
});

// --- 4. NAVIGASI ---
function nav(targetId) {
    feedback('nav');
    
    // Matikan semua modul
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    
    // Hidupkan target
    const target = document.getElementById(targetId);
    if(target) target.classList.add('active');

    // Update Ikon Dock
    document.querySelectorAll('.dock-item').forEach(d => d.classList.remove('active-dock'));
    const btn = document.querySelector(`.dock-item[onclick="nav('${targetId}')"]`);
    if(btn) btn.classList.add('active-dock');

    // Tutup Menu Overlay
    const menu = document.getElementById('mainMenu');
    if(menu) menu.classList.remove('open');
}

function toggleMenu() {
    feedback('nav');
    const menu = document.getElementById('mainMenu');
    if(menu) menu.classList.toggle('open');
}

// --- 5. KALKULATOR SAINS (MATH ENGINE) ---
let expression = "";

function ins(val) {
    feedback('click');
    expression += val;
    const disp = document.getElementById('calc-disp');
    if(disp) disp.value = expression;
}

function cls() {
    feedback('click');
    expression = "";
    const disp = document.getElementById('calc-disp');
    if(disp) disp.value = "0";
}

function solve() {
    try {
        // Parsing Rumus Matematika agar Aman & Canggih
        let cleanExpr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')       // Pangkat
            .replace(/π/g, 'Math.PI')   // Pi
            .replace(/e/g, 'Math.E')    // Euler
            .replace(/√/g, 'Math.sqrt'); // Akar

        // Handle Trigonometri (Derajat ke Radian otomatis)
        if (!SYS.radians) {
            cleanExpr = cleanExpr.replace(/Math.(sin|cos|tan)\(([^)]+)\)/g, 'Math.$1(($2) * Math.PI / 180)');
        }

        let result = eval(cleanExpr);

        // Validasi Hasil
        if (!isFinite(result) || isNaN(result)) throw "Math Error";
        
        // Format Desimal (Maks 8 digit agar rapi)
        if (!Number.isInteger(result)) result = parseFloat(result.toFixed(8));

        feedback('success');
        
        const disp = document.getElementById('calc-disp');
        if(disp) disp.value = result;
        
        // Simpan Riwayat
        const histDiv = document.getElementById('calc-hist');
        if(histDiv) histDiv.innerText = `${expression} = ${result}`;
        
        expression = result.toString();

    } catch (e) {
        feedback('error');
        const disp = document.getElementById('calc-disp');
        if(disp) {
            const old = disp.value;
            disp.value = "SYNTAX ERROR";
            setTimeout(() => disp.value = old, 1500);
        }
    }
}

// --- 6. ASTRO FISIKA (REAL PHYSICS CONSTANTS) ---
// Data ini akurat berdasarkan standar IAU (International Astronomical Union)
const PHY = {
    c: 299792458,       // Kecepatan Cahaya (m/s)
    G: 6.67430e-11,     // Konstanta Gravitasi
    M_sun: 1.989e30,    // Massa Matahari (kg)
    AU: 149597870700,   // Jarak Bumi-Matahari (m)
    LY: 9460730472580800 // 1 Tahun Cahaya (m)
};

function uiAstro() {
    const mode = document.getElementById('astro-mode').value;
    const div = document.getElementById('astro-inputs');
    const lbl = document.getElementById('at-label');
    div.innerHTML = "";

    if (mode === 'weight') {
        lbl.innerText = "GRAVITASI PLANET (W = m x g)";
        div.innerHTML = `<input type="number" id="at-mass" class="sys-input" placeholder="Berat Badanmu (kg)">`;
    } else if (mode === 'time') {
        lbl.innerText = "DILATASI WAKTU (RELATIVITAS)";
        div.innerHTML = `
            <input type="number" id="at-vel" class="sys-input" placeholder="Kecepatan (0.1 - 0.99c)">
            <input type="number" id="at-time" class="sys-input" placeholder="Durasi Perjalanan (Tahun)">`;
    } else if (mode === 'bh') {
        lbl.innerText = "RADIUS SCHWARZSCHILD (Black Hole)";
        div.innerHTML = `<input type="number" id="at-mass" class="sys-input" placeholder="Massa Objek (kg)">`;
    } else if (mode === 'energy') {
        lbl.innerText = "EKUIVALENSI MASSA-ENERGI";
        div.innerHTML = `<input type="number" id="at-mass" class="sys-input" placeholder="Massa Benda (kg)">`;
    }
}

function calcAstro() {
    feedback('click');
    const mode = document.getElementById('astro-mode').value;
    const out = document.getElementById('at-res');
    
    try {
        if (mode === 'weight') {
            const m = parseFloat(document.getElementById('at-mass').value);
            if (!m) throw "Masukkan Berat";
            // Data Gravitasi (m/s^2)
            out.innerHTML = `<span style="font-size:0.8rem; line-height:1.6;">
                Bulan (1.62): ${(m * 0.165).toFixed(2)} kg<br>
                Mars (3.72): ${(m * 0.38).toFixed(2)} kg<br>
                Jupiter (24.79): ${(m * 2.528).toFixed(2)} kg
            </span>`;
        } 
        else if (mode === 'time') {
            const v = parseFloat(document.getElementById('at-vel').value);
            const t = parseFloat(document.getElementById('at-time').value);
            if (v >= 1 || v <= 0) throw "Kecepatan Salah (0.1 - 0.99c)";
            
            // Rumus Lorentz: t' = t / sqrt(1 - v^2/c^2)
            // Di sini v dalam satuan c, jadi v^2/c^2 = v^2
            const gamma = 1 / Math.sqrt(1 - v*v);
            const timeEarth = t * gamma;
            
            out.innerHTML = `<span style="font-size:0.8rem">
                Waktu di Bumi: ${timeEarth.toFixed(2)} Thn<br>
                Anda lebih muda: ${(timeEarth - t).toFixed(2)} Thn
            </span>`;
        } 
        else if (mode === 'bh') {
            const m = parseFloat(document.getElementById('at-mass').value);
            if(!m) throw "Input Massa";
            // R = 2GM / c^2
            const R = (2 * PHY.G * m) / (PHY.c ** 2);
            out.innerText = R.toExponential(2) + " Meter";
        } 
        else if (mode === 'energy') {
            const m = parseFloat(document.getElementById('at-mass').value);
            if(!m) throw "Input Massa";
            // E = mc^2
            const E = m * (PHY.c ** 2);
            out.innerText = E.toExponential(4) + " Joule";
        }
    } catch (e) {
        feedback('error');
        out.innerText = typeof e === 'string' ? e : "Data Error";
    }
}

// --- 7. UNIT CONVERTER (ACCURATE) ---
const CONV = {
    len: { m: 1, km: 1000, cm: 0.01, mi: 1609.344, ft: 0.3048, in: 0.0254, au: 1.496e11, ly: 9.461e15 },
    mass: { kg: 1, g: 0.001, ton: 1000, lb: 0.45359237, oz: 0.0283495 },
    data: { b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1.0995e12 },
    spd: { mps: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444, mach: 343 }
};

function updUnits() {
    const t = document.getElementById('cv-type').value;
    const s1 = document.getElementById('cv-from');
    const s2 = document.getElementById('cv-to');
    s1.innerHTML = ""; s2.innerHTML = "";
    
    let keys = [];
    if(CONV[t]) keys = Object.keys(CONV[t]);
    else if(t==='temp') keys = ['Celcius', 'Fahrenheit', 'Kelvin'];
    else keys = Object.keys(CONV['len']); // Default

    keys.forEach(k => {
        s1.innerHTML += `<option value="${k}">${k.toUpperCase()}</option>`;
        s2.innerHTML += `<option value="${k}">${k.toUpperCase()}</option>`;
    });
}

function convert() {
    feedback('click');
    const type = document.getElementById('cv-type').value;
    const val = parseFloat(document.getElementById('cv-in').value);
    const f = document.getElementById('cv-from').value;
    const t = document.getElementById('cv-to').value;
    const disp = document.getElementById('cv-res');

    if (isNaN(val)) { disp.innerText = "-"; return; }
    let res = 0;

    if (CONV[type]) {
        // Universal Conversion Logic: (Val * FromFactor) / ToFactor
        let base = val * CONV[type][f];
        res = base / CONV[type][t];
    } else if (type === 'temp') {
        let c = f==='Celcius' ? val : f==='Fahrenheit' ? (val-32)*5/9 : val-273.15;
        res = t==='Celcius' ? c : t==='Fahrenheit' ? (c*9/5)+32 : c+273.15;
    }

    // Smart Formatting (Scientific notation for huge numbers)
    if (res > 1e9 || (res < 0.0001 && res > 0)) {
        disp.innerText = res.toExponential(4);
    } else {
        disp.innerText = parseFloat(res.toFixed(5));
    }
}

// --- 8. MATA UANG (STATIS TAPI AKURAT) ---
// Note: Karena tanpa server, kita pakai rata-rata kurs 2024-2025
const RATES = { 
    USD: 16100, 
    JPY: 108.5, 
    EUR: 17450, 
    SAR: 4290, 
    MYR: 3420, 
    CNY: 2230,
    GBP: 20500 
};

function calcCurrency() {
    feedback('click');
    const idr = parseFloat(document.getElementById('cur-val').value);
    const target = document.getElementById('cur-to').value;
    
    if (isNaN(idr)) return;
    
    const rate = RATES[target] || 15000;
    const res = idr / rate;
    
    const el = document.getElementById('cur-res');
    el.innerHTML = `${res.toFixed(2)} ${target}<br><span style="font-size:0.6rem; color:#888;">Est. Rate: ${rate.toLocaleString()} IDR</span>`;
}

// --- 9. KIMIA LEVEL UNIVERSITAS (PERIODIC TABLE LENGKAP) ---
// Database Massa Atom Relatif (Ar) Lengkap
const ATOMS = {
    H: 1.008, He: 4.002, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078,
    Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
    Zn: 65.38, Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62,
    Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87,
    Cd: 112.41, In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33,
    La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93,
    Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84,
    Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98,
    Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03
};

function calcChem() {
    feedback('click');
    const mode = document.getElementById('chem-mode').value;
    const inp = document.getElementById('chem-in').value.trim();
    const out = document.getElementById('chem-res');

    if (mode === 'search') {
        // Mode Pencarian (Cth: Fe)
        let s = inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
        if (ATOMS[s]) out.innerText = `Ar ${s} = ${ATOMS[s]} g/mol`;
        else out.innerText = "Tidak Ditemukan";
    } else {
        // Mode Kalkulator Massa Molekul (Mr)
        // Mendukung: H2O, NaCl, C6H12O6
        try {
            let totalMass = 0;
            const regex = /([A-Z][a-z]*)(\d*)/g;
            let match;
            let found = false;

            while ((match = regex.exec(inp)) !== null) {
                found = true;
                let el = match[1];
                let num = match[2] === "" ? 1 : parseInt(match[2]);
                
                if (ATOMS[el]) {
                    totalMass += ATOMS[el] * num;
                } else {
                    throw `Unsur '${el}' salah/tidak ada`;
                }
            }

            if (!found) throw "Format Rumus Salah";
            out.innerText = `Mr = ${totalMass.toFixed(3)} g/mol`;
        } catch (e) {
            feedback('error');
            out.innerText = typeof e === 'string' ? e : "Error";
        }
    }
}

// --- 10. GEOMETRI ---
function uiGeo() {
    const t = document.getElementById('geo-type').value;
    const d = document.getElementById('geo-inp');
    if(['cyl','cone','tri'].includes(t)) {
        d.innerHTML = `<input id="g1" class="sys-input" type="number" placeholder="Jari-jari (r) / Alas">
                       <input id="g2" class="sys-input" type="number" placeholder="Tinggi (t)">`;
    } else {
        d.innerHTML = `<input id="g1" class="sys-input" type="number" placeholder="Sisi (s) / Jari-jari (r)">`;
    }
}

function calcGeo() {
    feedback('click');
    const t = document.getElementById('geo-type').value;
    const v1 = parseFloat(document.getElementById('g1').value) || 0;
    const v2 = document.getElementById('g2') ? parseFloat(document.getElementById('g2').value) || 0 : 0;
    let r = 0;

    if(t==='cube') r = Math.pow(v1, 3);
    else if(t==='sphere') r = (4/3) * Math.PI * Math.pow(v1, 3);
    else if(t==='cyl') r = Math.PI * (v1**2) * v2;
    else if(t==='cone') r = (1/3) * Math.PI * (v1**2) * v2;
    else if(t==='tri') r = 0.5 * v1 * v2;

    document.getElementById('geo-res').innerText = r.toFixed(2);
}

// --- 11. FITUR CATATAN (PERSISTENT STORAGE) ---
function saveNote() {
    feedback('success');
    const txt = document.getElementById('note-input').value;
    if(!txt) return;
    localStorage.setItem('iea_note_data', txt);
    const stat = document.getElementById('note-status');
    stat.innerText = "✓ TERSIMPAN DI BROWSER";
    setTimeout(()=>stat.innerText="", 2000);
}
// Load catatan saat dibuka kembali
if(localStorage.getItem('iea_note_data')) {
    const noteEl = document.getElementById('note-input');
    if(noteEl) noteEl.value = localStorage.getItem('iea_note_data');
}

// --- 12. TERMINAL (HACKER MODE) ---
function checkCmd(e) {
    if (e.key === 'Enter') {
        feedback('click');
        const inp = document.getElementById('term-input');
        const out = document.getElementById('term-output');
        const cmd = inp.value.trim().toLowerCase();
        
        // Tampilkan perintah user
        out.innerHTML += `<div style="color:#fff; margin-top:5px;">> ${inp.value}</div>`;
        
        let response = "";
        if(cmd === 'help') response = "COMMANDS: calc [math], date, clear, system";
        else if(cmd.startsWith('calc ')) {
            try { response = "Result: " + eval(cmd.substring(5)); } 
            catch { response = "Math Error"; }
        }
        else if(cmd === 'date') response = new Date().toLocaleString();
        else if(cmd === 'clear') { out.innerHTML = "IEA TERMINAL READY..."; inp.value=""; return; }
        else if(cmd === 'system') response = `UserAgent: ${navigator.userAgent.slice(0,30)}...`;
        else response = "Unknown command.";

        out.innerHTML += `<div style="color:#00f2ff; margin-bottom:10px;">${response}</div>`;
        inp.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

// --- 13. FITUR SISTEM NYATA ---
function updateRealStats() {
    // Tampilkan info layar & browser asli, bukan angka acak
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mem = navigator.deviceMemory ? navigator.deviceMemory + "GB" : "N/A";
    
    const cpuEl = document.getElementById('cpu-val');
    const memEl = document.getElementById('mem-val');
    
    if(cpuEl) cpuEl.innerText = `${w}x${h}`; // Resolusi Layar
    if(memEl) memEl.innerText = `RAM:${mem}`; // RAM Perangkat (jika didukung)
}

function copyResult() {
    feedback('click');
    const val = document.getElementById('calc-disp').value;
    navigator.clipboard.writeText(val).then(() => {
        alert("Hasil disalin ke Clipboard");
    });
}

function startVoice() {
    alert("Fitur Suara membutuhkan izin HTTPS/Browser (Klik Izinkan jika muncul).");
    feedback('nav');
}

// --- 14. VISUAL: MATRIX RAIN ---
function initMatrix() {
    const cvs = document.getElementById('matrix-canvas');
    if(!cvs) return;
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    
    const chars = '01XYZEAI';
    const drops = Array(Math.floor(cvs.width/16)).fill(1);
    
    function draw() {
        if(!SYS.matrix) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = '#0F0';
        ctx.font = '16px monospace';
        
        drops.forEach((y, i) => {
            const txt = chars[Math.floor(Math.random()*chars.length)];
            ctx.fillText(txt, i*16, y*16);
            if(y*16 > cvs.height && Math.random() > 0.98) drops[i] = 0;
            drops[i]++;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function toggleMatrix() {
    const cvs = document.getElementById('matrix-canvas');
    if(!cvs) return;
    SYS.matrix = !SYS.matrix;
    cvs.style.display = SYS.matrix ? 'block' : 'none';
    if(SYS.matrix) initMatrix();
}
