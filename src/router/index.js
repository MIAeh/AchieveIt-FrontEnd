import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/projectList",
    children: [
      {
        path: "projectList",
        name: "ProjectList",
        component: () => import("@/views/projectList/index"),
        meta: { title: "项目列表", icon: "dashboard" }
      },
      {
        path: "projectInfo",
        name: "ProjectInfo",
        hidden: "true",
        component: () => import("@/views/projectInfo/index"),
        redirect: "/projectInfo/basicInfo",
        meta: { title: "项目信息" },
        children: [
          {
            path: "basicInfo",
            component: () => import("@/views/projectInfo/basicInfo"),
            name: "BasicInfo",
            meta: { title: "基本信息" }
          },
          {
            path: "stateManage",
            component: () => import("@/views/projectInfo/stateManage"),
            name: "StateManage",
            meta: { title: "状态管理" }
          },
          {
            path: "functionList",
            component: () => import("@/views/projectInfo/functionList"),
            name: "FunctionList",
            meta: { title: "功能列表" }
          },
          {
            path: "memberManage",
            component: () => import("@/views/projectInfo/memberManage"),
            name: "MemberManage",
            meta: { title: "成员管理" }
          },
          {
            path: "authorityManage",
            component: () => import("@/views/projectInfo/authorityManage"),
            name: "AuthorityManage",
            meta: { title: "权限管理" }
          },
          {
            path: "workHour",
            component: () => import("@/views/projectInfo/workHour"),
            name: "WorkHour",
            meta: { title: "工时管理" }
          },
          {
            path: "deviceList",
            component: () => import("@/views/projectInfo/deviceList"),
            name: "DeviceList",
            meta: { title: "设备列表" }
          },
          {
            path: "riskManagement",
            component: () => import("@/views/projectInfo/riskManagement"),
            name: "RiskManagement",
            meta: { title: "风险管理" }
          }
        ]
      }
    ]
  },

  {
    path: "/project",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "addProject",
        name: "AddProject",
        component: () => import("@/views/addProject/index"),
        meta: { title: "新建项目", icon: "form" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
