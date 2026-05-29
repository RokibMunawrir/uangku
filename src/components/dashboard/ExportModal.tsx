import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Download, Calendar, CheckCircle2, Loader2, Filter, Info, AlertTriangle } from 'lucide-react';
import type { Transaction } from '../transaction/RecentTransactions';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

type FileFormat = 'pdf' | 'excel' | 'csv';
type DateRange = 'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'tahun-ini' | 'semua' | 'custom';
type TxType = 'semua' | 'pemasukan' | 'pengeluaran';

const ALL_CATEGORIES = ['Makanan', 'Transportasi', 'Belanja', 'Pendidikan', 'Hiburan', 'Tabungan', 'Lainnya'];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  // Form States
  const [format, setFormat] = useState<FileFormat>('pdf');
  const [dateRange, setDateRange] = useState<DateRange>('bulan-ini');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [txType, setTxType] = useState<TxType>('semua');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(ALL_CATEGORIES);

  // Status States
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [toastMessage, setToastMessage] = useState('');

  // Calculations for filtered data
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, count: 0 });

  // Get human-readable date range label for the report
  const getDateRangeLabel = () => {
    const today = new Date();
    switch (dateRange) {
      case 'hari-ini':
        return today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      case 'minggu-ini':
        return 'Minggu Ini';
      case 'bulan-ini':
        return today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      case 'tahun-ini':
        return `Tahun ${today.getFullYear()}`;
      case 'semua':
        return 'Semua Waktu';
      case 'custom':
        if (startDate && endDate) {
          return `${new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
        return 'Kustom Range';
      default:
        return 'Laporan Keuangan';
    }
  };

  // Filter Calculation Logic
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    // Helper: Start of current week (Monday)
    const getStartOfWeek = () => {
      const d = new Date(todayStr);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    // Helper: Start of current month
    const getStartOfMonth = () => {
      const d = new Date(todayStr);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    };

    // Helper: Start of current year
    const getStartOfYear = () => {
      const d = new Date(todayStr);
      return new Date(d.getFullYear(), 0, 1);
    };

    const startOfWeek = getStartOfWeek();
    const startOfMonth = getStartOfMonth();
    const startOfYear = getStartOfYear();

    const filtered = transactions.filter(t => {
      // 1. Filter by Date Range
      const tDate = new Date(t.tanggal);
      let matchesDate = false;

      if (dateRange === 'semua') {
        matchesDate = true;
      } else if (dateRange === 'hari-ini') {
        matchesDate = t.tanggal === todayStr;
      } else if (dateRange === 'minggu-ini') {
        matchesDate = tDate >= startOfWeek && tDate <= today;
      } else if (dateRange === 'bulan-ini') {
        matchesDate = tDate >= startOfMonth && tDate <= today;
      } else if (dateRange === 'tahun-ini') {
        matchesDate = tDate >= startOfYear && tDate <= today;
      } else if (dateRange === 'custom') {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          matchesDate = tDate >= start && tDate <= end;
        } else {
          matchesDate = true; // Show all until fully selected
        }
      }

      // 2. Filter by Transaction Type
      const matchesType = txType === 'semua' || t.tipe === txType;

      // 3. Filter by Categories
      const matchesCategory = selectedCategories.includes(t.kategori);

      return matchesDate && matchesType && matchesCategory;
    });

    // Calculate totals
    const income = filtered
      .filter(t => t.tipe === 'pemasukan')
      .reduce((sum, t) => sum + t.nominal, 0);

    const expense = filtered
      .filter(t => t.tipe === 'pengeluaran')
      .reduce((sum, t) => sum + t.nominal, 0);

    setFilteredTransactions(filtered);
    setSummary({
      income,
      expense,
      balance: income - expense,
      count: filtered.length
    });
  }, [transactions, dateRange, startDate, endDate, txType, selectedCategories]);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories(ALL_CATEGORIES);
  };

  const selectNoneCategories = () => {
    setSelectedCategories([]);
  };

  // Handle Export Download Action
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      alert('Tidak ada transaksi yang cocok untuk diekspor!');
      return;
    }

    setStatus('loading');

    // Simulate premium processing delay
    setTimeout(() => {
      try {
        const label = getDateRangeLabel();
        if (format === 'csv') {
          exportToCSV(filteredTransactions, label);
        } else if (format === 'excel') {
          exportToExcel(filteredTransactions, summary, label);
        } else if (format === 'pdf') {
          exportToPDF(filteredTransactions, summary, label);
        }

        // Show Success Toast
        setStatus('success');
        setToastMessage(`Laporan ${format.toUpperCase()} berhasil diunduh ✨`);
        
        // Reset success after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          onClose();
        }, 2200);

      } catch (err) {
        console.error(err);
        alert('Gagal mengekspor laporan. Silakan coba lagi.');
        setStatus('idle');
      }
    }, 1500);
  };

  // Formatting Currency
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with soft blur */}
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-md transition-all duration-300"
        onClick={status === 'idle' ? onClose : undefined}
      />

      {/* Main Neumorphism Card Modal */}
      <div className="relative w-full max-w-2xl bg-bg-custom rounded-[28px] shadow-neumorph-out overflow-hidden flex flex-col max-h-[90vh] z-10 border border-white/20 transform transition-all duration-300 scale-100 font-sans select-none animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-neutral-300/40 select-none">
          <div>
            <h2 className="text-xl font-extrabold text-dark-custom flex items-center gap-2">
              <span>📊</span> Ekspor Laporan Keuangan
            </h2>
            <p className="text-xs font-semibold text-secondary-custom">
              Unduh rekap finansial Anda dalam format PDF, Excel, atau CSV.
            </p>
          </div>
          {status === 'idle' && (
            <button 
              onClick={onClose}
              className="p-2.5 rounded-[14px] bg-bg-custom shadow-neumorph-sm-out hover:shadow-neumorph-out active:shadow-neumorph-sm-in text-secondary-custom hover:text-danger-custom transition-all duration-200 outline-none cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {status === 'success' ? (
            /* Success Screen */
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-bg-custom shadow-neumorph-out flex items-center justify-center text-success-custom mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-dark-custom">Laporan Selesai Dibuat!</h3>
              <p className="text-sm font-semibold text-secondary-custom mt-2 max-w-sm">
                {toastMessage}
              </p>
            </div>
          ) : status === 'loading' ? (
            /* Loading Screen */
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
              <div className="relative w-20 h-20 rounded-full bg-bg-custom shadow-neumorph-in flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-primary-custom animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-dark-custom animate-pulse">Sedang membuat laporan...</h3>
              <p className="text-xs font-semibold text-secondary-custom mt-2 max-w-xs">
                Menghitung saldo dan memformat dokumen {format.toUpperCase()} Anda. Harap tunggu sebentar.
              </p>

              {/* Micro-Skeleton loading bar */}
              <div className="w-48 h-1.5 bg-bg-custom shadow-neumorph-sm-in rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-primary-custom rounded-full animate-infinite-loading w-1/3"></div>
              </div>
              <style>{`
                @keyframes infinite-loading {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(200%); }
                  100% { transform: translateX(300%); }
                }
                .animate-infinite-loading {
                  animation: infinite-loading 1.8s infinite ease-in-out;
                }
              `}</style>
            </div>
          ) : (
            /* Form Content */
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              
              {/* 1. Format Seleksi */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-custom">
                  1. Pilih Format Laporan
                </label>
                <div className="grid grid-cols-3 gap-3 p-1.5 bg-bg-custom shadow-neumorph-sm-in rounded-[18px]">
                  {(['pdf', 'excel', 'csv'] as const).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-3.5 px-2 rounded-[14px] text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        format === fmt
                          ? 'bg-bg-custom text-primary-custom shadow-neumorph-sm-out'
                          : 'text-secondary-custom hover:text-dark-custom'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">
                        {fmt === 'pdf' ? '📕' : fmt === 'excel' ? '💚' : '📝'}
                      </span>
                      <span className="uppercase font-extrabold">{fmt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Filter Tanggal & Tipe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-custom flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary-custom" /> 2. Rentang Waktu
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { val: 'hari-ini', label: 'Hari Ini' },
                      { val: 'minggu-ini', label: 'Minggu Ini' },
                      { val: 'bulan-ini', label: 'Bulan Ini' },
                      { val: 'tahun-ini', label: 'Tahun Ini' },
                      { val: 'semua', label: 'Semua' },
                      { val: 'custom', label: 'Kustom' }
                    ] as const).map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setDateRange(opt.val)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-[12px] transition-all duration-200 cursor-pointer ${
                          dateRange === opt.val
                            ? 'bg-bg-custom text-primary-custom shadow-neumorph-sm-in'
                            : 'bg-bg-custom text-secondary-custom shadow-neumorph-sm-out hover:text-dark-custom'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Inputs */}
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2 p-3 rounded-[16px] bg-bg-custom shadow-neumorph-sm-in animate-in slide-in-from-top-2 duration-200">
                      <Input
                        type="date"
                        label="Mulai"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="py-1.5 px-2 text-xs"
                        wrapperClassName="gap-1"
                      />
                      <Input
                        type="date"
                        label="Sampai"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="py-1.5 px-2 text-xs"
                        wrapperClassName="gap-1"
                      />
                    </div>
                  )}
                </div>

                {/* Transaction Type Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-custom flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-primary-custom" /> 3. Tipe Transaksi
                  </label>
                  <div className="flex flex-col gap-2.5 h-full justify-start">
                    {([
                      { val: 'semua', label: 'Semua Transaksi 🔄' },
                      { val: 'pemasukan', label: 'Hanya Pemasukan 🟢' },
                      { val: 'pengeluaran', label: 'Hanya Pengeluaran 🔴' }
                    ] as const).map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setTxType(opt.val)}
                        className={`py-2.5 px-4 rounded-[14px] text-xs font-bold text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          txType === opt.val
                            ? 'bg-bg-custom text-primary-custom shadow-neumorph-sm-in border-l-4 border-primary-custom'
                            : 'bg-bg-custom text-secondary-custom shadow-neumorph-sm-out hover:text-dark-custom'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {txType === opt.val && <span className="text-[10px] font-black">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Kategori Filter (Multi-select) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center select-none">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-custom">
                    4. Filter Kategori
                  </label>
                  <div className="flex gap-2 text-[10px] font-bold">
                    <button 
                      type="button"
                      onClick={selectAllCategories}
                      className="text-primary-custom hover:underline cursor-pointer"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-neutral-400">•</span>
                    <button 
                      type="button"
                      onClick={selectNoneCategories}
                      className="text-secondary-custom hover:underline cursor-pointer"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                {/* Badges Checklist */}
                <div className="shadow-neumorph-sm-in p-3 rounded-[20px] bg-bg-custom flex flex-wrap gap-2 max-h-[110px] overflow-y-auto">
                  {ALL_CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-[12px] text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-primary-custom text-white shadow-neumorph-primary-out'
                            : 'bg-bg-custom text-secondary-custom shadow-neumorph-sm-out hover:text-dark-custom'
                        }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Preview Panel */}
              <div className="mt-2 flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-custom flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-primary-custom" /> Pratinjau Rekap Laporan
                </label>
                
                <div className="p-5 rounded-[22px] bg-bg-custom shadow-neumorph-sm-in grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-secondary-custom uppercase tracking-wider">Jumlah Data</p>
                    <p className="text-base font-extrabold text-dark-custom mt-1">{summary.count} Tx</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-custom uppercase tracking-wider">Total Masuk</p>
                    <p className="text-base font-extrabold text-success-custom mt-1">{formatIDR(summary.income)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-custom uppercase tracking-wider">Total Keluar</p>
                    <p className="text-base font-extrabold text-danger-custom mt-1">{formatIDR(summary.expense)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-custom uppercase tracking-wider">Saldo Bersih</p>
                    <p className={`text-base font-extrabold mt-1 ${summary.balance >= 0 ? 'text-primary-custom' : 'text-danger-custom'}`}>
                      {formatIDR(summary.balance)}
                    </p>
                  </div>
                </div>

                {/* Warnings and Info inside preview */}
                {summary.count === 0 ? (
                  <div className="flex items-center gap-2 p-3.5 rounded-[16px] bg-danger-custom/10 text-danger-custom text-xs font-bold mt-1">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                    <span>Tidak ada data transaksi yang cocok dengan kriteria filter Anda! Tombol unduh dinonaktifkan.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-[16px] bg-primary-custom/5 text-primary-custom text-[11px] font-bold mt-1">
                    <span>ℹ️</span>
                    <span>Mengekspor <strong>{summary.count} transaksi</strong> untuk periode <strong>{getDateRangeLabel()}</strong>.</span>
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {status === 'idle' && (
          <footer className="px-8 py-5 border-t border-neutral-300/40 bg-neutral-100/10 flex justify-end gap-3 select-none">
            <Button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-[14px]"
              size="sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleExport}
              disabled={summary.count === 0}
              className="px-6 py-2.5 rounded-[14px] shadow-neumorph-primary-out font-bold flex items-center justify-center gap-2"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Laporan</span>
            </Button>
          </footer>
        )}

      </div>
    </div>
  );
};

export default ExportModal;
