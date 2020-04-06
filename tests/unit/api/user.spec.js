import { login } from "@/api/user.js";

describe("Api:user", () => {
  test("login 接口调用成功", () => {
    const reqPromise = login({
      username: "b6703879-e1e2-499c-8ffe-d8b29f71f156",
      password: "123456",
    });
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });
});
