import request from '@/utils/request'

export function getProjectList(searchCondition, projectStatus) {
  return request({
    url: 'project/getProjectList',
    method: 'get',
    params: {
      searchCondition: searchCondition,
      projectStatus: projectStatus
    }
  })
}

export function getProjectIDList() {
  return request({
    url: 'project/getProjectIDList',
    method: 'get'
  })
}

export function getProjectInfo(projectID) {
  return request({
    url: 'project/getProjectByID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function updateProjectInfo(projectInfo) {
  return request({
    url: 'project/updateProjectByID',
    method: 'post',
    data: projectInfo
  })
}

