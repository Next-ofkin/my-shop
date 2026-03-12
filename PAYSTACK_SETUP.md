# Paystack Setup Guide

## Step 1: Create Paystack Account

1. Go to https://paystack.com
2. Sign up for a free account
3. Complete your business verification (for live mode)
4. For testing, you can use test mode immediately

## Step 2: Get API Keys

1. Login to your Paystack Dashboard
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy your **Test Secret Key** (starts with `sk_test_`)
4. Copy your **Test Public Key** (starts with `pk_test_`)

## Step 3: Add Environment Variables to Railway

Go to Railway Dashboard → Your Project → Variables, add:

```
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

## Step 4: Configure Webhook

In Paystack Dashboard:

1. Go to **Settings** → **API Keys & Webhooks**
2. Set **Webhook URL** to:
   ```
   https://server-production-28c7.up.railway.app/paystack/webhook
   ```
3. Click **Save**

## Step 5: Configure Multi-Currency in Admin

1. Go to your Admin Dashboard:
   ```
   https://server-production-28c7.up.railway.app/dashboard
   ```

2. Go to **Settings** → **Channels**
3. Click on **Default Channel**
4. Set:
   - **Default Currency**: USD (or NGN)
   - **Available Currencies**: USD, NGN
   - **Default Language**: en

5. Click **Update**

## Step 6: Add Paystack Payment Method

1. Go to **Settings** → **Payment Methods**
2. Click **Create Payment Method**
3. Set:
   - **Name**: Paystack
   - **Code**: paystack
   - **Enabled**: ✓ Yes
   - **Handler**: Paystack Payment
   - **Channels**: Default Channel

4. Click **Create**

## Step 7: Set Product Prices in Both Currencies

1. Go to **Catalog** → **Products**
2. Edit a product
3. Go to **Variants** tab
4. For each variant, set prices:
   - **USD**: $10.00
   - **NGN**: ₦15,000

5. Click **Update**

## Testing Paystack

### Test Cards (provided by Paystack)

Use these test card numbers:

| Card Number | CVV | Expiry | PIN | OTP | Result |
|-------------|-----|--------|-----|-----|--------|
| 4084084084084081 | 408 | 12/25 | 12312 | 12345 | Success |
| 507850785078507812 | 081 | 12/25 | 1234 | 12345 | Success (VISA) |

### Test Bank Account

For bank transfer testing:
- Select "Pay with Bank"
- Use any valid Nigerian bank
- Use test account numbers provided in Paystack docs

## Going Live

When ready for production:

1. Complete Paystack business verification
2. Switch to **Live Mode** in Paystack Dashboard
3. Copy **Live Keys** (starts with `sk_live_` and `pk_live_`)
4. Update Railway environment variables with live keys
5. Redeploy

## Troubleshooting

### Webhook not receiving events?
- Check the webhook URL is correct
- Check Railway logs for errors
- Ensure the server is running

### Payment not appearing?
- Check that the order currency matches Paystack supported currencies
- Verify the payment method is enabled for the channel
- Check Railway logs for API errors

### Currency not showing?
- Ensure both USD and NGN are in the Channel's available currencies
- Set default currency
- Clear browser cache

## Support

- Paystack Docs: https://paystack.com/docs
- Vendure Docs: https://docs.vendure.io
