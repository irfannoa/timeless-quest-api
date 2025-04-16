export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data || !data.amount || !data.order_id) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  const amountInSen = parseInt(data.amount * 100);

  const postData = {
    userSecretKey: '7n87xwhk-f5qz-qjxf-2ilb-ada6kz3oh8fr',
    categoryCode: 'zfbble46',
    billName: 'Timeless Quest Order',
    billDescription: 'Your Order on Timeless Quest',
    billPriceSetting: 1,
    billPayorInfo: 1,
    billAmount: amountInSen,
    billReturnUrl: 'https://timeless-quest.xyz/thank-you',
    billCallbackUrl: 'https://timeless-quest.xyz/toyyibpay_callback.php',
    billExternalReferenceNo: data.order_id,
    billTo: data.name,
    billEmail: data.email,
    billPhone: data.phone
  };

  try {
    const response = await fetch('https://dev.toyyibpay.com/index.php/api/createBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(postData)
    });

    const result = await response.json();

    if (result[0]?.BillCode) {
      const billUrl = `https://dev.toyyibpay.com/${result[0].BillCode}`;
      res.status(200).json({ billUrl });
    } else {
      res.status(500).json({ error: 'Failed to create bill' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
