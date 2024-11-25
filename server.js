// Import required modules
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
// Parse JSON bodies in incoming requests
app.use(express.json());

// Set up PayPal API endpoints and credentials
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Function to get PayPal access token
async function getPayPalAccessToken() {
  // Create base64 encoded auth string
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  // Make a POST request to PayPal to get the access token
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

// Route to send PayPal Client ID to the frontend
app.get('/api/paypal-client-id', (req, res) => {
  res.json({ clientId: PAYPAL_CLIENT_ID });
});

// Route to create a PayPal order
app.post('/api/create-paypal-order', async (req, res) => {
  const { cart, buyer } = req.body;
  const accessToken = await getPayPalAccessToken();
  // Make a POST request to PayPal to create an order
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: cart.total,
          },
          shipping: {
            name: {
              full_name: `${buyer.firstName} ${buyer.lastName}`
            },
            address: {
              address_line_1: buyer.address1,
              address_line_2: buyer.address2,
              admin_area_2: buyer.city,
              admin_area_1: buyer.state,
              postal_code: buyer.zip,
              country_code: buyer.country,
            },
          },
        },
      ],
      payer: {
        email_address: buyer.email,
        name: {
          given_name: buyer.firstName,
          surname: buyer.lastName
        },
        address: {
          address_line_1: buyer.address1,
          address_line_2: buyer.address2,
          admin_area_2: buyer.city,
          admin_area_1: buyer.state,
          postal_code: buyer.zip,
          country_code: buyer.country,
        }
      },
      application_context: {
        shipping_preference: 'SET_PROVIDED_ADDRESS',
      },
    }),
  });
  const data = await response.json();
  res.json(data);
});

// Route to capture a PayPal order
app.post('/api/capture-paypal-order', async (req, res) => {
  const { orderID } = req.body;
  const accessToken = await getPayPalAccessToken();
  // Make a POST request to PayPal to capture the order
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


