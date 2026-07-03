const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRC8vyTYWNAq9TiTso0xXgWKlGq2mJgCxVOZvKuWfZar6lGOJhYGtiZUQHwWI0Y_cyvvpBmUo2Ndn3n/pub?output=tsv';

// FUNGSI 1: Untuk halaman utama (Menampilkan daftar berita)
async function fetchNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return; // Kalau bukan di halaman index, lewati
    
    try {
        const response = await fetch(SPREADSHEET_URL);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.text();
        const rows = data.split(/\r?\n/).map(row => row.split('\t'));
        
        container.innerHTML = '';
        
        if (rows.length <= 1 || (rows[1] && rows[1][0] === "")) {
            container.innerHTML = `<div class="empty-state"><p>Belum ada berita yang di-publish.</p></div>`;
            return;
        }

        // Looping data
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const judul = row[0] || '';
            const tanggal = row[1] || '';
            const kategori = row[2] || '';
            const ringkasan = row[3] || '';
            const linkGambar = row[4] || '';
            
            if (judul.trim() === "") continue;

            // Kartu Berita diubah jadi <a href="..."> biar bisa diklik
            const newsCard = `
                <a href="artikel.html?id=${i}" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                    <div class="news-card">
                        ${linkGambar.trim() !== "" ? `
                        <div class="news-image">
                            <img src="${linkGambar.trim()}" alt="${judul.trim()}">
                        </div>
                        ` : ''}
                        <div class="news-content">
                            <span class="news-category">${kategori.trim() || 'Trending'}</span>
                            <h3 class="news-title">${judul.trim()}</h3>
                            <p class="news-description">${ringkasan.trim()}</p>
                            <span class="news-date">${tanggal.trim() || ''}</span>
                        </div>
                    </div>
                </a>
            `;
            container.innerHTML += newsCard;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="empty-state"><p style="color: #ef4444;">Gagal memuat berita.</p></div>`;
    }
}

// FUNGSI 2: Untuk Halaman Artikel (Membaca isi berita)
async function fetchArticle() {
    const articleContainer = document.getElementById('articleContainer');
    if (!articleContainer) return; // Kalau bukan di halaman artikel, lewati

    // Ambil ID dari URL (contoh: artikel.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        articleContainer.innerHTML = `<div class="empty-state">Artikel tidak ditemukan.</div>`;
        return;
    }

    try {
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.text();
        const rows = data.split(/\r?\n/).map(row => row.split('\t'));

        // Cek apakah data di baris tersebut ada
        const row = rows[id];
        if (!row || !row[0]) {
            articleContainer.innerHTML = `<div class="empty-state">Artikel tidak ditemukan.</div>`;
            return;
        }

        const judul = row[0] || '';
        const tanggal = row[1] || '';
        const kategori = row[2] || '';
        // Kolom 3 adalah Ringkasan, Kolom 4 adalah Gambar, Kolom 5 (indeks ke-5) adalah Isi Artikel!
        const linkGambar = row[4] || '';
        const isiArtikel = row[5] || row[3]; // Kalau isi artikel kosong, pakai ringkasan

        // Bersihkan data text dari tanda kutip ganda yang berlebih akibat format Google Sheets
        const cleanIsi = isiArtikel.replace(/^"|"$/g, '').replace(/""/g, '"');
        
        // Memecah enter/paragraf dari Google Sheets agar rapi di HTML
        const paragrafHTML = cleanIsi.split('\n').map(p => `<p>${p}</p>`).join('');

        articleContainer.innerHTML = `
            <div class="article-detail">
                <span class="article-hero-category">${kategori}</span>
                <h1 class="article-hero-title">${judul}</h1>
                <span class="article-hero-date">${tanggal}</span>
                
                ${linkGambar.trim() !== "" ? `
                    <img src="${linkGambar}" alt="${judul}" class="article-hero-image">
                ` : ''}
                
                <div class="article-body">
                    ${paragrafHTML}
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        articleContainer.innerHTML = `<div class="empty-state" style="color: #ef4444;">Gagal memuat konten.</div>`;
    }
}

// Jalankan semua fungsi saat website selesai loading
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchArticle(); // Fungsi baru dipanggil di sini
    
    // Fitur Scroll to Top & Polling (tetap sama)
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const polls = document.querySelectorAll('.poll-item');
    polls.forEach(poll => {
        poll.addEventListener('click', () => {
            polls.forEach(p => p.style.borderColor = 'var(--border-color)');
            poll.style.borderColor = 'var(--accent-color)';
        });
    });
});