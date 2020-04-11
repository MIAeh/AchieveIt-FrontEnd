import request from '@/utils/request'

export function getRisksByProjectID(projectID) {
  return request({
    url: 'risk/getRisksByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}
