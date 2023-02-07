/* eslint-disable no-await-in-loop */
import { puppeteer, fs, os } from '@/utils/utils';
import { getRandom, setBrowserPage } from '../PageSet';
import path from 'path';
import getFile from './getFile';

// const request = window.require('request');

export const Crawler51 = async (data) => {
  try {
    // const download = (uri, filename, callback) => {
    //   return new Promise((resolve, reject) => {
    //     request.head(uri, (err, res, body) => {
    //       if (!err && res.statusCode === 200) {
    //         console.log('content-type:', res.headers['content-type']);
    //         console.log('content-length:', res.headers['content-length']);

    //         request(uri)
    //           .pipe(fs.createWriteStream(filename))
    //           .on('error', (response) => {
    //             console.log(err);
    //             reject(new Error(err));
    //           })
    //           .on('close', () => {
    //             callback();
    //             resolve();
    //           });
    //       } else {
    //         reject(new Error(err));
    //       }
    //     });
    //   });
    // };

    // 设置监听文件是否已下载，下载完成后关闭监听
    const checkExistsWithTimeout = (filePath, timeout) => {
      return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath);
        const watcher = fs.watch(dir, (eventType, filename) => {
          if (eventType === 'rename' && filename === basename) {
            clearTimeout(
              setTimeout(() => {
                watcher.close();
                reject(new Error('File did not exists and was not created during the timeout.'));
              }, timeout),
            );
            watcher.close();
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
          console.log('File exists');
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
            console.log('删除成功');
            resolve();
          }
        });
      });
    };

    const concatFileName = () => {
      const date = new Date();
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      const year = date.getFullYear().toString();

      return year + month + day;
    };

    // -------------------------------------------------------------------这里开始前程爬取流程---------------------------------------------------------------------- //
    // 打开浏览器，新开页面
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    // 防检测脚本
    await setBrowserPage(page);

    // 当弹出新浏览器窗口时触发（下载简历时会弹出新窗口）
    browser.on('targetcreated', async () => {
      const page2 = (await browser.pages())[2];
      // const downloadUrl = page2.url();
      // page2.on('request', (interceptedRequest) => {
      //   if (interceptedRequest.url())
      // });
      const fileDateName = concatFileName();
      const dir = os.homedir().replace(/\\/g, '/');
      // await download(downloadUrl, `${__dirname}/前程无忧导出简历_${fileDateName}.zip`, function () {
      //   console.log('downloaded');
      // });
      // await page2.waitFor(5000);
      // const fileDateName = concatFileName();
      // await checkExistsWithTimeout(`${__dirname}/前程无忧导出简历_${fileDateName}.zip`, 30000,);
      // await checkFile(`${__dirname}/前程无忧导出简历_${fileDateName}.zip`);
      // await page2.waitFor(1000);
      // await getFile(`${__dirname}/前程无忧导出简历_${fileDateName}.zip`, '51job');
      // await page2.waitFor(1000);
      await checkExistsWithTimeout(`${dir}/Downloads/51job_导出简历_${fileDateName}.zip`, 30000);
      await checkFile(`${dir}/Downloads/51job_导出简历_${fileDateName}.zip`);
      await page2.waitFor(1000);
      await getFile(`${dir}/Downloads/51job_导出简历_${fileDateName}.zip`, '51job');
      await page2.waitFor(1000);
      await deleteFile(`${dir}/Downloads/51job_导出简历_${fileDateName}.zip`);
      await page2.waitFor(1000);
      await page2.close();
    });

    // 携带cookies登录
    await page.setCookie(...data.cookies);
    await page.goto('https://ehire.51job.com/Navigate.aspx', { waitUntil: 'networkidle0' });

    // 判断页面是否重定向到登录页面，若跳转到主页则cookie有效，执行爬虫操作
    const getUrl = await page.url();

    if (getUrl === 'https://ehire.51job.com/Navigate.aspx') {
      await page.waitFor(getRandom(500, 1000));
      await page.goto('https://ehire.51job.com/InboxResume/InboxRecentEngine.aspx', {
        waitUntil: 'networkidle0',
      });
      await page.waitFor(getRandom(200, 1000));

      // 获取最大页数
      const maxPage = await page.evaluate(() => {
        const maxElement = document.querySelector('#pagerBottomNew_btnNum_ma');
        if (maxElement) {
          return Number(document.querySelector('#pagerBottomNew_btnNum_ma').innerText);
        }
        return 1;
      });
      console.log('---------最大页数是：', maxPage);

      // 点击进入简历列表页
      await page.click('#ul_selectlist > li:nth-child(1) > label');
      await page.waitFor(getRandom(500, 1000));
      // 反爬虫操作,滚动页面
      await page.evaluate(() => {
        window.scroll(0, document.body.scrollHeight);
      });

      if (maxPage === 1) {
        // 只有一页时，单页下载简历
        // 反爬虫操作,滚动页面
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        // 下载操作
        await page.click(
          '#form1 > div.commonMain > div > div.fn-main.list-main > div.list-table-bot > ul > li:nth-child(3) > a',
        );
        await page.waitFor(getRandom(800, 1000));
        await page.click('#div_ExportBoxHtml > div > div:nth-child(2) > a:nth-child(1)');
      } else {
        // 多页时，翻页下载简历
        for (let i = 1; i < maxPage + 1; i += 1) {
          // 反爬虫操作,滚动页面
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          // 下载操作
          await page.click(
            '#form1 > div.commonMain > div > div.fn-main.list-main > div.list-table-bot > ul > li:nth-child(3) > a',
          );
          await page.waitFor(getRandom(800, 1000));
          await page.click('#div_ExportBoxHtml > div > div:nth-child(2) > a:nth-child(1)');
          // await page.waitForFunction(deleteFile());
          // 翻页
          await page.waitForSelector(
            '#form1 > div.commonMain > div > div.fn-main.list-main > div.Search_page-numble',
          );
          await page.click('#pagerBottomNew_nextButton');
          await page.waitFor(2000);
        }
      }
      return '成功';
    }
    await page.close();
    await browser.close();
    return '';
  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    return '';
  }
};
