import { puppeteer } from '@/utils/utils';
import { setBrowserPage } from '../PageSet';
import { message } from 'antd';

const postZhiLianPosition = async (positionId, publishUrl, jobData, cookies) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    await setBrowserPage(page);
    await page.setCookie(...cookies);
    await page.setRequestInterception(true);
    await page.on('request', (interceptedRequest) => {
      const data = {
        url: publishUrl,
        method: 'POST',
        headers: {
          ...interceptedRequest.headers(),
          'Content-Type': 'application/json',
        },
        postData: JSON.stringify(jobData),
      };
      interceptedRequest.continue(data);
    });

    await page.goto(publishUrl, {
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('body > pre');
    const resquest = await page.evaluate(() => {
      return document.querySelector('body > pre').innerHTML;
    });

    const jsonResquest = JSON.parse(resquest);
    let returnData = null;
    if (jsonResquest.code === 200) {
      const { data } = jsonResquest;
      returnData = {
        channel_id: 2,
        position_id: positionId,
        status: true,
        msg: data[0]?.message,
        third_position_id: data[0]?.jobNumber,
      };
    } else {
      message.warning(jsonResquest.message);
    }
    // await page.close();
    // await browser.close();
    return returnData;
  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    message.warning('职位发布失败,请重试');
    return null;
  }
};
export default postZhiLianPosition;
