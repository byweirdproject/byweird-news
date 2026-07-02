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

    // Konfigurasi Database Google Sheets (Format TSV)
const SPREADSHEET_URL = <'https://docs.google.com/spreadsheets/d/e/2PACX-1vRC8vyTYWNAq9TiTso0xXgWKlGq2mJgCxVOZvKuWfZar6lGOJhYGtiZUQHwWI0Y_cyvvpBmUo2Ndn3n/pub?output=tsv'>;

async function fetchNews() {
    const container = document.getElementById('newsContainer');
    
   try {
        console.log("Mencoba mengambil data dari:", SPREADSHEET_URL); // Cek apakah link benar
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.text();
        
        console.log("Data mentah dari Sheets:", data); // Cek apakah data masuk
        
        // Memecah baris data spreadsheet
        const rows = data.split('\n').map(row => row.split('\t'));
        console.log("Jumlah baris yang didapat:", rows.length); // Cek jumlah baris
}

// Jalankan fungsi fetch saat halaman web selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});
});