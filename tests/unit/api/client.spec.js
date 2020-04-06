import { getClientInfo } from "@/api/client.js";

describe("Api:client", () => {
  test("getClientInfo 接口调用成功", () => {
    const reqPromise = getClientInfo('0000');
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });
});
