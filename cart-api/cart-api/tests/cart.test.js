const { hitungSubtotal, hitungTotal } = require('../src/cart');

describe('hitungSubtotal', () => {
  test('menjumlahkan harga x qty semua item', () => {
    const items = [
      { nama: 'Buku', harga: 50000, qty: 2 },
      { nama: 'Pulpen', harga: 5000, qty: 3 },
    ];
    expect(hitungSubtotal(items)).toBe(115000);
  });

  test('keranjang kosong bernilai 0', () => {
    expect(hitungSubtotal([])).toBe(0);
  });
});

describe('hitungTotal', () => {
  const items = [{ nama: 'Buku', harga: 100000, qty: 1 }];

  test('tanpa voucher, total sama dengan subtotal', () => {
    expect(hitungTotal(items)).toEqual({ subtotal: 100000, diskon: 0, total: 100000 });
  });

  test('voucher HEMAT10 memberi diskon 10%', () => {
    expect(hitungTotal(items, 'HEMAT10')).toEqual({ subtotal: 100000, diskon: 10000, total: 90000 });
  });

  test('kode voucher tidak peka huruf besar/kecil', () => {
    expect(hitungTotal(items, 'diskon25').total).toBe(75000);
  });

  test('voucher tidak dikenal ditolak', () => {
    expect(() => hitungTotal(items, 'GRATIS')).toThrow('Voucher tidak valid');
  });

  test('qty 0 atau negatif ditolak', () => {
    expect(() => hitungTotal([{ nama: 'Buku', harga: 1000, qty: 0 }])).toThrow(/Qty/);
    expect(() => hitungTotal([{ nama: 'Buku', harga: 1000, qty: -2 }])).toThrow(/Qty/);
  });

  test('harga negatif ditolak', () => {
    expect(() => hitungTotal([{ nama: 'Buku', harga: -1, qty: 1 }])).toThrow(/Harga/);
  });

  test('items bukan array ditolak', () => {
    expect(() => hitungTotal('buku')).toThrow('items harus berupa array');
  });
});
