// Konfigurasi Database Google Sheets (Format TSV)
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRC8vyTYWNAq9TiTso0xXgWKlGq2mJgCxVOZvKuWfZar6lGOJhYGtiZUQHwWI0Y_cyvvpBmUo2Ndn3n/pub?output=tsv';

async function fetchNews() {
    const container = document.getElementById('newsContainer');
    
    // Jaga-jaga kalau elemen HTML belum terbaca
    if (!container) return; 
    
    try {
        const response = await fetch(SPREADSHEET_URL);
        if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheets");
        
        const data = await response.text();
        
        // Memecah baris data dengan regex (Mendukung \r\n dari Google Sheets)
        const rows = data.split(/\r?\n/).map(row => row.split('\t'));
        
        // Hapus teks loading
        container.innerHTML = '';
        
        // Jika spreadsheet kosong atau cuma ada header
        if (rows.length <= 1 || (rows[1] && rows[1][0] === "")) {
            container.innerHTML = `<div class="empty-state"><p>Check back soon. Once posts are published, you’ll see them here.</p></div>`;
            return;
        }

        // Loop dari baris kedua (indeks 1) sampai baris terakhir
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // Antisipasi jika ada baris yang kolomnya kurang dari 5
            const judul = row[0] || '';
            const tanggal = row[1] || '';
            const kategori = row[2] || '';
            const ringkasan = row[3] || '';
            const linkGambar = row[4] || '';
            
            // Jika kolom Judul kosong, skip pembuatan kartu berita ini
            if (judul.trim() === "") continue;

            // Template kartu berita versi smooth, terpusat di tengah
            const newsCard = `
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
            `;
            
            container.innerHTML += newsCard;
        }

    } catch (error) {
        console.error('Gagal memproses data:', error);
        container.innerHTML = `<div class="empty-state"><p style="color: #ef4444;">Gagal memuat berita. Coba refresh halaman.</p></div>`;
    }
}

// Jalankan semua fungsi setelah website sepenuhnya diload oleh browser
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Tarik Data Berita
    fetchNews();
    
    // 2. Logika Form Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Efek visual sukses subscribe
            btn.innerText = "Subscribed!";
            btn.style.backgroundColor = "#fff";
            btn.style.color = "#000"; 
            
            setTimeout(() => {
                newsletterForm.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = "var(--accent-color)";
                btn.style.color = "#000";
            }, 1500);
        });
    }

    // 3. Fitur Scroll to Top (Sudah dipisah kamarnya biar rapi)
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Fitur Interaksi Polling/Voting
    const polls = document.querySelectorAll('.poll-item');
    polls.forEach(poll => {
        poll.addEventListener('click', () => {
            // Reset semua garis tepi
            polls.forEach(p => p.style.borderColor = 'var(--border-color)');
            // Nyalakan warna neon pada yang dipilih
            poll.style.borderColor = 'var(--accent-color)';
        });
        poll.style.cursor = 'pointer';
    });
});