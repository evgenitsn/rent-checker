const chromeLambda = require('chrome-aws-lambda');
const aws = require('aws-sdk');
const ses = new aws.SES({ region: 'eu-central-1' });

exports.handler = async (event) => {
  let data = '';
  const today = new Date();
  // launch a headless browser
  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    executablePath: await chromeLambda.executablePath,
  });
  const page = await browser.newPage();
  await page.goto(process.env.URL);
  await page.type('#password', process.env.LOGIN_PASS);
  await page.click('.searchButton');

  await page.waitForNavigation();
  await page.waitForSelector('.bills');

  const isNewRentAvailable = await page.$$eval(
    '.activeScreen .bills',
    (items) => items.length > 1,
  );

  if (isNewRentAvailable) {
    data = await page.$$eval('.activeScreen .bills', (items) => {
      return items.map((item) =>
        item.textContent
          .trim()
          .split('\n')
          .map((e) => e.trim())
          .filter(Boolean),
      );
    });
  }

  const output = isNewRentAvailable ? formatOutput(data) : 'No rent';
  await browser.close();
  return isNewRentAvailable ? sendMail(output, today) : 'No rent';
};

function sendMail(body, todaysDate) {
  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },

      Subject: {
        Data: `New rent bill for ${
          todaysDate.getMonth() + 1
        }/${todaysDate.getFullYear()}`,
      },
    },
    Source: process.env.EMAIL,
  };

  return ses.sendEmail(params).promise();
}

function formatOutput(rentData) {
  return `Here is your rent for this month
---------------------
|${rentData
    .map((line) => line.join(' - '))
    .join('|\n---------------------\n|')}|
---------------------
Pay at: ${process.env.URL}`;
}
