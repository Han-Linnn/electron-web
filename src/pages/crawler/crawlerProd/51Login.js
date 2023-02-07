import { decrypted } from '@/pages/channel/components/PasswordProcessing';
import { puppeteer } from '@/utils/utils';
import { setBrowserPage } from '../PageSet';

export const Login51 = async (data) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    // 防检测脚本
    await setBrowserPage(page);

    // 首次登录
    // const noCookiesLogin = async () => {
    await page.goto('https://ehire.51job.com/', {
      waitUntil: 'networkidle0',
      defaultViewport: {
        width: 1000,
        height: 800,
      },
    });
    // memberName: '泷铧信息科技'
    // userName: 'xxkj541'
    // password: 'vcoai2020'
    await page.waitForSelector('.listLogin_form', { timeout: 10000 });
    await page.type('#txtMemberNameCN', data.membername, { delay: 100 });
    await page.type('#txtUserNameCN', data.username, { delay: 100 });
    await page.type('#txtPasswordCN', decrypted(data.password), { delay: 100 });
    // 这个是勾选“记住我”，好像过期时间也没变长，但是勾选之后影响二次登录的自动输入，先注释掉。
    // await page.click('#ckbRemember', { delay: 200 });
    await page.tap('#Login_btnLoginCN');

    // // --------------------------------------自动滑动解锁 Start--------------------------------------
    // // 保证滑动弹窗加载出
    // await page.waitFor(3000);
    // const sign = await page.evaluate(() => {
    //   return document.querySelector('.geetest_canvas_fullbg');
    // });
    // if (sign) {
    //   // 获取像素差较大的最左侧横坐标
    //   const diffX = await page.evaluate(() => {
    //     const fullbg = document.querySelector('.geetest_canvas_fullbg'); // 完成图片
    //     const bg = document.querySelector('.geetest_canvas_bg'); // 带缺口图片
    //     const diffPixel = 40; // 像素差

    //     // 滑动解锁的背景图片的尺寸为 260*160
    //     // 拼图右侧离背景最左侧距离为 46px，故从 47px 的位置开始检测
    //     for (let i = 47; i < 260; i += 1) {
    //       for (let j = 1; j < 160; j += 1) {
    //         const fullbgData = fullbg.getContext('2d').getImageData(i, j, 1, 1).data;
    //         const bgData = bg.getContext('2d').getImageData(i, j, 1, 1).data;
    //         const red = Math.abs(fullbgData[0] - bgData[0]);
    //         const green = Math.abs(fullbgData[1] - bgData[1]);
    //         const blue = Math.abs(fullbgData[2] - bgData[2]);
    //         // 若找到两张图片在同样像素点中，red、green、blue 有一个值相差较大，即可视为缺口图片中缺口的最左侧横坐标位置
    //         if (red > diffPixel || green > diffPixel || blue > diffPixel) {
    //           return i;
    //         }
    //       }
    //     }
    //   });

    //   // 获取滑动按钮在页面中的坐标
    //   const dragButton = await page.$('.geetest_slider_button');
    //   const box = await dragButton.boundingBox();
    //   // 获取滑动按钮中心点位置
    //   const x = box.x + box.width / 2;
    //   const y = box.y + box.height / 2;

    //   // 鼠标滑动至滑动按钮中心点
    //   await page.mouse.move(x, y);
    //   // 按下鼠标
    //   await page.mouse.down();
    //   // 慢慢滑动至缺口位置,因起始位置有约 7px 的偏差，故终点值为 x + diffX - 7
    //   for (let i = x; i < x + diffX - 7; i += 5) {
    //     // 滑动鼠标
    //     await page.mouse.move(i, y);
    //   }
    //   // 假装有个停顿，看起来更像是人为操作
    //   await page.waitFor(200);
    //   // 放开鼠标
    //   await page.mouse.up();
    // }
    // // --------------------------------------自动滑动解锁 End--------------------------------------

    await page.waitForSelector(
      '#form1 > div.topHeader.shortcut190325 > div > div.Common_nav_main',
      {
        timeout: 0,
      },
    );
    await page.waitFor(1000);
    const cookies = await page.cookies();
    await page.tap('#MainMenuNew1_m5');
    await page.waitForSelector(
      '#form1 > table:nth-child(5) > tbody > tr > td > div.topHeader.shortcut190325 > div > div.Common_nav_main',
      { timeout: 0 },
    );

    let result = null;
    if (cookies) {
      // TODO 有什么判断是否登录成功的标志?
      const url = page.url();
      result = {
        cookies,
        url,
      };
    }
    await page.tap('#MainMenuNew1_hl_LogOut');
    console.log('Login51 result', result);
    await page.close();
    await browser.close();
    return result;
  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    return null;
  }
};
