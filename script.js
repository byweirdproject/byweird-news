// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Interaksi untuk simulasi Form Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah page reload
            const email = emailInput.value;
            
            // Mengganti tombol menjadi status sukses sementara
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = "Subscribed!";
            btn.style.backgroundColor = "#fff";
            
            setTimeout(() => {
                alert(`Terima kasih! Email ${email} berhasil didaftarkan. Stay Weird!`);
                newsletterForm.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = "var(--accent-color)";
            }, 500);
        });
    }

    // Interaksi Visual saat Voting di-klik
    const polls = document.querySelectorAll('.poll-item');
    polls.forEach(poll => {
        poll.addEventListener('click', () => {
            // Reset semua border
            polls.forEach(p => p.style.borderColor = 'var(--border-color)');
            // Highlight yang dipilih
            poll.style.borderColor = 'var(--accent-color)';
        });
        poll.style.cursor = 'pointer';
    });
});

// Konfigurasi Database Google Sheets (Format TSV)
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRC8vyTYWNAq9TiTso0xXgWKlGq2mJgCxVOZvKuWfZar6lGOJhYGtiZUQHwWI0Y_cyvvpBmUo2Ndn3n/pub?output=tsv';

async function fetchNews() {
    const container = document.getElementById('newsContainer');
    
    try {
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.text();
        
        // Memecah baris data spreadsheet
        const rows = data.split('\n').map(row => row.split('\t'));
        
        // Hapus teks loading
        container.innerHTML = '';
        
        // Jika spreadsheet kosong atau cuma ada header
        if (rows.length <= 1 || rows[1][0] === "") {
            container.innerHTML = `<div class="empty-state"><p>Check back soon. Once posts are published, you’ll see them here.</p></div>`;
            return;
        }

        // Loop dari baris kedua (indeks 1) sampai akhir berita
        // Headers: rows[0] -> [Judul, Tanggal, Kategori, Ringkasan, LinkGambar]
        for (let i = 1; i < rows.length; i++) {
            const [judul, tanggal, kategori, ringkasan, linkGambar] = rows[i];
            
            // Cek jika baris kosong, skip
            if (!judul || judul.trim() === "") continue;

            // Template kartu berita modern
            const newsCard = `
                <div class="news-card" style="background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; margin-bottom: 24px; transition: transform 0.3s ease;">
                    ${linkGambar && linkGambar.trim() !== "" ? `<img src="${linkGambar}" alt="${judul}" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
                    <div style="padding: 24px;">
                        <span style="font-size: 12px; color: var(--accent-color); font-weight: 600; text-transform: uppercase;">${kategori || 'Trending'}</span>
                        <h3 style="font-size: 20px; margin: 8px 0 12px; font-weight: 600;">${judul}</h3>
                        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 16px;">${ringkasan}</p>
                        <span style="font-size: 12px; color: #71717a;">${tanggal || ''}</span>
                    </div>
                </div>
            `;
            
            container.innerHTML += newsCard;
        }

    } catch (error) {
        console.error('Gagal mengambil data berita:', error);
        container.innerHTML = `<div class="empty-state"><p style="color: #ef4444;">Gagal memuat berita. Coba refresh halaman.</p></div>`;
    }
}

// Jalankan fungsi fetch saat halaman web selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});