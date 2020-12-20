// require('dotenv').config();
// const puppeteer = require('puppeteer');

// (async () => {
//   let data = '';
//   const today = new Date();
//   const preLastDayOfMonth =
//     new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - 1;
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(process.env.URL);
//   await page.type('#password', process.env.LOGIN_PASS);
//   await page.click('.searchButton');

//   await page.waitForNavigation();
//   await page.waitForSelector('.bills');

//   const isNewRentAvailable = await page.$$eval(
//     '.activeScreen .bills',
//     (items) => items.length > 1,
//   );

//   if (isNewRentAvailable) {
//     data = await page.$$eval('.activeScreen .bills', (items) => {
//       return items.map((item) =>
//         item.textContent
//           .trim()
//           .split('\n')
//           .map((e) => e.trim())
//           .filter(Boolean),
//       );
//     });
//   }

//   const output = isNewRentAvailable ? formatOutput(data) : 'No rent';
//   const lastCallEmailData = `You haven't paid the rent yet.\n Please check it manually at
//     <a href="${process.env.URL}">${process.env.URL}</a>
//     `;
//   console.log(output);
//   await browser.close();
//   return isNewRentAvailable
//     ? sendMail(output)
//     : today.getDate() === preLastDayOfMonth
//     ? sendMail(lastCallEmailData)
//     : 'No rent';
// })();

// function formatOutput(rentData) {
//   return (
//     '---------------------\n|' +
//     rentData
//       .map((line) => line.join(' - '))
//       .join('|\n---------------------\n|') +
//     '|\n---------------------\n' +
//     `Pay at: <a href="${process.env.URL}">${process.env.URL}</a>`
//   );
// }
