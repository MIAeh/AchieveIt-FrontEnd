import request from '@/utils/request'

export function getWorkHoursByProjectID(projectID) {
  return request({
    url: 'workHour/getWorkHoursByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function getMyWorkHoursByProjectID(projectID) {
  return request({
    url: 'workHour/getMyWorkHoursByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function getMyWorkHoursToApproveByProjectID(projectID) {
  return request({
    url: 'workHour/getMyWorkHoursToApproveByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function applyWorkHour(featureName, activityName, startTime, endTime, projectID) {
  return request({
    url: 'workHour/applyWorkHour',
    method: 'post',
    params: {
      featureName: featureName,
      activityName: activityName,
      startTime: startTime,
      endTime: endTime,
      projectID: projectID
    }
  })
}

export function updateWorkHour(workHourID, featureName, activityName, startTime, endTime) {
  return request({
    url: 'workHour/updateWorkHour',
    method: 'post',
    params: {
      workHourID: workHourID,
      featureName: featureName,
      activityName: activityName,
      startTime: startTime,
      endTime: endTime,
    }
  })
}

export function rejectWorkHour(workHourID) {
  return request({
    url: 'workHour/rejectWorkHour',
    method: 'post',
    params: {
      workHourID: workHourID
    }
  })
}

export function approveWorkHour(workHourID) {
  return request({
    url: 'workHour/approveWorkHour',
    method: 'post',
    params: {
      workHourID: workHourID
    }
  })
}

