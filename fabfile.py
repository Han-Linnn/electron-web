"""
Author: yongfa
Date: 2020-12-15 17:02:45
LastEditTime  2021-08-11 15:41:14
LastEditors   yongfa
Description: 远程命令
fabric2 不支持文件夹上传，采用压缩打包上传
"""


# fabric
import os
import sys
import traceback
import oss2

from fabric import task
from invoke import run
from dotenv import load_dotenv

# 读取环境变量
env_file_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '.flaskenv'))
load_dotenv(env_file_path)


def upload_file(file_path):

    # 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    ACCESS_KEY_ID = os.getenv('ACCESS_KEY_ID')
    ACCESS_SECRET = os.getenv('ACCESS_SECRET')
    END_POINT = os.getenv('END_POINT')
    BUCKET_NAME = os.getenv('BUCKET_NAME')
    auth = oss2.Auth(ACCESS_KEY_ID, ACCESS_SECRET)
    # yourEndpoint填写Bucket所在地域对应的Endpoint。以华东1（杭州）为例，Endpoint填写为https://oss-cn-hangzhou.aliyuncs.com。
    # 填写Bucket名称。
    bucket = oss2.Bucket(auth, END_POINT, BUCKET_NAME)
    _, filename = os.path.split(file_path)
    filename = 'assistant/' + filename

    try:
        print('开始上传文件: {}'.format(file_path))
        result = bucket.put_object_from_file(filename, file_path)

        if result.status == 200:
            print('上传成功！')
        else:
            print('上传失败！')

    except Exception as e:
        traceback.print_exc(limit=1, file=sys.stdout)
        print('ERROR: {}'.format(str(e)))


@task
def upload(context):
    """生成并上传exe到oss服务器"""
    # run("yarn start:test")  # 生成静态文件
    # run("yarn build:test")  # 打包成exe

    exe_file = r'release\招聘i助理.exe'  # 根据实际情况改变路径
    upload_file(exe_file)
