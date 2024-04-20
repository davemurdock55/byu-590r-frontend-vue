const initialState = { themeMode: "light" };

export const theme = {
  namespaced: true,
  state: initialState,
  actions: {
    setThemeMode({ commit }, mode) {
      commit("setThemeMode", mode);
    },
  },
  mutations: {
    setThemeMode(state, mode) {
      state.themeMode = mode;
    },
  },
  getters: {
    themeMode(state) {
      return state.themeMode;
    },
  },
};
