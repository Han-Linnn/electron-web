import xml2js from 'xml2js';
import { puppeteer } from '@/utils/utils';
import { setBrowserPage } from '../PageSet';

const get51Address = async (cookies) => {
  try {
    let addressDict = {};
    const addressParsing = (adsList) => {
      const xmlParser = new xml2js.Parser({ explicitArray: false });
      const addressList = [];
      const tempAddress = {};

      const tempValue = adsList.replace(/<!\[CDATA\[|]]>|<xmlroot>|<\/xmlroot>/g, '');
      xmlParser.parseString(tempValue, (err, result) => {
        if (result.returninfo.workaddress instanceof Array) {
          result.returninfo.workaddress.forEach((item) => {
            addressList.push({
              address: item,
              text: item.areaname + decodeURI(item.address),
            });
          });
        } else {
          addressList.push({
            address: result.returninfo.workaddress,
            text:
              result.returninfo.workaddress.areaname +
              decodeURI(result.returninfo.workaddress.address),
          });
        }

        if (addressList.length > 0) {
          addressList.forEach((item) => {
            tempAddress[item?.address.id] = item;
          });
        }
      });
      return tempAddress;
    };

    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    await setBrowserPage(page);

    // 携带cookies访问地址爬虫接口
    await page.setCookie(...cookies);
    await page.setRequestInterception(true);

    // 拦截请求
    await page.on('request', (interceptedRequest) => {
      // const formData = new FormData();
      // formData.append('dotype', 'GetWorkAddress');
      // formData.append('returns', 10);
      // formData.append('pageindex', 1);
      const data1 = {
        method: 'POST'
      };
      interceptedRequest.continue(data1);
    });
    // 拦截返回值
    await page.on('response', async (response) => {
      if (response.url() === "https://ehire.51job.com/ajax/Jobs/GlobalJobsAjax.ashx?dotype=GetWorkAddress&returns=10&pageindex=1") {
        console.log('XHR response received');
        const result = await response.text();
        addressDict = addressParsing(result);
      }
    });

    // 请求地址
    await page.goto('https://ehire.51job.com/ajax/Jobs/GlobalJobsAjax.ashx?dotype=GetWorkAddress&returns=10&pageindex=1', {
      waitUntil: 'networkidle0',
    });
    console.log('get51nAddress', addressDict);
    await page.close();
    await browser.close();
    return addressDict;

  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    return {};
  }
};

export default get51Address;
