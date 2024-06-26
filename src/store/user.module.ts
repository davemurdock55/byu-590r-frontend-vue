// control the state and pull in the service
import userService from "../services/user.service";
import { books } from "./books.module";

const initialState = {
  user: {
    avatar: "",
    email: "",
    email_verified_at: "",
    name: "",
    reading_list: {
      // Initialize reading_list properties if needed
      name: "",
      description: "",
      status: "",
      books: [],
    },
  },
};

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
      return userService.addBookToReadingList(books_to_add).then((response) => {
        commit("setUserReadingList", response.user.reading_list);
        return Promise.resolve(response.user.reading_list);
      });
    },
    removeBookFromReadingList({ commit, getters }, book) {
      return userService.removeBookFromReadingList(book).then((response) => {
        commit("setUserReadingList", response.user.reading_list);
        return Promise.resolve(response.user.reading_list);
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
    // removeBook(state, book) {
    //   // removing the book at that index in the array and only 1 book.
    //   state.user.reading_list.splice(book.index, 1);
    // },
  },
  getters: {
    getUser: (state) => {
      return state.user;
    },
  },
};
