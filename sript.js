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