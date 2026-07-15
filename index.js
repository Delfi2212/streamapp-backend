const express = require('express');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const { monto, descripcion } = req.body;
    
    const preference = {
      items: [{
        title: descripcion || 'Donación StreamApp',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: monto || 500
      }],
      back_urls: {
        success: 'streamapp://pago-exitoso',
        failure: 'streamapp://pago-fallido',
        pending: 'streamapp://pago-pendiente'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
