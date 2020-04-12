import request from "@/utils/request";

export function getProjectStatus(projectID) {
  return request({
    url: "/status/getProjectStatus",
    method: "get",
    params: {
      projectID: projectID
    }
  });
}

export function approveApplication(projectID) {
  return request({
    url: "/status/approveApplication",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function rejectApplication(projectID) {
  return request({
    url: "/status/rejectApplication",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function confirmConfigurationCompleted(projectID) {
  return request({
    url: "/status/confirmConfigurationCompleted",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function addQAMembersByID(projectID, memberIDs) {
  return request({
    url: "/project/addQAMembersByID",
    method: "post",
    data: {
      projectID: projectID,
      memberIDs: memberIDs
    }
  });
}

export function addEPGMembersByID(projectID, memberIDs) {
  return request({
    url: "/project/addEPGMembersByID",
    method: "post",
    data: {
      projectID: projectID,
      memberIDs: memberIDs
    }
  });
}

export function launchProject(projectID) {
  return request({
    url: "/status/launchProject",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function deliverProject(projectID) {
  return request({
    url: "/status/deliverProject",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function endProject(projectID) {
  return request({
    url: "/status/endProject",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function getArchiveLink(projectID) {
  return request({
    url: "/status/getArchiveLink",
    method: "get",
    params: {
      projectID: projectID
    }
  });
}

export function updateArchive(projectID, archiveLink) {
  return request({
    url: "/status/updateArchive",
    method: "post",
    params: {
      projectID: projectID,
      archiveLink: archiveLink
    }
  });
}

export function approveArchive(projectID) {
  return request({
    url: "/status/approveArchive",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}

export function rejectArchive(projectID) {
  return request({
    url: "/status/rejectArchive",
    method: "post",
    params: {
      projectID: projectID
    }
  });
}
