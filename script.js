// Dark Mode Logic
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function updateThemeIcon() {
    if (document.documentElement.classList.contains('dark')) {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// Initialize Theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
updateThemeIcon();

themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
    updateThemeIcon();
});

// Set default date to today
document.getElementById('date').valueAsDate = new Date();

let transactions = JSON.parse(localStorage.getItem('myMonthlyTransactions')) || [];

// Format Rupiah Input Logic
const amountDisplay = document.getElementById('amountDisplay');

amountDisplay.addEventListener('input', function(e) {
    // Hapus karakter selain angka
    let value = this.value.replace(/[^0-9]/g, '');
    
    if (value !== '') {
        // Tambahkan titik pemisah ribuan
        let formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        this.value = formattedValue;
    } else {
        this.value = '';
    }
});

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function updateUI() {
    const list = document.getElementById('transactionList');
    const emptyState = document.getElementById('emptyState');
    list.innerHTML = '';
    
    let income = 0;
    let expense = 0;

    // 1. Hitung total dari SEMUA transaksi (Summary Card tidak ikut terfilter)
    transactions.forEach((t) => {
        if (t.type === 'income') {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    document.getElementById('totalIncome').innerText = formatRupiah(income);
    document.getElementById('totalExpense').innerText = formatRupiah(expense);
    document.getElementById('totalBalance').innerText = formatRupiah(income - expense);

    // 2. Ambil nilai dari input filter/sort
    const filterDesc = document.getElementById('filterDescription') ? document.getElementById('filterDescription').value.toLowerCase() : '';
    const filterType = document.getElementById('filterType') ? document.getElementById('filterType').value : 'all';
    const sortD = document.getElementById('sortDate') ? document.getElementById('sortDate').value : 'desc';

    // 3. Terapkan Filter Keterangan dan Jenis
    let displayTransactions = transactions.filter(t => {
        const matchDesc = t.description.toLowerCase().includes(filterDesc);
        const matchType = filterType === 'all' || t.type === filterType;
        return matchDesc && matchType;
    });

    // 4. Terapkan Sorting (Pengurutan Tanggal)
    displayTransactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortD === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // 5. Tampilkan ke Tabel HTML
    if (displayTransactions.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        displayTransactions.forEach((t) => {
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition";
            
            const typeBadge = t.type === 'income' 
                ? '<span class="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Pemasukan</span>'
                : '<span class="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800">Pengeluaran</span>';
            
            const amountClass = t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400';
            const amountPrefix = t.type === 'income' ? '+' : '-';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">${t.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${t.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${typeBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${amountClass}">${amountPrefix} ${formatRupiah(t.amount)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="deleteTransaction(${t.id})" class="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 px-3 py-1 rounded-md transition">Hapus</button>
                </td>
            `;
            list.appendChild(row);
        });
    }

    localStorage.setItem('myMonthlyTransactions', JSON.stringify(transactions));
}

document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mengambil value dan menghilangkan titik untuk disimpan sebagai number
    let rawAmount = document.getElementById('amountDisplay').value.replace(/\./g, '');
    let parsedAmount = parseFloat(rawAmount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Masukkan nominal yang valid");
        return;
    }

    const transaction = {
        id: Date.now(),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        type: document.getElementById('type').value,
        amount: parsedAmount
    };

    transactions.push(transaction);
    updateUI();
    
    // Reset description and amount
    document.getElementById('description').value = '';
    document.getElementById('amountDisplay').value = '';
    document.getElementById('description').focus();
});

function deleteTransaction(id) {
    if(confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
    }
}

function exportToExcel() {
    if (transactions.length === 0) {
        alert("Belum ada data transaksi untuk dieksport!");
        return;
    }

    // Reverse to show chronological order in Excel (oldest first)
    const sortedForExcel = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const excelData = sortedForExcel.map(t => ({
        'Tanggal': t.date,
        'Keterangan': t.description,
        'Jenis': t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Pemasukan (Rp)': t.type === 'income' ? t.amount : '',
        'Pengeluaran (Rp)': t.type === 'expense' ? t.amount : ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns slightly
    const colWidths = [
        { wch: 12 }, // Tanggal
        { wch: 30 }, // Keterangan
        { wch: 15 }, // Jenis
        { wch: 20 }, // Pemasukan
        { wch: 20 }  // Pengeluaran
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Buku_Kas");
    
    const fileName = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// Initialize UI
updateUI();
function clearAllTransactions() {
    if (transactions.length === 0) {
        alert("Tidak ada transaksi untuk dihapus.");
        return;
    }
    
    // Munculkan popup konfirmasi
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA riwayat transaksi? Data yang sudah dihapus tidak dapat dikembalikan.')) {
        // Kosongkan array transactions
        transactions = [];
        
        // Update tampilan dan simpan perubahan ke local storage
        updateUI();
    }
}

// Listener agar tabel otomatis berubah saat filter dimainkan
document.getElementById('filterDescription').addEventListener('input', updateUI);
document.getElementById('filterType').addEventListener('change', updateUI);
document.getElementById('sortDate').addEventListener('change', updateUI);