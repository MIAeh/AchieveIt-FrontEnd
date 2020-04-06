import { render, createLocalVue, mount } from "@vue/test-utils";
import ProjectList from "@/views/ProjectList/index.vue";
import ElementUI from "element-ui";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("ProjectList.vue", () => {
  it("getProctList", () => {
    const wrapper = mount(ProjectList, {
      localVue,
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
