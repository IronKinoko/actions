import os

from src.scripts.fl.fl import fl
if os.getenv('GITHUB_ACTIONS') != 'true':
  print('dev mode')

if os.getenv('FL') != None:
  fl()
