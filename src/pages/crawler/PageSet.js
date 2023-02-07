// 生成[min,max]的随机数
export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getUA = async (page) => {
  // 模拟一下UserAgent，不然默认会带Chrome Headless
  const temp = getRandom(1, 10);
  if (temp % 2 === 0) {
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    );
  } else {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4181.9 Safari/537.36',
    );
  }
};

// puppeteer 无头浏览器防检测
export const setBrowserPage = async (page) => {
  // 模拟webdriver
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  getUA(page);

  // 模拟plugins
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        {
          0: {
            type: 'application/x-google-chrome-pdf',
            suffixes: 'pdf',
            description: 'Portable Document Format',
            enabledPlugin: Plugin,
          },
          description: 'Portable Document Format',
          filename: 'internal-pdf-viewer',
          length: 1,
          name: 'Chrome PDF Plugin',
        },
        {
          0: { type: 'application/pdf', suffixes: 'pdf', description: '', enabledPlugin: Plugin },
          description: '',
          filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
          length: 1,
          name: 'Chrome PDF Viewer',
        },
        {
          0: {
            type: 'application/x-nacl',
            suffixes: '',
            description: 'Native Client Executable',
            enabledPlugin: Plugin,
          },
          1: {
            type: 'application/x-pnacl',
            suffixes: '',
            description: 'Portable Native Client Executable',
            enabledPlugin: Plugin,
          },
          description: '',
          filename: 'internal-nacl-plugin',
          length: 2,
          name: 'Native Client',
        },
      ],
    });
  });
  // 模拟window.chrome
  await page.evaluateOnNewDocument(() => {
    window.navigator.chrome = {
      runtime: {},
      loadTimes: () => {},
      csi: () => {},
      app: {},
    };
  });
  await page.evaluateOnNewDocument(() => {
    window.navigator.language = {
      runtime: {},
      loadTimes: () => {},
      csi: () => {},
      app: {},
    };
  });
};
