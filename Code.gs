/**
 * 🤖 ZettBOT - Backend Apps Script
 * Fungsi Utama: Serve HTML & Handle Registration (Batch Data & Anti-Delay)
 */

// 1. Fungsi untuk menampilkan halaman UI (Frontend)
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Nurul Haq Travel | Umroh & Haji')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Memastikan bisa di-embed jika perlu
    .addMetaTag('viewport', 'width=device-width, initial-scale=1'); // Wajib untuk responsivitas Mobile
}

// 2. Fungsi Utama Menerima Data dari Frontend
function submitRegistration(formObject) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Pendaftaran');
    
    // Auto-create Sheet jika belum ada untuk menghindari error
    if (!sheet) {
      sheet = ss.insertSheet('Pendaftaran');
      const headers = [['Timestamp', 'Nama Lengkap', 'No WhatsApp', 'Pilihan Paket', 'Tanggal Keberangkatan']];
      sheet.getRange(1, 1, 1, 5).setValues(headers);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#064e3b").setFontColor("white");
    }
    
    // Format Waktu sesuai zona Asia/Jakarta
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
    
    // Persiapkan Data dalam bentuk Array 2D (Batch Processing Style)
    const rowData = [[
      timestamp,
      formObject.nama,
      formObject.whatsapp,
      formObject.paket,
      formObject.tanggal
    ]];
    
    // Tulis ke Google Sheets menggunakan batch setValues (lebih cepat dari appendRow)
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, rowData[0].length).setValues(rowData);
    
    // ANTI-DELAY: Paksa Apps Script menyimpan perubahan ke Sheets seketika itu juga!
    SpreadsheetApp.flush();
    
    return { 
      status: 'success', 
      message: 'Alhamdulillah, pendaftaran berhasil disimpan.' 
    };
    
  } catch (error) {
    // Error Logging jika terjadi kegagalan sistem
    console.error("ZettBOT Error Log - submitRegistration: " + error.message);
    return { 
      status: 'error', 
      message: 'Maaf, terjadi kesalahan sistem: ' + error.message 
    };
  }
}