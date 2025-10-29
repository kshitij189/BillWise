import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import invoiceRoutes from './routes/invoices.js';
import clientRoutes from './routes/clients.js';
import userRoutes from './routes/userRoutes.js';
import profile from './routes/profile.js';
import pdfTemplate from './documents/index.js';
import emailTemplate from './documents/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/invoices', invoiceRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profile);

// NODEMAILER TRANSPORT
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// PUPPETEER PDF GENERATOR
async function generatePDF(htmlContent, filename = 'invoice.pdf') {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfPath = join(__dirname, filename);
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();
  return pdfPath;
}

// SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', async (req, res) => {
  const { email, company } = req.body;

  try {
    const pdfPath = await generatePDF(pdfTemplate(req.body));

    await transporter.sendMail({
      from: `BillWise <hello@billwise.com>`,
      to: email,
      replyTo: company.email,
      subject: `Invoice from ${company.businessName || company.name}`,
      text: `Invoice from ${company.businessName || company.name}`,
      html: emailTemplate(req.body),
      attachments: [
        {
          filename: 'invoice.pdf',
          path: pdfPath
        }
      ]
    });

    res.status(200).send({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send invoice' });
  }
});

// CREATE PDF ONLY
app.post('/create-pdf', async (req, res) => {
  try {
    const pdfPath = await generatePDF(pdfTemplate(req.body));
    res.status(200).send({ message: 'PDF created', path: pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create PDF' });
  }
});

// FETCH PDF
app.get('/fetch-pdf', (req, res) => {
  const pdfPath = join(__dirname, 'invoice.pdf');
  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).send({ message: 'PDF not found' });
  }
});

app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING');
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));

// Mongoose 8 no longer requires these
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
