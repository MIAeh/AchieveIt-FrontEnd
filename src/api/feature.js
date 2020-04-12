import request from '@/utils/request'

export function getFeature(projectID) {
  return request({
    url: '/feature/getFeaturesByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function deleteFeature(featureID) {
  return request({
    url: '/feature/deleteFeatureByFeatureID',
    method: 'get',
    params: {
      featureID: featureID
    }
  })
}

export function updateFeatureByFeatureID(featureID, featureName, featureDescription) {
  return request({
    url: '/feature/updateFeatureByFeatureID',
    method: 'post',
    params: {
      featureID: featureID,
      featureName: featureName,
      featureDescription: featureDescription
    }
  })
}

export function createFeature(featureInfo) {
  if (featureInfo.featureLevel === 0) {
    return request({
      url: '/feature/addTopFeature',
      method: 'post',
      params: {
        featureName: featureInfo.featureName,
        projectID: featureInfo.projectId,
        featureDescription: featureInfo.featureDescription
      }
    })
  } else if (featureInfo.featureLevel === 1) {
    return request({
      url: '/feature/addSubFeature',
      method: 'post',
      params: {
        featureName: featureInfo.featureName,
        projectID: featureInfo.projectId,
        featureDescription: featureInfo.featureDescription,
        fatherID: featureInfo.firstFather
      }
    })
  } else if (featureInfo.featureLevel === 2) {
    return request({
      url: '/feature/addSubFeature',
      method: 'post',
      params: {
        featureName: featureInfo.featureName,
        projectID: featureInfo.projectId,
        featureDescription: featureInfo.featureDescription,
        fatherID: featureInfo.secondFather
      }
    })
  }
}

export function uploadFeatureList(data) {
  return request({
    url: '/feature/uploadFeatureList',
    method: 'post',
    data: data
  })
}