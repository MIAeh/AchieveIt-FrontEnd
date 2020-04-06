import { login, getAllUser } from "@/api/user.js";

describe("Api:user", () => {
  test("login 接口调用成功", () => {
    const reqPromise = login({
      username: "b6703879-e1e2-499c-8ffe-d8b29f71f156",
      password: "123456",
    });
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("getAllUser 接口调用成功", () => {
    const reqPromise = getAllUser();
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
});
