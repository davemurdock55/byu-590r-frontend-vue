import { mapState } from "vuex";
import { useDisplay } from "vuetify";

export default {
  name: "BooksView",
  data: function () {
    return {
      isLoadingBooks: true,
      snackbar: false,
      errorMessage: null,

      // rating: 0,
      requiredRule: [(value) => !!value || "Required"],
      dateFormatRule: [
        (value) => {
          if (!value) return true; // Return true if the value is empty
          return /^\d{4}-\d{2}-\d{2}$/.test(value) || "Date must be in the format YYYY-MM-DD";
        },
      ],

      newBook: {
        title: "",
        series: "",
        author: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
      },

      addBookDialog: false,
      addBookDialogIsLoading: false,
      isAddFormValid: false,

      selectedBook: {},
      bookDialog: false,
      bookDialogIsLoading: false,

      editingBook: {},
      editBookDialog: false,
      editBookDialogIsLoading: false,
      isEditFormValid: false,

      selectedDeleteBook: {},
      deleteBookDialog: false,
      deleteBookDialogIsLoading: false,
    };
  },

  computed: {
    ...mapState({
      booksList() {
        return this.$store.state.books.booksList;
      },
      // book() {
      //   return this.$store.state.books.book;
      // },
      authUser() {
        return this.$store.state.auth.user;
      },
      formattedDate() {
        if (this.selectedBook.date_published) {
          const parts = this.selectedBook.date_published.split("-");
          return parts.slice(1).concat(parts[0]).join("/");
        }
        return "";
      },
    }),
  },

  methods: {
    getBooks() {
      this.$store.dispatch("books/getBooks").then(() => {
        this.isLoadingBooks = false;
        // console.log(this.$store.state.books);
      });
    },

    openAddDialog() {
      this.newBook = {
        title: "",
        series: "",
        author: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
      };
      this.addBookDialog = true;
    },
    onNewBookImageChange(e) {
      this.addBookDialogIsLoading = true;

      this.newBook.cover = null;
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) {
        this.addBookDialogIsLoading = false;
        return;
      }

      this.newBook.cover = image[0];
      this.addBookDialogIsLoading = false;
    },
    addBook() {
      this.addBookDialogIsLoading = true;
      this.errorMessage = null;

      this.$store
        .dispatch("books/createBook", this.newBook)
        .then(() => {
          this.closeAddDialog();
          this.newBook = {
            title: "",
            series: "",
            author: "",
            cover: "",
            description: "",
            rating: 0,
            date_published: "",
          };
          this.addBookDialogIsLoading = false;
        })
        .catch((error) => {
          this.openErrorSnackbar("Adding book failed. " + error.response.data.message);
          this.newBook = {
            title: "",
            series: "",
            author: "",
            cover: "",
            description: "",
            rating: 0,
            date_published: "",
          };
          this.addBookDialogIsLoading = false;
        });
    },
    closeAddDialog() {
      this.addBookDialog = false;
      this.newBook = {
        title: "",
        series: "",
        author: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
      };
    },

    openBookDialog(book) {
      this.bookDialog = true;
      this.selectedBook = book;
    },
    closeBookDialog() {
      this.selectedBook = {};
      this.bookDialog = false;
    },

    openEditDialog(book) {
      this.editBookDialog = true;
      this.bookDialog = false;
      this.editingBook = book;
    },
    onExistingBookCoverChange(e) {
      this.errorMessage = null;
      // this.editingBook.cover = null;
      var backupCover = this.editingBook.cover;

      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) {
        this.bookDialogIsLoading = false;
        this.editBookDialogIsLoading = false;
        return;
      }

      this.editingBook.cover = image[0];
      this.editBookDialogIsLoading = true;

      this.$store
        .dispatch("books/updateBookCover", this.editingBook)
        .then(() => {
          this.bookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        })
        .catch((error) => {
          this.openErrorSnackbar("Book Cover Upload failed. " + error.response.data.message);
          this.editingBook.cover = backupCover;
          this.bookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        });

      this.bookDialogIsLoading = false;
      this.editBookDialogIsLoading = false;
    },
    removeBookCover() {
      this.errorMessage = null;
      // this.editingBook.cover = null;
      var backupCover = this.editingBook.cover;

      this.editBookDialogIsLoading = true;

      var image = null;

      if (image != null) {
        this.bookDialogIsLoading = false;
        this.editBookDialogIsLoading = false;
        return;
      }

      this.editingBook.cover = null;

      this.$store
        .dispatch("books/removeBookCover", this.editingBook)
        .then(() => {
          this.bookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        })
        .catch((error) => {
          console.log(error);
          if (error != undefined) {
            this.openErrorSnackbar("Book Cover Upload failed. " + error.response.data.message);
          } else {
            this.openErrorSnackbar(error);
          }

          this.editingBook.cover = backupCover;
          this.bookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        });

      this.bookDialogIsLoading = false;
      this.editBookDialogIsLoading = false;
    },
    editBook() {
      this.editBookDialogIsLoading = true;
      this.errorMessage = null;

      this.$store
        .dispatch("books/updateBook", this.editingBook)
        .then(() => {
          this.closeEditDialog();
          this.editingBook = {};
          this.editBookDialogIsLoading = false;
        })
        .catch((error) => {
          this.openErrorSnackbar("Editing failed. " + error.response.data.message);
          this.editBookDialogIsLoading = false;
        });

      // this.closeEditDialog();
    },
    closeEditDialog() {
      this.editingBook = {};
      this.editBookDialog = false;
      this.bookDialog = true;
    },

    openDeleteDialog(book) {
      this.selectedDeleteBook = book;
      this.deleteBookDialog = true;
    },
    deleteBook() {
      this.deleteBookDialogIsLoading = true;
      this.errorMessage = null;

      this.$store
        .dispatch("books/deleteBook", this.selectedDeleteBook)
        .then(() => {
          this.selectedDeleteBook = {};
          this.deleteBookDialogIsLoading = false;
          this.selectedDeleteBook = false;
        })
        .catch((error) => {
          this.openErrorSnackbar("Deleting failed. " + error.response.data.message);
          this.deleteBookDialogIsLoading = false;
        });

      this.closeDeleteDialog();
      this.closeBookDialog();
    },
    closeDeleteDialog(book) {
      this.deleteBookDialog = false;
    },

    openErrorSnackbar(errorMessage) {
      this.snackbar = true;
      this.errorMessage = errorMessage;
    },
    closeErrorSnackbar() {
      this.snackbar = false;
      this.errorMessage = null;
    },
  },

  created() {
    // console.log("booksList: ", this.booksList);
    if (this.authUser) {
      this.getBooks();
    }
    // check snackbar
    // this.openErrorSnackbar("Hello there");
  },
};
