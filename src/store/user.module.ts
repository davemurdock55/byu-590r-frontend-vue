// control the state and pull in the service
import userService from "../services/user.service";
import { books } from "./books.module";

const initialState = { user: { avatar: "", email: "", email_verified_at: "", name: "", reading_list: [] } };

export const user = {
  namespaced: true,
  state: initialState,
  actions: {
    getUser({ commit }) {
      return userService.getUser().then(
        (user) => {
          commit("setUser", user);
          return Promise.resolve(user);
        },
        (response) => {
          return Promise.resolve(response);
        }
      );
    },
    uploadAvatar({ commit }, image) {
      return userService.uploadAvatar(image).then((response) => {
        return Promise.resolve(response);
      });
    },
    removeAvatar({ commit }) {
      return userService.removeAvatar().then((response) => {
        return Promise.resolve(response);
      });
    },
    sendVerificationEmail({ commit }, emailData) {
      return userService.sendVerificationEmail(emailData).then((response) => {
        return Promise.resolve(response);
      });
    },
    changeEmail({ commit }, changeEmail) {
      return userService.changeEmail(changeEmail).then(
        (user) => {
          commit("setEmail", user);
        },
        (response) => {
          return Promise.resolve(response);
        }
      );
    },
    addBookToReadingList({ commit }, books_to_add) {
      console.log("module 'books_to_add': ", books_to_add);
      return userService.addBookToReadingList(books_to_add).then((response) => {
        commit("setUser", response.user.reading_list);
        return Promise.resolve(response.user);
      });
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserReadingList(state, reading_list) {
      state.user.reading_list = reading_list;
    },
    setEmail(state, user) {
      state.user.email = user.email;
    },
    // setBookToReadingList(state, book) {
    //   state.user.reading_list.push(book);
    // },
  },
  getters: {
    getUser: (state) => {
      return state.user;
    },
  },
};
