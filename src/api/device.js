import request from '@/utils/request'

export function getDeviceList(projectID) {
  return request({
    url: 'device/getDeviceList',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function returnDevice(projectID, userID, deviceID) {
  return request({
    url: 'device/returnDevice',
    method: 'post',
    params: {
      projectID: projectID,
      userID: userID,
      deviceID: deviceID
    }
  })
}

export function getDeviceIDList() {
  return request({
    url: 'device/getDeviceIDList',
    method: 'get',
  })
}

export function registerDevice(projectID, userID, deviceID, dueDate) {
  return request({
    url: 'device/registerDevice',
    method: 'post',
    params: {
      projectID: projectID,
      userID: userID,
      deviceID: deviceID,
      dueDate: dueDate
    }
  })
}
