import { getProjectList, getProjectIDList, getProjectInfo } from "@/api/project.js";

describe("Api:project", () => {
  test("getProjectList 接口调用成功", () => {
    const reqPromise = getProjectList(("", -1));
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("getProjectIDList 接口调用成功", () => {
    const reqPromise = getProjectIDList();
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("getProjectInfo 接口调用成功", () => {
    const reqPromise = getProjectInfo('2019-0000-D-01');
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
});
