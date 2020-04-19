import { login, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { getMembers } from "@/api/Member";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    role: "",
    isMonitor: false,
    isMember: false,
    memberRole: [],
    id: "",
    avatar: ""
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ROLE: (state, role) => {
    state.role = role;
  },
  SET_IS_MONITOR: (state, isMonitor) => {
    state.isMonitor = isMonitor;
  },
  SET_IS_MEMBER: (state, isMember) => {
    state.isMember = isMember;
  },
  SET_MEMBER_ROLE: (state, memberRole) => {
    state.memberRole = memberRole;
  },
  SET_ID: (state, id) => {
    state.id = id;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ userID: username.trim(), userPassword: password })
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { userName, userId, userRole } = data;

          commit("SET_NAME", userName);
          commit("SET_ROLE", userRole);
          commit("SET_ID", userId);
          sessionStorage.setItem("userName", userName);
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  saveMemberRole({ commit, state }, projectID) {
    commit("SET_IS_MEMBER", false);
    commit("SET_MEMBER_ROLE", []);
    getMembers(projectID, -1).then(res => {
      const { data } = res;
      for (let i = 0; i < data.length; i++) {
        if (data[i].memberID === state.id) {
          commit("SET_IS_MEMBER", true);
          commit("SET_MEMBER_ROLE", data[i].memberRole);
          break;
        }
      }
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response
      //
      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }
      //
      //   const { name, avatar } = data
      //
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      sessionStorage.removeItem('userName');
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
