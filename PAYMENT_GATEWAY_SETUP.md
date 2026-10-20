# Indian Payment Gateway Setup Guide: Razorpay & UPI for SmartBanao

SmartBanao incorporates a production-grade Indian payment gateway flow designed for Razorpay and UPI.

---

## 1. Gateway Security Architecture

SmartBanao enforces strict security principles:
1. **Never trust client prices**: The frontend submits only product/bundle IDs. The backend validates prices directly against the database before creating an order.
2. **Never trust client payment status**: Access is never granted based on redirect queries or URL parameters.
3. **Cryptographic Server-Side Signature Validation**:
   - Order ID and Payment ID are verified using HMAC SHA-256 against `RAZORPAY_KEY_SECRET`.
   - `crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')`
4. **Idempotent Webhook Processing**: Repeated delivery of webhooks does not duplicate order fulfillment or grant access multiple times.

---

## 2. Obtain Razorpay API Credentials

1. Sign up or log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch between **Test Mode** (for development) and **Live Mode** (for production).
3. Navigate to **Settings** -> **API Keys**.
4. Click **Generate Key**.
5. Save both values:
   - `Key ID` (e.g. `rzp_test_...` or `rzp_live_...`)
   - `Key Secret` (Keep confidential on the server!)

---

## 3. Configure Webhooks in Razorpay

To ensure instant fulfillment even if a user closes their browser window after paying with UPI:

1. In Razorpay Dashboard, go to **Settings** -> **Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL**: `https://your-domain.com/api/payments/webhook`
4. **Secret**: Enter a secure random string (save as `RAZORPAY_WEBHOOK_SECRET` in `.env`).
5. **Active Events**: Select:
   - `payment.captured`
   - `order.paid`
6. Click **Save Webhook**.

---

## 4. Test Payment Credentials

In Test Mode, you can verify transactions using:
- **UPI**: Any dummy Virtual Payment Address (e.g. `success@razorpay` or `smartbanao@okhdfcbank`).
- **Cards**: Razorpay test card numbers (e.g. `4111 1111 1111 1111`, CVV: `123`, Expiry: future date, OTP: `123456`).

---

## 5. Environment Variables in `.env`

```env
RAZORPAY_KEY_ID="rzp_test_your_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```
