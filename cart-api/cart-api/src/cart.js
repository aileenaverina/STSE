// Daftar voucher yang berlaku: kode -> persentase diskon
const VOUCHERS = {
  HEMAT10: 0.1,
  DISKON25: 0.25,
};

function validasiItem(item) {
  if (typeof item.nama !== 'string' || item.nama.trim() === '') {
    throw new Error('Nama item wajib diisi');
  }
  if (!Number.isInteger(item.harga) || item.harga < 0) {
    throw new Error(`Harga "${item.nama}" harus bilangan bulat >= 0`);
  }
  if (!Number.isInteger(item.qty) || item.qty <= 0) {
    throw new Error(`Qty "${item.nama}" harus bilangan bulat > 0`);
  }
}

function hitungSubtotal(items) {
  return items.reduce((total, item) => total + item.harga * item.qty, 0);
}

function hitungTotal(items, kodeVoucher) {
  if (!Array.isArray(items)) {
    throw new Error('items harus berupa array');
  }
  items.forEach(validasiItem);

  const subtotal = hitungSubtotal(items);

  let persenDiskon = 0;
  if (kodeVoucher) {
    persenDiskon = VOUCHERS[kodeVoucher.toUpperCase()];
    if (persenDiskon === undefined) {
      throw new Error('Voucher tidak valid');
    }
  }

  const diskon = Math.round(subtotal * persenDiskon);
  return { subtotal, diskon, total: subtotal - diskon };
}

module.exports = { hitungSubtotal, hitungTotal, VOUCHERS };
