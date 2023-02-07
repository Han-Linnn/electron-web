import { decrypted } from '@/pages/channel/components/PasswordProcessing';
import { puppeteer } from '@/utils/utils';
import { setBrowserPage } from '../PageSet';

export const ZhilianLogin = async (data) => {
  try {
    // 打开浏览器，新开页面
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'),
    });
    const page = await browser.newPage();
    // 防检测脚本
    await setBrowserPage(page);

    // const noCookiesLogin = async () => {
    await page.goto('https://passport.zhaopin.com/org/login', {
      waitUntil: 'networkidle0',
      defaultViewport: {
        width: 1000,
        height: 800,
      },
    });
    await page.click(
      'body > div > div > div > section > main > div.km-tab > div.km-tab__nav-wrapper > div > div > a:nth-child(1)',
    );
    await page.waitForSelector('.km-tab', { timeout: 10000 });
    // userName: 'szsqhhqk082027'
    // password: '2021hrquekeji'
    await page.type(
      'body > div.rd6-login-page > div > div > section > main > div.km-tab > div.km-tab__content > div > div > form > div.km-form-item.is-dirty.is-untouched.is-changed > div > div > div > input',
      data.username,
      { delay: 100 },
    );
    await page.type(
      'body > div.rd6-login-page > div > div > section > main > div.km-tab > div.km-tab__content > div > div > form > div.rd6-account-login__password.km-form-item.is-pristine.is-untouched > div > div > div > input',
      decrypted(data.password),
      { delay: 100 },
    );
    // await page.tap('.km-checkbox__label');
    await page.tap(
      'body > div > div > div > section > main > div.km-tab > div.km-tab__content > div.km-tab-pane.km-tab-pane--active > div > form > div.rd6-account-login__button.km-form-item.is-pristine.is-untouched > div > button',
    );

    // // --------------------------------------自动滑动解锁 Start--------------------------------------
    // // 保证滑动弹窗加载出
    // await page.waitFor(3000);

    // // 获取像素差较大的最左侧横坐标
    // const diffX = await page.evaluate(() => {
    //   const fullbg = document.querySelector('.geetest_canvas_fullbg'); // 完成图片
    //   const bg = document.querySelector('.geetest_canvas_bg'); // 带缺口图片
    //   const diffPixel = 40; // 像素差

    //   // 滑动解锁的背景图片的尺寸为 260*160
    //   // 拼图右侧离背景最左侧距离为 46px，故从 47px 的位置开始检测
    //   for (let i = 47; i < 260; i++) {
    //     for (let j = 1; j < 160; j++) {
    //       const fullbgData = fullbg.getContext('2d').getImageData(i, j, 1, 1).data;
    //       const bgData = bg.getContext('2d').getImageData(i, j, 1, 1).data;
    //       const red = Math.abs(fullbgData[0] - bgData[0]);
    //       const green = Math.abs(fullbgData[1] - bgData[1]);
    //       const blue = Math.abs(fullbgData[2] - bgData[2]);
    //       // 若找到两张图片在同样像素点中，red、green、blue 有一个值相差较大，即可视为缺口图片中缺口的最左侧横坐标位置
    //       if (red > diffPixel || green > diffPixel || blue > diffPixel) {
    //         return i;
    //       }
    //     }
    //   }
    // });

    // // 获取滑动按钮在页面中的坐标
    // const dragButton = await page.$('.geetest_slider_button');
    // const box = await dragButton.boundingBox();
    // // 获取滑动按钮中心点位置
    // const x = box.x + box.width / 2;
    // const y = box.y + box.height / 2;

    // // 鼠标滑动至滑动按钮中心点
    // await page.mouse.move(x, y);
    // // 按下鼠标
    // await page.mouse.down();
    // // 慢慢滑动至缺口位置,因起始位置有约 7px 的偏差，故终点值为 x + diffX - 7
    // for (let i = x; i < x + diffX - 7; i += 5) {
    //   // 滑动鼠标
    //   await page.mouse.move(i, y);
    // }
    // // 假装有个停顿，看起来更像是人为操作
    // await page.waitFor(200);
    // // 放开鼠标
    // await page.mouse.up();

    // await page.waitFor(5000);
    // // --------------------------------------自动滑动解锁 End--------------------------------------

    await page.waitForSelector('#root > div.app-header', { timeout: 0 });
    const cookies = await page.cookies();

    await page.goto('https://rd6.zhaopin.com/staff/user/handover', { waitUntil: 'networkidle0' });
    await page.waitForSelector(
      '#root > div.app-main > div.app-main__content > div.staff-user > div > div > div.staff-content > div.staff-content__company > div.staff-content__date.has-separator > span:nth-child(1)',
    );
    const tempId = await page.evaluate(() => {
      return document.querySelector(
        '#root > div.app-main > div.app-main__content > div.staff-user > div > div > div.staff-content > div.staff-content__company > div.staff-content__date.has-separator > span:nth-child(1)',
      ).innerHTML;
    });
    const colId = tempId.match(/([^企业编号：]+)$/)[1];

    let result = null;
    if (cookies) {
      result = {
        cookies,
        tempId: colId,
      };
    }
    // result.tempId = colId;
    // result.cookies = cookies;
    console.log('ZhilianLogin result', result);
    await page.close();
    await browser.close();
    return result;
  } catch (errorInfo) {
    console.log('-err-', errorInfo);
    return null;
  }
};
