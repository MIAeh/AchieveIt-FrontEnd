const state = {
  currentProjectId: ""
}

const mutations = {
  setCurrentProjectId: (state, { currentProjectId }) => {
    state.currentProjectId = currentProjectId
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}
