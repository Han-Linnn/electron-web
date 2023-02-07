import { puppeteer } from '@/utils/utils';
import { setBrowserPage } from '../PageSet';

const getZhilianAddress = async (cookies) => {
  try {
    const addressDict = {};
    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    await setBrowserPage(page);

    // 携带cookies访问地址爬虫接口
    await page.setCookie(...cookies);
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      const data1 = {
        url: 'https://rd6.zhaopin.com/api/job/publish/recommendAddressList',
        method: 'POST',
      };
      interceptedRequest.continue(data1);
    });

    // 爬取地址信息，并拼接成JSON对象
    await page.goto('https://rd6.zhaopin.com/api/job/publish/recommendAddressList', {
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('body > pre');
    const tempAddress = await page.evaluate(() => {
      return document.querySelector('body > pre').innerHTML;
    });
    const list = JSON.parse(tempAddress);
    list.data.forEach((item, index) => {
      const addressData = {};
      addressData.text = item.allAddress;
      addressData.address = item;
      addressDict[index] = addressData;
    });
    console.log('getZhilianAddress', addressDict);
    await page.close();
    await browser.close();
    return addressDict;
  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    return {};
  }
};

export default getZhilianAddress;
