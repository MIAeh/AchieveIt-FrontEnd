import request from '@/utils/request'

export function getClientInfo(clientID) {
  return request({
    url: 'client/getClientInfoByID',
    method: 'get',
    params: {
      clientID: clientID
    }
  })
}
