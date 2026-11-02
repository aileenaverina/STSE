const request = require('supertest');
const app = require('../src/app');

describe('API cart-api', () => {
  test('GET /health mengembalikan status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('POST /cart/total menghitung total dengan voucher', async () => {
    const res = await request(app)
      .post('/cart/total')
      .send({ items: [{ nama: 'Buku', harga: 50000, qty: 2 }], voucher: 'HEMAT10' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ subtotal: 100000, diskon: 10000, total: 90000 });
  });

  test('POST /cart/total membalas 400 untuk voucher tidak valid', async () => {
    const res = await request(app)
      .post('/cart/total')
      .send({ items: [{ nama: 'Buku', harga: 50000, qty: 1 }], voucher: 'GRATIS' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Voucher tidak valid');
  });
});
