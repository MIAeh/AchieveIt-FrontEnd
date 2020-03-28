import request from '@/utils/request'

export function getAllMembersByAuthority(projectID) {
  return request({
    url: '/authority/getAllMembersByID',
    method: 'get',
    params: {
      projectID: projectID
    }
  })
}

export function addAuthority(projectID, memberIDs, authorityType) {
  if (authorityType === "Git权限") {
    return request({
      url: '/authority/addGitMembersByID',
      method: 'POST',
      data: {
        projectID: projectID,
        memberIDs: memberIDs
      },
    })
  } else if (authorityType === "文件服务器权限") {
    return request({
      url: '/authority/addFileMembersByID',
      method: 'POST',
      data: {
        projectID: projectID,
        memberIDs: memberIDs
      },
    })
  } else if (authorityType === "邮件通知权限") {
    return request({
      url: '/authority/addMailMembersByID',
      method: 'POST',
      data: {
        projectID: projectID,
        memberIDs: memberIDs
      },
    })
  }
}

export function deleteAuthority(projectID, memberID, authorityType) {
  if (authorityType === "Git") {
    return request({
      url: '/authority/deleteGitMemberByID',
      method: 'POST',
      params: {
        projectID: projectID,
        memberID: memberID
      },
    })
  } else if (authorityType === "File") {
    return request({
      url: '/authority/deleteFileMemberByID',
      method: 'POST',
      params: {
        projectID: projectID,
        memberID: memberID
      },
    })
  } else if (authorityType === "Mail") {
    return request({
      url: '/authority/deleteMailMemberByID',
      method: 'POST',
      params: {
        projectID: projectID,
        memberID: memberID
      },
    })
  }
}
