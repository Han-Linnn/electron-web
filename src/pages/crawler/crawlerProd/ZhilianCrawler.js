/* eslint-disable no-await-in-loop */
import { puppeteer, fs, os } from '@/utils/utils';
import { getRandom, setBrowserPage } from '../PageSet';
import path from 'path';
import getFile from './getFile';
import { message } from 'antd';
// import schedule from 'node-schedule';

export const ZhilianCrawler = async (data) => {
  // const download = (uri, filename, callback) => {
  //   return new Promise(function (resolve, reject) {
  //     request.head(uri, function (err, res, body) {
  //       if (!err && res.statusCode === 200) {
  //         console.log('content-type:', res.headers['content-type']);
  //         console.log('content-length:', res.headers['content-length']);

  //         request(uri)
  //           .pipe(fs.createWriteStream(filename))
  //           .on('error', function (response) {
  //             console.log(err);
  //             reject(new Error(err));
  //           })
  //           .on('close', function () {
  //             callback();
  //             resolve();
  //           });
  //       } else {
  //         reject(new Error(err));
  //       }
  //     });
  //   });
  // }
  const sleep = (seconds) =>
    new Promise((resolve) => {
      setTimeout(resolve, seconds);
    });

  // 设置监听文件是否已下载，下载完成后关闭监听
  const checkExistsWithTimeout = (filePath, timeout) => {
    return new Promise((resolve, reject) => {
      const dir = path.dirname(filePath);
      const basename = path.basename(filePath);
      // console.log('文件名', basename);
      const watcher = fs.watch(dir, (eventType, filename) => {
        if (eventType === 'rename' && filename === basename) {
          clearTimeout(
            setTimeout(() => {
              watcher.close();
              reject(new Error('File did not exists and was not created during the timeout.'));
            }, timeout),
          );
          watcher.close();
          // console.log('xxxxxxxx');
          resolve();
        }
      });

      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (!err) {
          clearTimeout(
            setTimeout(() => {
              watcher.close();
              reject(new Error('File did not exists and was not created during the timeout.'));
            }, timeout),
          );
          watcher.close();
          // console.log('uyyyyyyyyyyyyyy');
          resolve();
        }
      });
    });
  };

  // 检查文件下载情况
  const checkFile = (fileOath) => {
    return new Promise((resolve, reject) => {
      fs.access(fileOath, fs.F_OK, (err) => {
        if (err) {
          reject(new Error(err));
        }

        // file exists
        // console.log('File exists');
        resolve();
      });
    });
  };

  // 删除文件
  const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(new Error('File did not delete.'));
          throw err;
        } else {
          // console.log('删除成功');
          resolve();
        }
      });
    });
  };

  const concatFileName = () => {
    const date = new Date();
    let hours = date.getHours('chinese', { hour12: false });
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes('chinese', { hour12: false });
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const year = date.getFullYear().toString();
    const fileDateName = year + month + day + hours + minutes;

    return fileDateName;
  };

  // ------------------------------------------------------------------这里开始智联爬取流程---------------------------------------------------------------------- //
  // 打开浏览器，新开页面
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
  });
  const page = await browser.newPage();
  await setBrowserPage(page);

  // 携带cookies登录
  await page.setCookie(...data.cookies);
  await page.goto('https://rd6.zhaopin.com/', { waitUntil: 'networkidle0' });

  // 页面未重定向到登录页面，则登录成功执行爬虫操作
  const getUrl = await page.url();

  if (getUrl === 'https://rd6.zhaopin.com/') {
    await page.waitForSelector('#root > div.app-nav > div.app-nav__body > div:nth-child(5) > a', {
      timeout: 0,
    });
    await page.waitFor(getRandom(500, 1000));
    await page.goto('https://rd6.zhaopin.com/candidate?jobNumber=-1&tab=pending', {
      waitUntil: 'networkidle0',
    });

    // 获取简历列表最大页数
    const maxPage = await page.evaluate(() => {
      return Number(
        document.querySelector(
          '#root > div.app-main > div.app-main__content > div.page-candidate > div.resume-list > div.resume-list__pagination.km-pagination.km-pagination--small > div.km-pagination__pagers > a:nth-child(9)',
        ).innerText,
      );
    });
    console.log('---------最大页数是：', maxPage);

    for (let i = 2; i < maxPage + 2; i += 1) {
      await page.waitFor(1000);
      if (i > 2) {
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await page.waitFor(1000);
      }
      // 批量下载简历
      // 点击列表中第一个简历的选择框
      await page.waitForSelector(
        '#root > div.app-main > div.app-main__content > div.page-candidate > div.resume-list > div:nth-child(1) > div:nth-child(1) > div > div.resume-item__inner > div.km-checkbox.km-control.km-checkbox--primary.km-checkbox--small > div',
      );
      await page.click(
        '#root > div.app-main > div.app-main__content > div.page-candidate > div.resume-list > div:nth-child(1) > div:nth-child(1) > div > div.resume-item__inner > div.km-checkbox.km-control.km-checkbox--primary.km-checkbox--small > div',
      );
      await page.waitFor(getRandom(500, 1000));
      // 点击全选框（页面底部弹出）
      await page.waitForSelector(
        '#root > div.app-main > div.footer-action-bar.sticky-pane.sticky-pane--bottom-stuck.page-action-bar > div.footer-action-bar__inner',
      );
      await page.click(
        '#root > div.app-main > div.footer-action-bar.sticky-pane.sticky-pane--bottom-stuck.page-action-bar > div.footer-action-bar__inner > div.footer-action-bar__front > div.km-checkbox.km-control.km-checkbox--primary.km-checkbox--small > div.km-checkbox__icon',
      );
      await page.waitFor(1000);
      // 点击简历下载按钮（点击后弹出下载选项悬浮窗）
      await page.click(
        '#root > div.app-main > div.footer-action-bar.sticky-pane.sticky-pane--bottom-stuck.page-action-bar > div.footer-action-bar__inner > div.footer-action-bar__end > div.save-button.action-buttons.is-mr-32 > span:nth-child(2)',
      );
      await page.waitFor(getRandom(500, 1000));
      // 选择pdf版下载
      await page.click(
        'body > div.km-modal__wrapper.save-resume > div > div.km-modal__body > div.file-list > div:nth-child(2)',
      );
      await page.waitFor(getRandom(500, 1000));
      // 点击确认
      // (async () => {
      for (let z = 0; z < 61; z += 1) {
        const date = new Date();
        if (z > 0) {
          await sleep(1000);
        }
        // console.log('当前秒数：', date.getSeconds());
        if (date.getSeconds() < 10 && date.getSeconds() > 0) {
          await page.click(
            'body > div.km-modal__wrapper.save-resume > div > div.km-modal__footer > button.km-button.km-control.km-ripple-off.km-button--primary.km-button--filled.is-large > div',
          );
          const fileDateName = concatFileName();
          const dir = os.homedir().replace(/\\/g, '/');
          await checkExistsWithTimeout(`${dir}/Downloads/智联_${fileDateName}.zip`, 60000);
          await checkFile(`${dir}/Downloads/智联_${fileDateName}.zip`);
          const result = await getFile(`${dir}/Downloads/智联_${fileDateName}.zip`, 'zhilian');
          // console.log('返回11111', result);
          if (!result) {
            message.warning('接口出错！');
            // await browser.close();
          }
          await page.waitFor(2000);
          await deleteFile(`${dir}/Downloads/智联_${fileDateName}.zip`);
          await page.waitFor(1000);
          // console.log('跳出！');
          break;
        }
      }
      // console.log('哦豁~~~~');

      // })();

      // 构建监听的文件名（智联文件名为：智联_202108091425.zip）

      // await checkExistsWithTimeout(`${dir}/Downloads/智联_${fileDateName}.zip`, 60000);
      // await checkFile(`${dir}/Downloads/智联_${fileDateName}.zip`);
      // await page.waitFor(60000);
      // const result = await getFile(`${dir}/Downloads/智联_${fileDateName}.zip`, 'zhilian');
      // console.log('返回11111', result);
      // if (!result) {
      //   message.warning('接口出错！')
      //   // await browser.close();
      // }
      // await page.waitFor(2000);
      // await deleteFile(`${dir}/Downloads/智联_${fileDateName}.zip`);
      // await page.waitFor(1000);

      // 反爬虫操作,滚动页面
      await page.evaluate(() => {
        window.scrollTo(document.body.scrollWidth, document.body.scrollHeight);
      });
      await page.waitFor(1000);

      if (i === maxPage + 1) {
        // 爬虫到最后一页关闭浏览器
        await page.close();
        await browser.close();
      } else {
        // 翻页
        await page.waitForSelector(
          '#root > div.app-main > div.app-main__content > div.page-candidate > div.resume-list > div.resume-list__pagination.km-pagination.km-pagination--small > div.km-pagination__jumper > div > div > input',
        );
        await page.type(
          '#root > div.app-main > div.app-main__content > div.page-candidate > div.resume-list > div.resume-list__pagination.km-pagination.km-pagination--small > div.km-pagination__jumper > div > div > input',
          `${i}`,
          { delay: 100 },
        );
        await page.keyboard.press('Enter');
      }
    }
    return '成功';
  }
  await page.close();
  await browser.close();
  return '';
};
