import requests
import os
from urllib.parse import quote


def sendBark(title: str, content: str = None):
  barkURL = os.getenv('BARK_URL')
  if barkURL == None:
    return
  legalList = list(map(lambda x: quote(x), filter(
      lambda x: x != None, [title, content])))
  legalList.insert(0, barkURL)
  url = '/'.join(legalList)
  requests.get(url)


if __name__ == '__main__':
  sendBark(title='123', content='321')
  sendBark('last')
