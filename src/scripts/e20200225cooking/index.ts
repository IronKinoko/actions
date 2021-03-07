import { axios, apiConfig } from './config'
import { hash } from './hash'
import qs from 'qs'
import { sendBarkMsg } from '../../notifactions/bark'
interface Res<T> {
  data: T
}

interface AccountInfo {
  cookie_info?: {
    account_id: string
  }
}

interface Role {
  game_biz: string
  game_uid: string
  is_chosen: boolean
  is_official: boolean
  level: number
  nickname: string
  region: string
  region_name: string
}

interface UserInfo {
  day_left_game_times: number
  is_complete_guide: 0 | 1
  left_exchange_times: number
}

interface Dish {
  dish_id: number
  status: 0 | 1 | 2
}

interface TableInfo {
  package_id: number
  dish_list: Dish[]
}

interface Task {
  task_id: number
  task_status: 0 | 1 | 2
}

interface TrayDish {
  dish_id: number
  num: number
}

interface TrayInfo {
  dish_list: TrayDish[]
}

const { sendMsg, log } = new (class {
  private logs: string[] = []
  sendMsg = () => {
    sendBarkMsg('【原神】客至万民堂', this.logs.join('\n'))
  }
  log = (str: string) => {
    this.logs.push(str)
    console.log(str)
  }
})()

function btoa(str: string) {
  return Buffer.from(str).toString('base64')
}

function stringify(params: any) {
  return qs.stringify(params, { addQueryPrefix: true })
}

function getTime() {
  return new Date().getTime() / 1000
}

function sleep(time: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

async function getAccountInfo() {
  const res = await axios.get<Res<AccountInfo>>(
    `${apiConfig.fetch_cookie_accountinfo}?t=${getTime}`
  )

  return res.data.data.cookie_info ? res.data.data.cookie_info.account_id : ''
}

async function getRoles() {
  const res = await axios.get<Res<{ list: Role[] }>>(apiConfig.getUserGameRoles)

  return res.data.data.list
}

async function getUserInfo(region: string, uid: string) {
  const res = await axios.get<Res<UserInfo>>(
    apiConfig.userInfo + stringify({ region, uid })
  )

  return res.data.data
}
async function getTableInfo(region: string, uid: string) {
  const res = await axios.get<Res<TableInfo>>(
    apiConfig.tableInfo + stringify({ region, uid })
  )

  return res.data.data
}

async function completeGuide(region: string, uid: string) {
  await axios.post(apiConfig.completeGuide, { region, uid })
}

async function changePackage(region: string, uid: string, package_id: number) {
  const res = await axios.post<Res<TableInfo>>(apiConfig.change, {
    region,
    uid,
    package_id,
  })

  return res.data.data
}

async function getTaskList(region: string, uid: string) {
  const res = await axios.get<Res<{ task_list: Task[] }>>(
    apiConfig.taskList + stringify({ region, uid })
  )
  return res.data.data.task_list
}

async function completeTask(region: string, uid: string, task_id: number) {
  await axios.post(apiConfig.completeTask, { region, uid, task_id })
}

async function taskReward(region: string, uid: string, task_id: number) {
  await axios.post(apiConfig.taskReward, { region, uid, task_id })
}

async function getTrayInfo(region: string, uid: string) {
  const res = await axios.get<Res<TrayInfo>>(
    apiConfig.trayInfo + stringify({ region, uid })
  )

  return res.data.data
}

async function gameStart(region: string, uid: string, dish_id: number) {
  const res = await axios.post<Res<{ start_time: number }>>(
    apiConfig.gameStart,
    { region, uid, dish_id }
  )

  return res.data.data.start_time
}

/**
  dish_id: 3
  region: "cn_gf01"
  rs_key: "MTA="
  sign: "b64519e69b8c89e52179976010cd1dae"
  start_time: 1615099003
  uid: "12819824"
  
  `${dish_id}-${start_time}-${10}-34395be92703c5f7149c498b23936349-${region}-${uid}`
  7-1615099996-10-34395be92703c5f7149c498b23936349-cn_gf01-128198247

  hash //=> 2ceeee8635219647637235e5f075a92b

 */
async function gameEnd(role: Role, start_time: number, dish_id: number) {
  const hashKey = `${dish_id}-${start_time}-${10}-34395be92703c5f7149c498b23936349-${
    role.region
  }-${role.game_uid}`
  const params = {
    dish_id,
    region: role.region,
    rs_key: btoa('10'),
    sign: hash(hashKey),
    start_time,
    uid: role.game_uid,
  }
  await axios.post(apiConfig.gameEnd, params)
}

async function game(role: Role, dish_id: number) {
  const start_time = await gameStart(role.region, role.game_uid, dish_id)
  await sleep((Math.random() * 0.5 + 1) * 1000)
  await gameEnd(role, start_time, dish_id)
  await sleep((Math.random() * 0.5 + 1) * 1000)
}

async function serve(
  region: string,
  uid: string,
  dish_id: number,
  package_id: number
) {
  await axios.post(apiConfig.serve, { region, uid, dish_id, package_id })
}

async function rewardExchange(region: string, uid: string, package_id: number) {
  await axios.post(apiConfig.rewardExchange, { region, uid, package_id })
}

async function runGame(role: Role) {
  const { region, game_uid: uid } = role
  let userInfo = await getUserInfo(region, uid)

  if (userInfo.left_exchange_times === 0) {
    log('exchange times: 0')
    return
  }

  if (userInfo.is_complete_guide === 0) {
    await completeGuide(region, uid)
    userInfo.is_complete_guide = 1
  }

  let tableInfo = await getTableInfo(region, uid)

  if (tableInfo.package_id === 0) {
    // choose default package 8
    tableInfo = await changePackage(region, uid, 8)
  }

  // complete task
  const taskList = await getTaskList(region, uid)
  for (const task of taskList) {
    if (task.task_status === 0) {
      await completeTask(region, uid, task.task_id)
      task.task_status = 1
    }
    if (task.task_status === 1) {
      await taskReward(region, uid, task.task_id)
      task.task_status = 2
    }
  }

  // update userInfo
  userInfo = await getUserInfo(region, uid)

  log(`role: ${role.nickname}(${role.game_uid})`)
  log(`day_left_game_times: ${userInfo.day_left_game_times}`)

  const needMakeDishList = tableInfo.dish_list.filter(
    (dish) => dish.status === 0
  )

  log(`needMakeDishList: ${needMakeDishList.length}`)

  while (userInfo.day_left_game_times > 0 && 0 < needMakeDishList.length) {
    const dish = needMakeDishList[0]
    await game(role, dish.dish_id)
    dish.status = 1
    needMakeDishList.shift()
    userInfo.day_left_game_times--
  }

  if (userInfo.day_left_game_times === 0) {
    if (needMakeDishList.length === 0) {
      // serve
      for (const dish of tableInfo.dish_list.filter(
        (dish) => dish.status === 1
      )) {
        await serve(region, uid, dish.dish_id, tableInfo.package_id)
      }

      let newTableInfo = await getTableInfo(region, uid)
      // exchangeAward
      if (newTableInfo.dish_list.every((dish) => dish.status === 2)) {
        await rewardExchange(region, uid, tableInfo.package_id)
      }

      // log
      log('rewardExchange' + --userInfo.left_exchange_times)
    } else {
      // log
      log('[End] needMakeDishList length: ' + needMakeDishList.length)
    }
  } else {
    log(
      `[reRunGame] userInfo.day_left_game_times: ${userInfo.day_left_game_times}`
    )
    await runGame(role)
  }
}

export async function main() {
  const cookie = process.env.YS_COOKIE
  if (!cookie) return null

  // event end
  if (new Date() > new Date('2021-03-11T16:00:00.000Z')) return

  axios.defaults.headers.cookie = cookie

  // fetch account info
  const account_id = await getAccountInfo()
  if (!account_id) return

  const roles = await getRoles()

  for (const role of roles) {
    await runGame(role)
  }

  sendMsg()
}
