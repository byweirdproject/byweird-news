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

            // Template kartu berita modern dengan validasi .trim() untuk membuang spasi liar
            const newsCard = `
                <div class="news-card" style="background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; margin-bottom: 24px; transition: transform 0.3s ease;">
                    ${linkGambar.trim() !== "" ? `<img src="${linkGambar.trim()}" alt="${judul.trim()}" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
                    <div style="padding: 24px;">
                        <span style="font-size: 12px; color: var(--accent-color); font-weight: 600; text-transform: uppercase;">${kategori.trim() || 'Trending'}</span>
                        <h3 style="font-size: 20px; margin: 8px 0 12px; font-weight: 600;">${judul.trim()}</h3>
                        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 16px;">${ringkasan.trim()}</p>
                        <span style="font-size: 12px; color: #71717a;">${tanggal.trim() || ''}</span>
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

// Jalankan fungsi setelah website sepenuhnya diload oleh browser
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    
    // Logika tombol interaktif lainnya yang sebelumnya lo pakai
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Subscribed!";
            btn.style.backgroundColor = "#fff";
            setTimeout(() => {
                newsletterForm.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = "var(--accent-color)";
            }, 1000);
        });
    }

    const polls = document.querySelectorAll('.poll-item');
    polls.forEach(poll => {
        poll.addEventListener('click', () => {
            polls.forEach(p => p.style.borderColor = 'var(--border-color)');
            poll.style.borderColor = 'var(--accent-color)';
        });
        poll.style.cursor = 'pointer';
    });
});