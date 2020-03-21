import request from '@/utils/request'

export function getFeature(projectID) {
  return request({
    url: '/feature/getFeaturesInfo',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}
