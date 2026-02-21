/* ================================================
   OTAK UTAMA PORTAL IEA (FINAL VERSION)
   ================================================
   File ini mengatur semua logika, animasi, suara,
   dan fitur canggih lainnya.
*/

// --- KONFIGURASI & ERROR HANDLING ---
// Gunakan config.js untuk API configuration
const SYSTEM_CONFIG = {
    nasa_api: 'https://api.nasa.gov/planetary/apod',
    nasa_key: 'DEMO_KEY'
};

// --- BAGIAN 1: VARIABEL PENTING ---
let isChecked = false;      // Status checkbox persetujuan
let soundEnabled = true;    // Status suara (Boleh bunyi atau nggak)
let isMusicPlaying = false; // Status musik latar
let audioCtx, oscillator, gainNode; // Alat musik digital (Synthesizer)

// --- BAGIAN 2: SAAT WEBSITE PERTAMA DIBUKA ---
window.addEventListener('DOMContentLoaded', () => {
    // Track page view
    if (window.Analytics) {
        window.Analytics.trackPageView();
    }
    
    // 1. Cek Tema (Gelap/Terang) yang tersimpan
    const savedTheme = localStorage.getItem('iea_theme');
    if(savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Update tombol switch di pengaturan kalau ada
        const themeToggle = document.getElementById('toggle-theme');
        if(themeToggle) themeToggle.checked = (savedTheme === 'light');
    }

    // 2. Cek Nama Peneliti
    const savedName = localStorage.getItem('iea_user_name');
    if(savedName) {
        const nameEl = document.getElementById('user-display-name');
        if(nameEl) nameEl.innerText = savedName;
    }

    // 3. Cek Pengaturan Lainnya (Suara, Grafik, Animasi)
    loadSettings();

    // 4. Ambil Gambar NASA & Animasi Awal
    fetchNASAData();
    initStaggeredAnimation();

    // 5. Sambutan Selamat Datang
    setTimeout(() => {
        showToast("Sistem IEA Berhasil Dimuat");
        showToast("Enkripsi Data: AKTIF");
    }, 3000);
});

// --- BAGIAN 3: LAYAR SAMBUTAN (PROTOCOL) ---
function toggleCheck() {
    const check = document.getElementById('proto-check');
    const btn = document.getElementById('btn-init');
    isChecked = !isChecked;
    
    // Kalau dicentang, tombol jadi aktif
    if(isChecked) {
        check.classList.add('checked');
        btn.classList.add('active');
        btn.innerText = "LANJUT MASUK";
        vibrate(); // Getar dikit
    } else {
        check.classList.remove('checked');
        btn.classList.remove('active');
        btn.innerText = "TUNGGU PERSETUJUAN";
    }
}

function initializeSystem() {
    if(!isChecked) return; // Kalau belum centang, gak bisa masuk
    
    // Hilangkan layar protocol
    document.getElementById('protocol-screen').style.opacity = '0';
    setTimeout(() => { document.getElementById('protocol-screen').style.display = 'none'; }, 1000);
    
    // Munculkan Loading
    const loader = document.getElementById('loader-overlay');
    loader.style.display = 'flex';
    vibrate();
    
    // Sembunyikan Loading & Munculkan Portal Utama
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 1000);
        
        document.getElementById('brand-corner').style.opacity = '1';
        const wrap = document.getElementById('main-wrap');
        wrap.style.opacity = '1';
        wrap.style.transform = 'scale(1)';
        
        addLog("User berhasil masuk ke Mainframe.");
    }, 2500);
}

// --- BAGIAN 4: SISTEM NAVIGASI & MENU ---
function goto(url){
    // Efek loading saat pindah halaman
    const loader = document.getElementById('loader-overlay');
    loader.style.display = 'flex';
    setTimeout(() => loader.style.opacity = '1', 10);
    document.getElementById('loaderMsg').innerText = "MENGHUBUNGKAN...";
    
    addLog(`Navigasi ke: ${url}`);
    setTimeout(() => { window.location.href = url; }, 2000);
}

function reloadPage() {
    const loader = document.getElementById('loader-overlay');
    loader.style.display = 'flex';
    setTimeout(() => loader.style.opacity = '1', 10);
    document.getElementById('loaderMsg').innerText = "MEMUAT ULANG...";
    setTimeout(() => location.reload(), 1500);
}

// Buka Tutup Popup (Modal)
function openModal(id){ 
    document.getElementById(id).style.display = 'flex'; 
    setTimeout(()=> {document.getElementById(id).style.opacity='1'}, 10); 
    vibrate();
}
function closeModal(id){ 
    document.getElementById(id).style.opacity='0'; 
    setTimeout(()=> {document.getElementById(id).style.display = 'none'}, 500); 
}
function openSettings() { openModal('settingsModal'); }

// Tombol Bulat Melayang (FAB)
function toggleFab() {
    const fab = document.getElementById('myFab');
    fab.classList.toggle('active');
    vibrate();
}
// Tutup FAB kalau klik di luar
window.addEventListener('click', function(e) {
    const fab = document.getElementById('myFab');
    if (fab && !fab.contains(e.target)) {
        fab.classList.remove('active');
    }
});

// --- BAGIAN 5: PENGATURAN (SETTINGS) ---
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('iea_theme', isDark ? 'light' : 'dark');
    vibrate();
}

function toggleSound() {
    const checkbox = document.getElementById('toggle-sound');
    soundEnabled = checkbox.checked;
    localStorage.setItem('iea_sound', soundEnabled);
    if(soundEnabled) playClickSound(); 
}

function toggleGfx() {
    const checkbox = document.getElementById('toggle-gfx');
    if(checkbox.checked) {
        document.body.classList.add('low-graphics');
    } else {
        document.body.classList.remove('low-graphics');
    }
    localStorage.setItem('iea_gfx', checkbox.checked);
}

function toggleMotion() {
    const checkbox = document.getElementById('toggle-motion');
    if(checkbox.checked) {
        document.body.classList.add('no-motion');
    } else {
        document.body.classList.remove('no-motion');
    }
    localStorage.setItem('iea_motion', checkbox.checked);
}

function changeFontSize(val) {
    document.documentElement.style.fontSize = val + 'px';
    localStorage.setItem('iea_fontsize', val);
}

function resetSystemData() {
    if(confirm("Hapus semua data? Portal akan jadi seperti baru lagi.")) {
        localStorage.clear();
        location.reload();
    }
}

// Fungsi Load Settingan Pas Awal Buka
function loadSettings() {
    // Load Suara
    const savedSound = localStorage.getItem('iea_sound');
    if(savedSound !== null) {
        soundEnabled = (savedSound === 'true');
        const soundCheck = document.getElementById('toggle-sound');
        if(soundCheck) soundCheck.checked = soundEnabled;
    }
    // Load Grafik
    const savedGfx = localStorage.getItem('iea_gfx');
    if(savedGfx === 'true') {
        document.body.classList.add('low-graphics');
        const gfxCheck = document.getElementById('toggle-gfx');
        if(gfxCheck) gfxCheck.checked = true;
    }
    // Load Motion
    const savedMotion = localStorage.getItem('iea_motion');
    if(savedMotion === 'true') {
        document.body.classList.add('no-motion');
        const motionCheck = document.getElementById('toggle-motion');
        if(motionCheck) motionCheck.checked = true;
    }
    // Load Font
    const savedFont = localStorage.getItem('iea_fontsize');
    if(savedFont) {
        document.documentElement.style.fontSize = savedFont + 'px';
        const fontSlider = document.getElementById('font-slider');
        if(fontSlider) fontSlider.value = savedFont;
    }
}

// --- BAGIAN 6: FITUR CANGGIH (COMMAND CENTER) ---

// 1. Notifikasi Pojok (Toast)
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = `> ${message}`;
    container.appendChild(toast);
    
    addLog(message); // Catat di log
    playClickSound(); // Bunyi ting!
    
    setTimeout(() => toast.remove(), 4000);
}

// 2. Ganti Nama Peneliti
function changeName() {
    let newName = prompt("Siapa nama panggilanmu?", localStorage.getItem('iea_user_name') || "Peneliti");
    if (newName) {
        localStorage.setItem('iea_user_name', newName);
        document.getElementById('user-display-name').innerText = newName;
        showToast(`Nama diubah menjadi: ${newName}`);
    }
}

// 3. Jam Digital Real-time
function updateClock() {
    const clockEl = document.getElementById('digital-clock');
    if(!clockEl) return;
    
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.innerText = `${h}:${m}:${s} // IEA-TIME`;
}
setInterval(updateClock, 1000);

// 4. Simulasi Ping Radar
function updatePing() {
    const pings = [24, 28, 35, 42, 31, 20, 18, 50];
    const randomPing = pings[Math.floor(Math.random() * pings.length)];
    const el = document.getElementById('ping-status');
    if(el) el.innerText = randomPing + " ms";
}
setInterval(updatePing, 3000);

// 5. Layar Penuh (Fullscreen)
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Gagal Fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// 6. Musik Ambient (Suara Luar Angkasa)
function toggleMusic() {
    const btn = document.getElementById('music-btn');
    if (!isMusicPlaying) {
        // Bikin alat musik digital
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle'; // Jenis suara gelombang
        oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // Nada rendah
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Volume kecil aja
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        
        if(btn) btn.innerText = "PAUSE";
        showToast("Audio Ambient: ON");
    } else {
        // Matikan musik
        if(oscillator) oscillator.stop();
        if(btn) btn.innerText = "PLAY";
        showToast("Audio Ambient: OFF");
    }
    isMusicPlaying = !isMusicPlaying;
}

// 7. Cek Baterai HP
if (navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
        function updateBattery() {
            const level = Math.floor(battery.level * 100) + "%";
            const battEl = document.getElementById('battery-status');
            if(battEl) battEl.innerText = level;
            
            if(battery.level < 0.2) showToast("⚠️ Baterai Lemah!");
        }
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
    });
}

// 8. Sistem Log (Catatan Aktivitas)
function addLog(msg) {
    const logContent = document.getElementById('log-content');
    if(!logContent) return;
    
    const time = new Date().toLocaleTimeString();
    logContent.innerHTML += `<div style="margin-bottom:5px;">[${time}] ${msg}</div>`;
    logContent.scrollTop = logContent.scrollHeight; // Auto scroll ke bawah
}

function toggleLog() {
    const log = document.getElementById('system-log');
    if(log) {
        log.style.display = log.style.display === 'none' ? 'block' : 'none';
        vibrate();
    }
}

// --- BAGIAN 7: FITUR VISUAL HD ---

// 1. Widget NASA (Ambil Gambar Asli)
async function fetchNASAData() {
    try {
        // NOTE: Menggunakan DEMO_KEY (terbatas 50 request/hari)
        // Untuk production, ganti dengan API key pribadi dari https://api.nasa.gov/
        // Lihat README.md di section "API Configuration" untuk instruksi lengkap
        
        // Track API call start time
        const startTime = performance.now();
        
        // Use error handler's safe fetch method with retry logic
        const response = await (window.ErrorHandler?.safeFetch || fetch)(
            'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
        );
        
        if (!response) {
            throw new Error('Failed to fetch NASA data after retries');
        }
        
        const data = await response.json();
        const duration = performance.now() - startTime;
        
        // Track successful API call
        if (window.Analytics) {
            window.Analytics.trackApiCall('nasa/apod', duration, true);
            window.Analytics.trackFeature('nasa_widget');
        }
        
        const widget = document.getElementById('nasa-widget');
        const img = document.getElementById('nasa-img');
        const title = document.getElementById('nasa-title');
        
        if(widget && data.media_type === "image") {
            img.src = data.url;
            title.innerText = data.title;
            widget.style.display = 'block';
            addLog("Data NASA berhasil diambil.");
        }
    } catch (err) {
        console.log("Gagal ambil data NASA (Mungkin limit habis): ", err);
        
        // Track error
        if (window.Analytics) {
            window.Analytics.trackError('api_error', 'NASA APOD fetch failed');
        }
        
        // Show fallback image
        const widget = document.getElementById('nasa-widget');
        if (widget) {
            widget.innerHTML = '<p class="error-fallback">Data NASA tidak tersedia untuk saat ini. Silakan coba lagi nanti.</p>';
            widget.style.display = 'block';
        }
    }
}

// 2. Efek Gerak Kartu (Parallax 3D)
document.addEventListener('mousemove', (e) => {
    // Kalau di HP gausah gerak biar hemat baterai
    if(window.innerWidth < 768 || document.body.classList.contains('no-motion')) return; 
    
    const cards = document.querySelectorAll('.card');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cards.forEach(card => {
        const speed = 10;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// 3. Animasi Kartu Muncul Satu-satu
function initStaggeredAnimation() {
    const cards = document.querySelectorAll('.grid .card');
    cards.forEach((card, index) => {
        // Kasih jeda waktu muncul tiap kartu
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// --- BAGIAN 8: HELPER (Fungsi Pembantu) ---

// Fungsi Pencarian Kartu
function filterCards() {
    let input = document.getElementById('portalSearch').value.toUpperCase();
    let grid = document.querySelector('.grid');
    let cards = grid.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h2')[0].innerText;
        let desc = cards[i].getElementsByTagName('p')[0].innerText;
        
        if (title.toUpperCase().indexOf(input) > -1 || desc.toUpperCase().indexOf(input) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// Fungsi Bunyi "Bip" (Tanpa file mp3, pakai kode aja)
function playClickSound() {
    if(!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}

// Fungsi Getar HP
function vibrate() { 
    if(navigator.vibrate) navigator.vibrate([15]); 
    playClickSound(); // Bunyi juga
}

// Fungsi Scroll & Progress Bar
window.onscroll = function() {
    // Ngitung panjang scroll
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update bar di atas
    const bar = document.getElementById("myBar");
    if(bar) bar.style.width = scrolled + "%";

    // Update tombol Back To Top
    const btt = document.getElementById("backToTop");
    if(btt) {
        if (winScroll > 300) {
            btt.classList.add("show");
        } else {
            btt.classList.remove("show");
        }
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    vibrate();
}
