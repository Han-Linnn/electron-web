'use strict';
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let imgArr = [];
  page.on('domcontentloaded', async () => {
    imgArr = await page.$$eval('img', (img) => {
      const arr = [];
      // 返回的是一个集合需要重新遍历
      for (let i = 0; i < img.length; i++) {
        const obj = {
          width: img[i].width,
          naturalWidth: img[i].naturalWidth,
          height: img[i].height,
          naturalHeight: img[i].naturalHeight,
          isStandard: !(
            img[i].width * 10 <= img[i].naturalWidth || img[i].height * 10 <= img[i].naturalHeight
          ),
          url: img[i].src,
          level: 3,
          imageUrl: img[i].src,
          describeUrl: '',
          summary: `为了显示${img[i].width}x${img[i].height}的图片引入了原尺寸为${img[i].naturalWidth}x${img[i].naturalHeight}的图片`,
        };
        if (obj.width && obj.height) {
          arr.push(obj);
        }
      }
      return arr;
    });
  });
  await page.goto('https://www.npmjs.com/package/puppeteer', { waitUntil: 'networkidle0' });
  // await browser.close();
  console.log('imgArr: ', imgArr);
})();
