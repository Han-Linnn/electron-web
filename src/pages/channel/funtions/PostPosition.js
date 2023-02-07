/*
// 渠道职位发布方法
*/
import { getPublish, uploadPublish } from '@/services/api';
import { message } from 'antd';
import xml2js from 'xml2js';
import postZhiLianPosition from '@/pages/crawler/positionCrawler/ZhiLianPosition';
// import fetch from 'node-fetch';

// 3.记录发布记录
const postPublishRecord = async (parmes) => {
  const response = await uploadPublish(parmes);
  if (response.code === 201) {
    message.success('职位发布成功');
  }
};

// 2-2.解析推送xml结果
const analysisFetchReturn = (channelId, positionId, data) => {
  if (channelId === 1) {
    // 前程无忧
    const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    xmlParser.parseString(data, (err, result) => {
      if (result) {
        const { xmlroot } = result;
        if ('returninfo' in xmlroot) {
          const { returninfo } = xmlroot;
          if ('ok' in returninfo) {
            // 发布成功
            const temp = {
              channel_id: channelId,
              position_id: positionId,
              status: true,
              msg: returninfo?.result,
              third_position_id: returninfo?.jobid,
            };
            postPublishRecord(temp);
          } else {
            message.warning(returninfo?.result);
          }
        }
      }
    });
  }
};

// 2-1.组织代理推送地址
const getProxyUrl = (channelId, publishUrl) => {
  /*
  const lstUrl = {
    1: '/ajax/Jobs/GlobalJobsAjax.ashx',
    2: '/api/job/publish',
    3: '/ejobedit/saveejob.json',
  };
  */
  let temp = '';
  if (channelId && publishUrl) {
    const arrUrl = publishUrl.split('/');
    arrUrl.splice(0, 3);
    temp = `/${arrUrl.join('/')}`;
  }
  return temp;
};

// 2.职位发布
const postPublishData = async (channelId, positionId, publishUrl, jobData, cookie) => {
  let str = ''
  Object.keys(cookie).forEach((key) => {
    document.cookie = `${cookie[key].name}=${cookie[key].value};`;
  });

  const urlencoded = new URLSearchParams();
  Object.keys(jobData).forEach((key) => {
    urlencoded.append(key, jobData[key]);
  });

  fetch(getProxyUrl(channelId, publishUrl), {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    // cookie: str,
    body: urlencoded,
    mode: 'cors',
    redirect: 'follow',
  })
    .then((res) => {
      return res.text();
    })
    .then((resData) => {
      analysisFetchReturn(channelId, positionId, resData);
    })
    .catch((error) => {
      console.log('error', error);
    });
};

// 1.判断+获取发布数据
const getPublishData = async (channelId, cookie, positionId) => {
  const response = await getPublish({ channel_id: channelId, position_id: positionId });
  if (response.code === 200) {
    const { data } = response;
    if (data && 'message' in data && 'error' in data.message) {
      message.error(data.message.error);
    } else if ('publish_url' in data && 'job_data' in data) {
      const { publish_url, job_data } = data;
      if (channelId === 1) {
        // 前程无忧
        postPublishData(channelId, positionId, publish_url, job_data, cookie);
      } else if (channelId === 2) {
        // 智联招聘
        const returnData = await postZhiLianPosition(positionId, publish_url, job_data, cookie);
        if (returnData) {
          postPublishRecord(returnData);
        }
      }
    } else {
      message.warning(response.msg);
    }
  }
};

const PostPosition = (channelId, cookie, positionId) => {
  if (channelId && positionId) {
    if (Object.keys(cookie).length > 0) {
      getPublishData(channelId, cookie, positionId);
    } else {
      // TODO 需添加cookie有但已失效的请求,修改渠道信息,提示重新登录
      message.warning('请检查渠道登录情况');
    }
  } else {
    message.warning('请检查渠道和职位信息');
  }
};

export default PostPosition;
