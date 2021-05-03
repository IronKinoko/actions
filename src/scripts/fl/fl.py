import requests
import os
from src.notify.bark import sendBark

headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
}
config = os.getenv('FL')

email, passwd = config.split('\n')

signURL = 'https://fastlink.ws/user/checkin'
loginUrl = 'https://fastlink.ws/auth/login'

def login():
  r = requests.post(
      loginUrl, {"email": email, "passwd": passwd}, headers=headers)
  return r.cookies


def sign(cookies):
  r = requests.post(signURL, headers=headers, cookies=cookies.get_dict())
  return r.text


def fl():
  print(email, passwd)
  cookies = login()
  msg = sign(cookies)
  sendBark('FL自动签到', msg.encode('utf-8').decode('unicode_escape'))


if __name__ == '__main__':
  fl()
