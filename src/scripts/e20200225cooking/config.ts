import Axios from 'axios'

export const axios = Axios.create({
  headers: {
    'User-Agent':
      ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    Referer: ' https://webstatic.mihoyo.com/',
  },
})

export const apiConfig = {
  signature:
    'https://api.mihoyo.com/weixin_api/get/signature?appid=wx7719ad4e7a70fb3a&url=https%3A%2F%2Fwebstatic.mihoyo.com%2Fys%2Fevent%2Fe20200225cooking%2Findex.html%3Futm_source%3Dbbs%26utm_medium%3Dmys%26utm_campaign%3Darti',
  fetch_cookie_accountinfo:
    'https://webapi.account.mihoyo.com/Api/fetch_cookie_accountinfo', // get ?t=1615094823374
  getUserGameRoles:
    'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn', // get ?game_biz=hk4e_cn
  userInfo: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/user/info', // get ?region=cn_gf01&uid=128198247
  completeGuide:
    'https://hk4e-api.mihoyo.com/event/e20210225cooking/guide/complete', // post {region,uid}

  // package
  tableInfo: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/table/info', // get ?region=cn_gf01&uid=128198247
  change: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/package/change', // post
  trayInfo: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/tray/info',

  // task
  taskList: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/task/list',
  completeTask:
    'https://hk4e-api.mihoyo.com/event/e20210225cooking/task/complete',
  taskReward: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/task/reward',

  // game
  gameStart: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/game/start', // post dish_id: 3
  gameEnd: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/game/end', // post

  // serve
  serve: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/serve',

  // reward
  rewardExchange: 'https://hk4e-api.mihoyo.com/event/e20210225cooking/reward/exchange',
}
