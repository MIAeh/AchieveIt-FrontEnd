import { getFeature, deleteFeature, createFeature } from "@/api/feature.js";

describe("Api:feature", () => {
  test("getFeature 接口调用成功", () => {
    const reqPromise = getFeature("2019-0000-D-01");
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("deleteFeature 接口调用成功", () => {
    const reqPromise = deleteFeature("2b37103d-2927-4ae5-a8eb-01a9738ea5b1");
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("200");
      done();
    });
  });
  test("createFeature-一级功能 接口调用成功", () => {
    const reqPromise = createFeature({ featureLevel: 0 });
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("404");
      done();
    });
  });
  test("createFeature-二级功能 接口调用成功", () => {
    const reqPromise = createFeature({ featureLevel: 1 });
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("404");
      done();
    });
  });
  test("createFeature-三级功能 接口调用成功", () => {
    const reqPromise = createFeature({ featureLevel: 2 });
    reqPromise.then((res) => {
      expect(res.errorCode).toBe("404");
      done();
    });
  });
});
