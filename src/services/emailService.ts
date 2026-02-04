import nodemailer from 'nodemailer';

interface OrderData {
  email: string;
  customerName: string;
  orderId: string;
  orderDetails: {
    total: number;
    items: any[];
    subtotal: number;
    shipping: number;
  };
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmation = async (orderData: OrderData) => {
  const { email, customerName, orderId, orderDetails } = orderData;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - #${orderId.slice(-8)}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Hi ${customerName},</p>
      <p>Your order has been confirmed!</p>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> #${orderId.slice(-8)}</p>
      <p><strong>Total:</strong> $${orderDetails.total}</p>
      <p>Thank you for your purchase!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};