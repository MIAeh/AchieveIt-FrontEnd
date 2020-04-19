const state = {
  currentProjectId: "",
  status: '',
}

const mutations = {
  setCurrentProjectId: (state, { currentProjectId }) => {
    state.currentProjectId = currentProjectId
  },
  setStatus: (state, status) => {
    state.status = status
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}
