const nodemailer = require('nodemailer');
const { BrevoClient } = require('@getbrevo/brevo');
const env = require('../config/env');
const logger = require('../utils/logger');

let transporter;
let brevoApi;

/* =========================================================
   HELPERS
========================================================= */

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;

const mailIdentity = {
  name: env.BUSINESS_NAME,
  address: env.MAIL_FROM || env.BREVO_SENDER_EMAIL,
};

/* =========================================================
   SMTP TRANSPORTER
========================================================= */

const getTransporter = () => {
  if (!env.MAIL_HOST || !env.MAIL_USER || !env.MAIL_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }

  return transporter;
};

/* =========================================================
   BREVO API
========================================================= */

const getBrevoApi = () => {
  if (!env.BREVO_API_KEY) {
    return null;
  }

  if (!brevoApi) {
    brevoApi = new BrevoClient({
      apiKey: env.BREVO_API_KEY,
    });
  }

  return brevoApi;
};

/* =========================================================
   SEND EMAIL VIA BREVO
========================================================= */

const sendEmailViaBrevo = async ({
  to,
  subject,
  text,
  html,
}) => {
  const brevo = getBrevoApi();

  if (!brevo) {
    return false;
  }

  const recipientList = Array.isArray(to)
    ? to.map((recipient) => ({
        email: recipient.email || recipient,
        name: recipient.name || 'Customer',
      }))
    : [
        {
          email: to.email || to,
          name: to.name || 'Customer',
        },
      ];

  const senderEmail =
    env.BREVO_SENDER_EMAIL ||
    env.MAIL_FROM ||
    env.MAIL_USER;

  const senderName =
    env.BREVO_SENDER_NAME ||
    env.BUSINESS_NAME;

  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: senderEmail,
      name: senderName,
    },

    to: recipientList,

    replyTo: env.MAIL_REPLY_TO
      ? {
          email: env.MAIL_REPLY_TO,
          name: env.BUSINESS_NAME,
        }
      : undefined,

    subject,
    textContent: text,
    htmlContent: html,
  });

  return true;
};

/* =========================================================
   GENERIC SEND EMAIL
========================================================= */

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  // Prefer Brevo
  if (env.BREVO_API_KEY) {
    const sent = await sendEmailViaBrevo({
      to,
      subject,
      text,
      html,
    });

    if (sent) {
      return;
    }
  }

  // SMTP fallback
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    logger.warn(
      'Email skipped: no configured SMTP or Brevo credentials.'
    );
    return;
  }

  await mailTransporter.sendMail({
    from: mailIdentity,
    replyTo: env.MAIL_REPLY_TO,
    to,
    subject,
    text,
    html,
  });
};

/* =========================================================
   ORDER ITEMS HTML
========================================================= */

const renderItems = (items) =>
  items.map((item) => `
    <tr>
      <td style="
        padding:16px 0;
        border-bottom:1px solid #e9e4dc;
      ">
        <strong style="color:#24221f;">
          ${escapeHtml(item.productName)}
        </strong>

        <div style="
          color:#81796f;
          font-size:13px;
          margin-top:5px;
        ">
          Qty: ${item.quantity}

          ${
            item.selectedSize
              ? ` &nbsp;|&nbsp; Size: ${escapeHtml(item.selectedSize)}`
              : ''
          }

          ${
            item.selectedColor
              ? ` &nbsp;|&nbsp; Color: ${escapeHtml(item.selectedColor)}`
              : ''
          }
        </div>
      </td>

      <td style="
        padding:16px 0;
        border-bottom:1px solid #e9e4dc;
        text-align:right;
        white-space:nowrap;
        color:#24221f;
      ">
        ${formatCurrency(item.subtotal)}
      </td>
    </tr>
  `).join('');

/* =========================================================
   CUSTOMER ORDER CONFIRMATION EMAIL
========================================================= */

const sendOrderConfirmationEmail = async (order) => {
  const customer = order.customer;

  const orderNumber =
    order.orderReference || String(order._id);

  const orderDate = new Date(
    order.createdAt || Date.now()
  ).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const address = [
    customer.address,
    customer.city,
    customer.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  const html = `
<!doctype html>
<html>
<body style="
  margin:0;
  background:#f4f1ec;
  color:#24221f;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:620px;
    margin:0 auto;
    padding:32px 16px;
  ">

    <div style="
      background:#24221f;
      padding:28px 32px;
      color:#fff;
    ">

      <div style="
        font-size:12px;
        letter-spacing:3px;
        text-transform:uppercase;
        color:#d9b98c;
      ">
        ${escapeHtml(env.BUSINESS_NAME)}
      </div>

      <h1 style="
        font-family:Georgia,serif;
        font-size:30px;
        font-weight:normal;
        margin:18px 0 4px;
      ">
        Thank you for your order
      </h1>

      <p style="
        color:#d8d1c8;
        margin:0;
        font-size:14px;
      ">
        We are preparing your pieces with care.
      </p>

    </div>

    <div style="
      background:#fff;
      padding:30px 32px;
    ">

      <p style="
        font-size:16px;
        margin:0 0 22px;
      ">
        Hello ${escapeHtml(customer.name)},
      </p>

      <p style="
        color:#625b53;
        line-height:1.6;
        margin:0 0 24px;
      ">
        Your order has been received successfully.
        Here are the details for your records.
      </p>

      <div style="
        background:#f8f6f2;
        padding:16px 18px;
        margin-bottom:26px;
        font-size:13px;
        color:#625b53;
      ">

        <strong style="color:#24221f;">
          Order #${escapeHtml(orderNumber)}
        </strong>

        <br>

        ${escapeHtml(orderDate)}

      </div>

      <table
        role="presentation"
        style="
          width:100%;
          border-collapse:collapse;
        "
      >
        <tbody>
          ${renderItems(order.items)}
        </tbody>
      </table>

      <table
        role="presentation"
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:18px;
          font-size:14px;
        "
      >

        <tr>
          <td style="
            padding:6px 0;
            color:#81796f;
          ">
            Subtotal
          </td>

          <td style="
            padding:6px 0;
            text-align:right;
          ">
            ${formatCurrency(order.subtotal)}
          </td>
        </tr>

        <tr>
          <td style="
            padding:6px 0;
            color:#81796f;
          ">
            Delivery
          </td>

          <td style="
            padding:6px 0;
            text-align:right;
          ">
            ${formatCurrency(order.deliveryCharges)}
          </td>
        </tr>

        <tr>
          <td style="
            padding:14px 0 0;
            border-top:1px solid #24221f;
            font-weight:bold;
            font-size:16px;
          ">
            Total
          </td>

          <td style="
            padding:14px 0 0;
            border-top:1px solid #24221f;
            text-align:right;
            font-weight:bold;
            font-size:16px;
          ">
            ${formatCurrency(order.total)}
          </td>
        </tr>

      </table>

      <div style="
        border-top:1px solid #e9e4dc;
        margin-top:28px;
        padding-top:22px;
        color:#625b53;
        font-size:14px;
        line-height:1.7;
      ">

        <strong style="color:#24221f;">
          Delivery details
        </strong>

        <br>

        ${escapeHtml(address)}

        <br>

        ${escapeHtml(customer.phone)}

      </div>

    </div>

    <p style="
      text-align:center;
      color:#81796f;
      font-size:12px;
      line-height:1.6;
      padding:12px 20px;
    ">
      This is an automated confirmation from
      ${escapeHtml(env.BUSINESS_NAME)}.
      Please keep this email for your records.
    </p>

  </div>

</body>
</html>
`;

  try {
    await sendEmail({
      to: customer.email,

      subject:
        `Order confirmation #${orderNumber} | ${env.BUSINESS_NAME}`,

      text:
        `Thank you for your order, ${customer.name}. ` +
        `Order #${orderNumber} total: ${formatCurrency(order.total)}. ` +
        `Track your order at ${env.CLIENT_URL}/tracking.`,

      html,
    });

    logger.info(
      `Order confirmation email sent for order ${orderNumber}.`
    );
  } catch (error) {
    logger.error(
      `Order confirmation email failed for order ${orderNumber}: ${error.message}`
    );
  }
};

/* =========================================================
   ADMIN / OWNER NEW ORDER EMAIL
========================================================= */

const sendAdminNewOrderEmail = async (order) => {
  /*
   * IMPORTANT:
   * Use ADMIN_EMAIL from env.js.
   *
   * env.js already contains:
   * ADMIN_EMAIL: process.env.ADMIN_EMAIL
   */
  const notificationEmail = env.ADMIN_EMAIL;

  if (!notificationEmail) {
    logger.warn(
      `Admin order email skipped for order ${
        order.orderReference || order._id
      }: ADMIN_EMAIL is not configured.`
    );

    return;
  }

  const customer = order.customer;

  const orderNumber =
    order.orderReference || String(order._id);

  const orderDate = new Date(
    order.createdAt || Date.now()
  ).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const address = [
    customer.address,
    customer.city,
    customer.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  const itemsHtml = order.items.map((item) => `
    <tr>

      <td style="
        padding:12px 8px;
        border-bottom:1px solid #e9e4dc;
      ">

        <strong>
          ${escapeHtml(item.productName)}
        </strong>

        <div style="
          font-size:12px;
          color:#81796f;
          margin-top:4px;
        ">
          Qty: ${item.quantity}

          ${
            item.selectedSize
              ? ` | Size: ${escapeHtml(item.selectedSize)}`
              : ''
          }

          ${
            item.selectedColor
              ? ` | Color: ${escapeHtml(item.selectedColor)}`
              : ''
          }
        </div>

      </td>

      <td style="
        padding:12px 8px;
        border-bottom:1px solid #e9e4dc;
        text-align:right;
      ">
        ${formatCurrency(item.subtotal)}
      </td>

    </tr>
  `).join('');

  const html = `
<!doctype html>
<html>
<body style="
  margin:0;
  background:#f4f1ec;
  color:#24221f;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:680px;
    margin:0 auto;
    padding:32px 16px;
  ">

    <div style="
      background:#24221f;
      padding:28px 32px;
      color:#fff;
    ">

      <div style="
        font-size:12px;
        letter-spacing:3px;
        text-transform:uppercase;
        color:#d9b98c;
      ">
        ${escapeHtml(env.BUSINESS_NAME)}
      </div>

      <h1 style="
        font-family:Georgia,serif;
        font-size:30px;
        font-weight:normal;
        margin:18px 0 4px;
      ">
        New Order Received
      </h1>

      <p style="
        color:#d8d1c8;
        margin:0;
        font-size:14px;
      ">
        Order #${escapeHtml(orderNumber)}
      </p>

    </div>

    <div style="
      background:#fff;
      padding:30px 32px;
    ">

      <div style="
        background:#f8f6f2;
        padding:18px;
        margin-bottom:24px;
      ">

        <strong style="font-size:18px;">
          New order placed
        </strong>

        <div style="
          color:#625b53;
          font-size:13px;
          margin-top:6px;
        ">
          ${escapeHtml(orderDate)}
        </div>

      </div>

      <h2 style="
        font-size:18px;
        margin:0 0 14px;
      ">
        Customer Details
      </h2>

      <div style="
        color:#625b53;
        font-size:14px;
        line-height:1.8;
        margin-bottom:28px;
      ">

        <strong style="color:#24221f;">
          ${escapeHtml(customer.name)}
        </strong>

        <br>

        Email:
        ${escapeHtml(customer.email)}

        <br>

        Phone:
        ${escapeHtml(customer.phone)}

        <br>

        Address:
        ${escapeHtml(address)}

      </div>

      <h2 style="
        font-size:18px;
        margin:0 0 14px;
      ">
        Order Items
      </h2>

      <table
        role="presentation"
        style="
          width:100%;
          border-collapse:collapse;
          font-size:14px;
        "
      >
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table
        role="presentation"
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:18px;
          font-size:14px;
        "
      >

        <tr>
          <td style="
            padding:6px 0;
            color:#81796f;
          ">
            Subtotal
          </td>

          <td style="
            padding:6px 0;
            text-align:right;
          ">
            ${formatCurrency(order.subtotal)}
          </td>
        </tr>

        <tr>
          <td style="
            padding:6px 0;
            color:#81796f;
          ">
            Delivery
          </td>

          <td style="
            padding:6px 0;
            text-align:right;
          ">
            ${formatCurrency(order.deliveryCharges)}
          </td>
        </tr>

        <tr>
          <td style="
            padding:14px 0 0;
            border-top:1px solid #24221f;
            font-weight:bold;
            font-size:18px;
          ">
            Total
          </td>

          <td style="
            padding:14px 0 0;
            border-top:1px solid #24221f;
            text-align:right;
            font-weight:bold;
            font-size:18px;
          ">
            ${formatCurrency(order.total)}
          </td>
        </tr>

      </table>

      <div style="
        margin-top:28px;
        padding-top:22px;
        border-top:1px solid #e9e4dc;
      ">

        <strong>
          Order Status:
        </strong>

        <span style="text-transform:capitalize;">
          ${escapeHtml(order.status)}
        </span>

      </div>

    </div>

    <p style="
      text-align:center;
      color:#81796f;
      font-size:12px;
      padding:12px 20px;
    ">
      Automated new-order notification from
      ${escapeHtml(env.BUSINESS_NAME)}.
    </p>

  </div>

</body>
</html>
`;

  const text = `
New order received - ${orderNumber}

Customer:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${address}

Order items:
${order.items
  .map(
    (item) =>
      `${item.productName} x ${item.quantity} - ${formatCurrency(
        item.subtotal
      )}`
  )
  .join('\n')}

Subtotal: ${formatCurrency(order.subtotal)}
Delivery: ${formatCurrency(order.deliveryCharges)}
Total: ${formatCurrency(order.total)}

Status: ${order.status}

Order placed: ${orderDate}
`.trim();

  try {
    await sendEmail({
      to: notificationEmail,

      subject:
        `New Order #${orderNumber} | ${env.BUSINESS_NAME}`,

      text,

      html,
    });

    logger.info(
      `Admin new-order email sent for order ${orderNumber} to ${notificationEmail}.`
    );
  } catch (error) {
    logger.error(
      `Admin new-order email failed for order ${orderNumber}: ${error.message}`
    );
  }
};

/* =========================================================
   CUSTOMER ORDER STATUS EMAIL
========================================================= */

const sendOrderStatusEmail = async (
  order,
  previousStatus
) => {
  const orderNumber =
    order.orderReference || String(order._id);

  const statusLabel =
    order.status.charAt(0).toUpperCase() +
    order.status.slice(1);

  const statusMessage = {
    confirmed:
      'We have confirmed your order and will begin preparing it shortly.',

    processing:
      'Your order is now being carefully prepared for dispatch. We will send tracking details once it has shipped.',

    shipped:
      'Your order has been handed to the courier and is now on its way to you.',

    delivered:
      'Your order has been delivered. We hope you enjoy your purchase.',

    cancelled:
      'Your order has been cancelled. Please contact us if you need assistance.',
  }[order.status] ||
    `Your order status has changed from ${previousStatus} to ${order.status}.`;

  const isShipped =
    order.status === 'shipped';

  const trackingLine =
    isShipped && order.trackingCode
      ? `
        <p style="
          background:#f8f6f2;
          padding:16px 18px;
          margin:24px 0 0;
        ">

          <strong>
            ${escapeHtml(order.courierName || 'Courier')}
            tracking details
          </strong>

          <br>

          <span style="
            font-size:20px;
            letter-spacing:2px;
          ">
            ${escapeHtml(order.trackingCode)}
          </span>

          <br>

          <span style="
            color:#625b53;
            font-size:13px;
          ">
            Use this number on the courier's tracking website.
          </span>

        </p>
      `
      : '';

  const trackingUrl =
    `${env.CLIENT_URL}/tracking`;

  const trackingText =
    isShipped
      ? ` Courier: ${
          order.courierName || 'Courier'
        }. Tracking number: ${
          order.trackingCode
        }. Track it at ${trackingUrl}`
      : '';

  const text =
    `Hello ${order.customer.name}, ` +
    `${statusMessage} ` +
    `Order #${orderNumber}.${trackingText}`;

  const trackingButton =
    isShipped
      ? `
        <p style="margin-top:28px;">
          <a
            href="${escapeHtml(trackingUrl)}"
            style="
              display:inline-block;
              background:#24221f;
              color:#fff;
              padding:13px 20px;
              text-decoration:none;
            "
          >
            Track your order
          </a>
        </p>
      `
      : '';

  const html = `
<!doctype html>
<html>
<body style="
  margin:0;
  background:#f4f1ec;
  font-family:Arial,sans-serif;
  color:#24221f;
">

  <div style="
    max-width:620px;
    margin:0 auto;
    padding:32px 16px;
  ">

    <div style="
      background:#24221f;
      padding:28px 32px;
      color:#fff;
    ">

      <div style="
        font-size:12px;
        letter-spacing:3px;
        text-transform:uppercase;
        color:#d9b98c;
      ">
        ${escapeHtml(env.BUSINESS_NAME)}
      </div>

      <h1 style="
        font-family:Georgia,serif;
        font-size:30px;
        font-weight:normal;
        margin:18px 0 4px;
      ">
        Your order is ${escapeHtml(statusLabel)}
      </h1>

      <p style="
        color:#d8d1c8;
        margin:0;
        font-size:14px;
      ">
        Order #${escapeHtml(orderNumber)}
      </p>

    </div>

    <div style="
      background:#fff;
      padding:30px 32px;
    ">

      <p style="font-size:16px;">
        Hello ${escapeHtml(order.customer.name)},
      </p>

      <p style="
        color:#625b53;
        line-height:1.6;
      ">
        ${escapeHtml(statusMessage)}
      </p>

      ${trackingLine}

      ${trackingButton}

    </div>

    <p style="
      text-align:center;
      color:#81796f;
      font-size:12px;
      padding:12px 20px;
    ">
      Thank you for choosing
      ${escapeHtml(env.BUSINESS_NAME)}.
    </p>

  </div>

</body>
</html>
`;

  try {
    await sendEmail({
      to: order.customer.email,

      subject:
        order.status === 'shipped'
          ? `Your order #${orderNumber} has shipped - tracking code included | ${env.BUSINESS_NAME}`
          : `Order #${orderNumber} is ${statusLabel} | ${env.BUSINESS_NAME}`,

      text,

      html,
    });

    logger.info(
      `Order status email sent for order ${orderNumber}.`
    );
  } catch (error) {
    logger.error(
      `Order status email failed for order ${orderNumber}: ${error.message}`
    );
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendOrderStatusEmail,
};