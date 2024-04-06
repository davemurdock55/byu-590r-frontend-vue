// control the state and pull in the service
import bookService from "../services/books.service";

const initialState = {
  booksList: [],
  allAuthorsList: [],
};

export const books = {
  namespaced: true,
  state: initialState,
  actions: {
    // sendReport({ commit }) {
    //   return bookService.sendReport();
    // },
    getBooks({ commit }) {
      return bookService.getBooks().then((booksList) => {
        commit("setBooks", booksList);
        return Promise.resolve(booksList);
      });
    },

    createBook({ commit }, book) {
      return bookService.createBook(book).then((response) => {
        commit("addBook", response.book);
        return Promise.resolve(response.book);
      });
    },

    updateBook({ commit, getters }, book) {
      return bookService.updateBook(book).then((response) => {
        response.book.index = getters.getBookStateIndexByBookID(response.book.id);
        commit("setBook", response.book);
        return Promise.resolve(response.book);
      });
    },

    updateBookCover({ commit, getters }, book) {
      return bookService.updateBookCover(book).then((response) => {
        response.book.index = getters.getBookStateIndexByBookID(response.book.id);
        commit("updateBookCover", response.book);
        return Promise.resolve(response.book);
      });
    },

    removeBookCover({ commit, getters }, book) {
      return bookService.removeBookCover(book).then((response) => {
        response.book.index = getters.getBookStateIndexByBookID(response.book.id);
        return Promise.resolve(response.book);
      });
    },

    deleteBook({ commit, getters }, book) {
      // saving the index BEFORE we delete the book
      var index = getters.getBookStateIndexByBookID(book.id);
      return bookService.deleteBook(book).then((response) => {
        // setting that saved index to the book so that the removeBook() method works properly
        response.book.index = index;

        commit("removeBook", response.book);
        return Promise.resolve(response.book);
      });
    },

    getAllAuthors({ commit }) {
      return bookService.getAuthors().then((authorsList) => {
        commit("setAllAuthors", authorsList);
        return Promise.resolve(authorsList);
      });
    },
  },

  mutations: {
    setBooks(state, booksList) {
      state.booksList = booksList;
    },
    // he has this for his setBooks mutation because there are calculations he needs to do on them
    // setBooks(state, booksList) {
    //   state.booksList = booksList.map((book) => {
    //     book.available_qty = book.inventory_total_qty - book.checked_qty;
    //     return book;
    //   });
    // },
    // setBookCheckedQty(state, book) {
    //   state.booksList[book.index].checked_qty = book.checked_qty;
    //   state.booksList[book.index].inventory_total_qty = book.inventory_total_qty;
    //   state.booksList[book.index].available_qty = book.available_qty;
    // },
    addBook(state, book) {
      // book.available_qty = book.inventory_total_qty - book.checked_qty;
      state.booksList.push(book);
    },
    setBook(state, book) {
      state.booksList[book.index] = book;
    },
    updateBookCover(state, book) {
      state.booksList[book.index].cover = book.cover;
    },
    removeBook(state, book) {
      // removing the book at that index in the array and only 1 book.
      state.booksList.splice(book.index, 1);
    },
    setAllAuthors(state, authorsList) {
      state.allAuthorsList = authorsList;
    },
  },

  getters: {
    getBooks: (state) => {
      return state.booksList;
    },
    getBookStateIndexByBookID: (state) => (bookID) => {
      return state.booksList.findIndex((book) => {
        return book.id === bookID;
      });
    },
    getAuthors: (state) => {
      return state.allAuthorsList;
    },
  },
};
