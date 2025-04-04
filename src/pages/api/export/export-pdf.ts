import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

const exportPdf = async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // The URL of the customers page to be rendered
  const url = 'http://localhost:3000/budget-view'; // Use your production URL here

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Set PDF options (with pagination if the content overflows the page)
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    footerTemplate: `<span style="font-size: 10px; color: #000000; margin-left: 20px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>`,
    margin: {
      top: '50px',
      bottom: '50px',
      left: '40px',
      right: '40px',
    },
  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=customers.pdf');
  res.send(pdfBuffer);
};

export default exportPdf;
