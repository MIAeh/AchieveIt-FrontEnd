import request from '@/utils/request'
import qs from 'qs'

export function getRisksByProjectID(projectID) {
  return request({
    url: 'risk/getRisksByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function addRisk(data) {
  return request({
    url: 'risk/addRisk',
    method: 'post',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'comma'})
    },
  })
}

export function updateRiskByRiskID(data) {
  return request({
    url: 'risk/updateRiskByRiskID',
    method: 'post',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'comma'})
    },
  })
}

export function solveRisk(riskID) {
  return request({
    url: 'risk/solveRisk',
    method: 'post',
    params: {
      riskID: riskID
    },
  })
}

export function deleteRisk(riskID) {
  return request({
    url: 'risk/deleteRisk',
    method: 'post',
    params: {
      riskID: riskID
    },
  })
}

export function getRiskTemplates() {
  return request({
    url: 'risk/getRiskTemplates',
    method: 'get',
  })
}

export function getRiskTemplatesByProjectID(projectID) {
  return request({
    url: 'risk/getRiskTemplatesByProjectID',
    method: 'get',
    params: {
      projectID: projectID
    },
  })
}
