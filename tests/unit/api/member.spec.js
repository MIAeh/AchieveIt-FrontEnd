import { getMembers, addMember, addMemberRole, deleteMemberRole, changeMemberSuperior } from "@/api/Member.js";

describe("Api:member", () => {
  test("getMembers 接口调用成功", () => {
    const reqPromise = getMembers(("2019-0000-D-01", -1));
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("addMember 接口调用成功", () => {
    const reqPromise = addMember('2019-0000-D-01', '0003');
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("500");
      done();
    });
  });
  test("addMemberRole 接口调用成功", () => {
    const reqPromise = addMemberRole('2019-0000-D-01','b6703879-e1e2-499c-8ffe-d8b29f71f156', 0);
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("deleteMemberRole 接口调用成功", () => {
    const reqPromise = deleteMemberRole('2019-0000-D-01','b6703879-e1e2-499c-8ffe-d8b29f71f156', 0);
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("changeMemberSuperior 接口调用成功", () => {
    const reqPromise = changeMemberSuperior('2019-0000-D-01', '48fb8377-664f-4a9b-b13f-6729b00a9e22','b6703879-e1e2-499c-8ffe-d8b29f71f156', 0);
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
});
