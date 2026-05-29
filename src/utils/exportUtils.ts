import type { Transaction } from '../components/transaction/RecentTransactions';

// Format helpers
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDateIndo = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
};

/**
 * 1. EXPORT TO CSV
 */
export const exportToCSV = (transactions: Transaction[], dateRangeLabel: string) => {
  // Define columns
  const headers = ['Tanggal', 'Kategori', 'Catatan', 'Tipe', 'Nominal'];
  
  // Format rows
  const rows = transactions.map(t => {
    // Escape quotes in note
    const escapedCatatan = t.catatan ? `"${t.catatan.replace(/"/g, '""')}"` : '""';
    return [
      t.tanggal,
      t.kategori,
      escapedCatatan,
      t.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      t.nominal
    ];
  });

  // Combine into CSV text
  const csvContent = [
    `# LAPORAN KEUANGAN UANGKU`,
    `# Periode: ${dateRangeLabel}`,
    `# Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}`,
    '',
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  // Trigger download in browser
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const safeLabel = dateRangeLabel.replace(/\s+/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Uangku_${safeLabel}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 2. EXPORT TO EXCEL (XML SpreadsheetML 2003 format)
 * Supports styling, currency format, and multi-sheet!
 */
export const exportToExcel = (
  transactions: Transaction[],
  summary: { income: number; expense: number; balance: number; count: number },
  dateRangeLabel: string
) => {
  // Aggregate category statistics for Sheet 3
  const categoryStatsMap: Record<string, { income: number; expense: number; count: number }> = {};
  transactions.forEach(t => {
    if (!categoryStatsMap[t.kategori]) {
      categoryStatsMap[t.kategori] = { income: 0, expense: 0, count: 0 };
    }
    const stat = categoryStatsMap[t.kategori];
    stat.count += 1;
    if (t.tipe === 'pemasukan') {
      stat.income += t.nominal;
    } else {
      stat.expense += t.nominal;
    }
  });

  const categoryStats = Object.entries(categoryStatsMap).map(([name, data]) => ({
    name,
    ...data
  }));

  // Build the XML content
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Uangku App</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Color="#2D3748"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#6C63FF"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Subtitle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#718096"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#6C63FF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNormal">
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
   <Alignment ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCurrency">
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
   <NumberFormat ss:Format="&quot;Rp&quot;#,##0;[Red]\(&quot;Rp&quot;#,##0\)"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellIncome">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#4CAF50" ss:Bold="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellExpense">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FF5C5C" ss:Bold="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalLabel">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#2D3748"/>
   <Interior ss:Color="#F7FAFC" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#6C63FF"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalCurrency">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#2D3748"/>
   <Interior ss:Color="#F7FAFC" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="&quot;Rp&quot;#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#6C63FF"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BEC3C9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
 </Styles>
 `;

  // -------------------------------------------------------------
  // SHEET 1: RINGKASAN FINANSIAL
  // -------------------------------------------------------------
  xml += `
 <Worksheet ss:Name="Ringkasan Finansial">
  <Table ss:ExpandedColumnCount="3" ss:ExpandedRowCount="10" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="140" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="160"/>
   <Column ss:Width="160"/>
   <Row ss:Height="30">
    <Cell ss:StyleID="Title"><Data ss:Type="String">Uangku - Laporan Ringkasan Finansial</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="Subtitle"><Data ss:Type="String">Periode: ${dateRangeLabel}</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Indikator Keuangan</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Jumlah</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">Total Pemasukan</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${summary.income}</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">Total Pengeluaran</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${summary.expense}</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">Saldo Bersih</Data></Cell>
    <Cell ss:StyleID="TotalCurrency"><Data ss:Type="Number">${summary.balance}</Data></Cell>
   </Row>
   <Row ss:Height="15"></Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">Total Jumlah Transaksi</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${summary.count}</Data></Cell>
   </Row>
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
   </PageSetup>
   <Selected/>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
 `;

  // -------------------------------------------------------------
  // SHEET 2: RIWAYAT TRANSAKSI
  // -------------------------------------------------------------
  xml += `
 <Worksheet ss:Name="Riwayat Transaksi">
  <Table ss:ExpandedColumnCount="5" ss:ExpandedRowCount="${transactions.length + 6}" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="220"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Row ss:Height="30">
    <Cell ss:StyleID="Title"><Data ss:Type="String">Riwayat Transaksi Keuangan</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="Subtitle"><Data ss:Type="String">Periode: ${dateRangeLabel} | Total: ${transactions.length} Transaksi</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tanggal</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Kategori</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Catatan</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tipe</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nominal</Data></Cell>
   </Row>
   `;

  transactions.forEach(t => {
    xml += `
   <Row ss:Height="22">
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${t.tanggal}</Data></Cell>
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">${t.kategori}</Data></Cell>
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">${t.catatan || '-'}</Data></Cell>
    <Cell ss:StyleID="${t.tipe === 'pemasukan' ? 'CellIncome' : 'CellExpense'}"><Data ss:Type="String">${t.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${t.nominal}</Data></Cell>
   </Row>`;
  });

  // Transaction Sheet Totals
  xml += `
   <Row ss:Height="24">
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">Total</Data></Cell>
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalCurrency"><Data ss:Type="Number">${summary.income - summary.expense}</Data></Cell>
   </Row>
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
   </PageSetup>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
 `;

  // -------------------------------------------------------------
  // SHEET 3: STATISTIK KATEGORI
  // -------------------------------------------------------------
  xml += `
 <Worksheet ss:Name="Statistik Kategori">
  <Table ss:ExpandedColumnCount="5" ss:ExpandedRowCount="${categoryStats.length + 6}" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="140"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Row ss:Height="30">
    <Cell ss:StyleID="Title"><Data ss:Type="String">Statistik Berdasarkan Kategori</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="Subtitle"><Data ss:Type="String">Dihitung berdasarkan filter aktif</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Kategori</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Total Pemasukan</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Total Pengeluaran</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Frekuensi</Data></Cell>
   </Row>
   `;

  categoryStats.forEach(stat => {
    xml += `
   <Row ss:Height="22">
    <Cell ss:StyleID="CellNormal"><Data ss:Type="String">${stat.name}</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${stat.income}</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${stat.expense}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${stat.count}</Data></Cell>
   </Row>`;
  });

  xml += `
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
   </PageSetup>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
 </Workbook>
 `;

  // Create downloadable file
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeLabel = dateRangeLabel.replace(/\s+/g, '_');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Uangku_${safeLabel}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 3. EXPORT TO PDF (Print Window)
 * Generates a clean vector-based high fidelity printable page that triggers print()
 */
export const exportToPDF = (
  transactions: Transaction[],
  summary: { income: number; expense: number; balance: number; count: number },
  dateRangeLabel: string
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap aktifkan pop-up browser Anda untuk mengunduh laporan PDF ✨');
    return;
  }

  // Aggregate Category breakdown for visual stats in PDF
  const categoryStatsMap: Record<string, { amount: number; count: number; tipe: 'pemasukan' | 'pengeluaran' }> = {};
  transactions.forEach(t => {
    if (!categoryStatsMap[t.kategori]) {
      categoryStatsMap[t.kategori] = { amount: 0, count: 0, tipe: t.tipe };
    }
    categoryStatsMap[t.kategori].amount += t.nominal;
    categoryStatsMap[t.kategori].count += 1;
  });

  const categoryItemsHTML = Object.entries(categoryStatsMap)
    .sort((a, b) => b[1].amount - a[1].amount)
    .map(([cat, data]) => {
      const percentage = summary.expense > 0 && data.tipe === 'pengeluaran'
        ? Math.round((data.amount / summary.expense) * 100)
        : summary.income > 0 && data.tipe === 'pemasukan'
        ? Math.round((data.amount / summary.income) * 100)
        : 0;

      const isExpense = data.tipe === 'pengeluaran';
      const colorClass = isExpense ? 'bg-red-500' : 'bg-green-500';
      const textClass = isExpense ? 'text-red-600' : 'text-green-600';

      return `
        <div style="margin-bottom: 12px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
            <span style="color: #2D3748;">${cat} <span style="font-size: 11px; font-weight: normal; color: #718096;">(${data.count}x)</span></span>
            <span class="${textClass}">${formatIDR(data.amount)} ${percentage > 0 ? `<span style="font-size: 11px; color: #718096;">(${percentage}%)</span>` : ''}</span>
          </div>
          <div style="width: 100%; height: 6px; background-color: #E2E8F0; border-radius: 3px; overflow: hidden;">
            <div style="width: ${Math.min(percentage || 5, 100)}%; height: 100%;" class="${colorClass}"></div>
          </div>
        </div>
      `;
    })
    .join('');

  // Row items
  const tableRowsHTML = transactions
    .map((t, idx) => `
      <tr style="border-bottom: 1px solid #E2E8F0; page-break-inside: avoid;">
        <td style="padding: 12px 8px; font-size: 12px; color: #4A5568; text-align: center;">${idx + 1}</td>
        <td style="padding: 12px 8px; font-size: 12px; color: #2D3748; font-weight: 600;">${formatDateIndo(t.tanggal)}</td>
        <td style="padding: 12px 8px; font-size: 12px; color: #2D3748;">${t.kategori}</td>
        <td style="padding: 12px 8px; font-size: 12px; color: #4A5568;">${t.catatan || '-'}</td>
        <td style="padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: center; color: ${t.tipe === 'pemasukan' ? '#4CAF50' : '#FF5C5C'};">
          ${t.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
        </td>
        <td style="padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: right; color: ${t.tipe === 'pemasukan' ? '#4CAF50' : '#FF5C5C'};">
          ${t.tipe === 'pemasukan' ? '+' : '-'} ${formatIDR(t.nominal).replace('Rp', 'Rp ')}
        </td>
      </tr>
    `)
    .join('');

  // Document template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Keuangan Uangku - ${dateRangeLabel}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          font-family: 'Poppins', 'Inter', sans-serif;
        }
        body {
          background-color: #ffffff;
          color: #2D3748;
          margin: 0 auto;
          padding: 20px;
          max-width: 820px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #6C63FF;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          font-size: 32px;
        }
        .logo-text h1 {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          color: #2D3748;
        }
        .logo-text p {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #6C63FF;
          text-transform: uppercase;
          margin: 4px 0 0 0;
        }
        .meta-info {
          text-align: right;
          font-size: 12px;
          color: #718096;
          line-height: 1.6;
        }
        .meta-info strong {
          color: #2D3748;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #2D3748;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #E2E8F0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Summary Grid */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }
        .card {
          background-color: #F7FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          text-align: left;
        }
        .card-label {
          font-size: 11px;
          font-weight: bold;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .card-value {
          font-size: 20px;
          font-weight: 700;
        }
        .income-val { color: #4CAF50; }
        .expense-val { color: #FF5C5C; }
        .balance-val { color: #6C63FF; }
        
        /* Two Column Layout for split analytics */
        .analytics-split {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
          margin-bottom: 35px;
        }
        .stats-panel {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          height: fit-content;
        }
        .bg-red-500 { background-color: #FF5C5C; }
        .bg-green-500 { background-color: #4CAF50; }
        .text-red-600 { color: #E53E3E; }
        .text-green-600 { color: #38A169; }

        /* Table */
        .table-container {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 40px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #F7FAFC;
          color: #4A5568;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 14px 10px;
          border-bottom: 2px solid #E2E8F0;
        }
        
        /* Footer */
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 11px;
          color: #A0AEC0;
          border-top: 1px solid #E2E8F0;
          padding-top: 20px;
        }
        
        @media print {
          body {
            padding: 50px;
            margin: 0 auto;
            max-width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div class="logo-area">
          <div class="logo-icon">💸</div>
          <div class="logo-text">
            <h1>Uangku</h1>
            <p>Personal Finance</p>
          </div>
        </div>
        <div class="meta-info">
          <div>Periode Laporan: <strong>${dateRangeLabel}</strong></div>
          <div>Tanggal Unduh: <strong>${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
          <div>Status Akun: <strong>Personal Finansial</strong></div>
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div class="summary-grid">
        <div class="card" style="border-left: 4px solid #4CAF50;">
          <div class="card-label">Total Pemasukan</div>
          <div class="card-value income-val">${formatIDR(summary.income).replace('Rp', 'Rp ')}</div>
        </div>
        <div class="card" style="border-left: 4px solid #FF5C5C;">
          <div class="card-label">Total Pengeluaran</div>
          <div class="card-value expense-val">${formatIDR(summary.expense).replace('Rp', 'Rp ')}</div>
        </div>
        <div class="card" style="border-left: 4px solid #6C63FF; background-color: #F0EFFF;">
          <div class="card-label">Saldo Bersih</div>
          <div class="card-value balance-val">${formatIDR(summary.balance).replace('Rp', 'Rp ')}</div>
        </div>
      </div>

      <!-- Analytics & Detail Split -->
      <div class="analytics-split">
        <!-- Left: Category Breakdown -->
        <div class="stats-panel">
          <h2 class="section-title">Rekap Kategori</h2>
          ${categoryItemsHTML || '<p style="font-size: 12px; color: #718096; text-align: center; margin: 20px 0;">Belum ada alokasi kategori</p>'}
        </div>

        <!-- Right: General Info -->
        <div class="stats-panel" style="display: flex; flex-col; justify-content: center; background-color: #F8FAFC;">
          <div>
            <h2 class="section-title">Ringkasan Laporan</h2>
            <div style="font-size: 13px; line-height: 1.8; color: #4A5568;">
              <p>Laporan ini mencakup total sebanyak <strong>${summary.count} transaksi</strong> keuangan yang terjadi selama periode <strong>${dateRangeLabel}</strong>.</p>
              <p>Rasio pengeluaran terhadap pemasukan Anda adalah sebesar 
                <strong>${summary.income > 0 ? Math.round((summary.expense / summary.income) * 100) : 0}%</strong>. 
                ${summary.balance >= 0 
                  ? '<span style="color: #4CAF50; font-weight: bold;">Kondisi keuangan Anda positif (surplus).</span>' 
                  : '<span style="color: #FF5C5C; font-weight: bold;">Keuangan Anda mengalami defisit saldo. Harap pantau pengeluaran Anda.</span>'
                }
              </p>
              <p style="font-size: 11px; margin-top: 20px; color: #718096; font-style: italic;">
                * Data ini disimpan secara lokal di perangkat Anda melalui sistem browser dan diunduh langsung untuk menjaga privasi keamanan data finansial Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Table -->
      <h2 class="section-title">Rincian Transaksi</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">No</th>
              <th style="width: 130px; text-align: left;">Tanggal</th>
              <th style="width: 120px; text-align: left;">Kategori</th>
              <th style="text-align: left;">Catatan / Deskripsi</th>
              <th style="width: 100px; text-align: center;">Tipe</th>
              <th style="width: 140px; text-align: right;">Nominal</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHTML || `<tr><td colspan="6" style="padding: 30px; text-align: center; color: #718096; font-size: 13px;">Belum ada data transaksi untuk diekspor</td></tr>`}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Laporan ini digenerate secara otomatis oleh <strong>Uangku — Personal Finance App</strong>.</p>
        <p>© ${new Date().getFullYear()} Uangku. Semua data dilindungi privasi lokal.</p>
      </div>

      <script>
        // Auto trigger browser print dialog once images and fonts are fully parsed
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
