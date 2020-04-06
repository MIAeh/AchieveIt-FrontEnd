import * as Authority from "@/api/authority.js";

describe("Api:authority", () => {
  test("getAllMembersByAuthority 接口调用成功", () => {
    const Promise = Authority.getAllMembersByAuthority('2019-0000-D-01')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("addAuthority 添加Git权限成功", () => {
    const Promise = Authority.addAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      'Git权限')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("addAuthority 添加文件权限成功", () => {
    const Promise = Authority.addAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      '文件服务器权限')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("addAuthority 添加邮件权限成功", () => {
    const Promise = Authority.addAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      '邮件通知权限')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("deleteAuthority 删除Git权限成功", () => {
    const Promise = Authority.deleteAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      'Git')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("deleteAuthority 删除File权限成功", () => {
    const Promise = Authority.deleteAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      'File')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("deleteAuthority 删除Mail权限成功", () => {
    const Promise = Authority.deleteAuthority(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      'Mail')
    Promise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });
});
