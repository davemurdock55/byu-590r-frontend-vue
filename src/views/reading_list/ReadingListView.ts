import { mapState } from "vuex";

export default {
  name: "ReadingListView",

  data: function () {
    return {
      isLoadingBooks: false,

      booksToAdd: [],
      addBookDialog: false,
      isAddingBooks: false,

      selectedBook: {},
      removeBookDialog: false,
      removeBookDialogIsLoading: false,

      snackbar: false,
      snackbarColor: "",
      snackBarMessage: null,
    };
  },

  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      reading_list() {
        return this.user ? this.user.reading_list : [];
      },
      reading_list_status_color() {
        if (this.reading_list && this.reading_list.status) {
          if (this.reading_list.status == "complete") {
            return "green";
          } else {
            return "info";
          }
        }
      },
      reading_list_status_capitalized() {
        if (this.reading_list && this.reading_list.status) {
          return this.reading_list.status.charAt(0).toUpperCase() + this.reading_list.status.slice(1);
        }
      },
      allBooks() {
        return this.$store.state.books.booksList;
      },
    }),
  },

  methods: {
    getAllBooks() {
      this.$store.dispatch("books/getBooks").then(() => {
        this.isLoadingBooks = false;
        // console.log(this.$store.state.books);
      });
    },

    openAddBookDialog() {
      this.addBookDialog = true;
    },
    addBookToReadingList() {
      this.isAddingBooks = true;
      // console.log("books to add: ", this.booksToAdd);
      this.$store
        .dispatch("user/addBookToReadingList", this.booksToAdd)
        .then(() => {
          this.isAddingBooks = false;
          this.openSnackbar("Added book to reading list!", "success");
          this.closeAddBookDialog();
        })
        .catch((error) => {
          this.isAddingBooks = false;
          console.log("error: ", error);
          this.openSnackbar("Failed to add book to reading list. " + error, "red");
          this.closeAddBookDialog();
        });
    },
    closeAddBookDialog() {
      this.isAddingBooks = false;
      this.addBookDialog = false;
    },

    openRemoveBookDialog(book) {
      this.selectedBook = book;
      this.removeBookDialog = true;
    },
    removeBookFromReadingList(book, message, color) {
      this.removeBookDialogIsLoading = true;
      this.errorMessage = null;

      this.$store
        .dispatch("user/removeBookFromReadingList", book)
        .then(() => {
          this.removeBookDialogIsLoading = false;
          this.openSnackbar(message, color);
          this.closeRemoveBookDialog();
          this.selectedBook = {};
        })
        .catch((error) => {
          console.log("error: ", error);
          this.removeBookDialogIsLoading = false;
          this.openSnackbar("Deleting failed. " + error, "red");
        });

      this.removeBookDialogIsLoading = false;
    },
    closeRemoveBookDialog() {
      this.selectedBook = {};
      this.removeBookDialog = false;
      this.removeBookDialogIsLoading = false;
    },

    openSnackbar(message, color) {
      this.snackbar = true;
      this.snackBarMessage = message;
      this.snackbarColor = color;
    },
    closeSnackbar() {
      this.snackbar = false;
      this.snackBarMessage = null;
    },
  },

  created() {
    // console.log(this.user);
  },
  mounted() {
    // console.log(this.user.reading_list);
    if (this.user && this.user != undefined) {
      this.isLoadingBooks = true;
      this.getAllBooks();
      console.log("got all books: ");
      this.isLoadingBooks = false;
    }
  },
  updated() {
    // console.log(this.user);
  },
};
