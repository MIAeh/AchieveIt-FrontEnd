import * as Device from "@/api/device.js";

describe("Api:device", () => {
  test("getDeviceList 接口调用成功", () => {
    const reqPromise = Device.getDeviceList('2019-0000-D-01');
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("returnDevice 接口调用成功", () => {
    const reqPromise = Device.returnDevice('2019-0000-D-01','0001', 'STORAGE-20190721-0001');
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("getDeviceIDList 接口调用成功", () => {
    const reqPromise = Device.getDeviceIDList();
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });

  test("registerDevice 接口调用成功", () => {
    const reqPromise = Device.registerDevice(
      '2019-0000-D-01',
      '48fb8377-664f-4a9b-b13f-6729b00a9e22',
      'PC-20190305-0001',
    '2020-04-06');
    reqPromise.then((posts) => {
      expect(posts.errorCode).toBe("200");
      done();
    });
  });
});
