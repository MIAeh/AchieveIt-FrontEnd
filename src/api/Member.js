import request from '@/utils/request'

export function getMembers(projectID, memberRole) {
  return request({
    url: 'project/getMembersByID',
    method: 'get',
    params: {
      projectID: projectID,
      memberRole: memberRole
    }
  })
}

export function addMember(projectID, memberID) {
  return request({
    url: 'project/addMemberByID',
    method: 'post',
    params: {
      projectID: projectID,
      memberID: memberID
    }
  })
}

export function deleteMember(projectID, memberID) {
  return request({
    url: '/project/deleteMemberByID',
    method: 'post',
    params: {
      projectID: projectID,
      memberID: memberID
    }
  })
}

export function addMemberRole(projectID, memberID, memberRole) {
  return request({
    url: 'project/addMemberRoleByID',
    method: 'post',
    params: {
      projectID: projectID,
      memberID: memberID,
      memberRole: memberRole
    }
  })
}

export function deleteMemberRole(projectID, memberID, memberRole) {
  return request({
    url: 'project/removeMemberRoleByID',
    method: 'post',
    params: {
      projectID: projectID,
      memberID: memberID,
      memberRole: memberRole
    }
  })
}

export function changeMemberSuperior(projectID, memberID, superiorID) {
  return request({
    url: 'project/updateMemberSuperiorByID',
    method: 'post',
    params: {
      projectID: projectID,
      memberID: memberID,
      superiorID: superiorID
    }
  })
}
