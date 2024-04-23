import { mapState } from "vuex";
import { useDisplay } from "vuetify";
import { inject } from "vue";

export default {
  name: "BooksView",
  data: function () {
    return {
      isLoadingBooks: true,
      isAddingBookToReadingList: false,
      isAddingReview: false,
      isRemovingReview: false,
      snackbar: false,
      snackbarColor: "",
      snackBarMessage: null,

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
        author_id: 0,
        author_name: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
        cover_display: "",
      },

      addBookDialog: false,
      addBookDialogIsLoading: false,
      isAddFormValid: false,

      selectedBook: {},
      viewBookDialog: false,
      viewBookDialogIsLoading: false,
      showReviews: "",

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
      allAuthors() {
        return this.$store.state.books.allAuthorsList;
      },
      allAuthorNames() {
        return this.$store.state.books.allAuthorsList.map((author) => author.name);
      },

      // book() {
      //   return this.$store.state.books.book;
      // },
      User() {
        // console.log(this.$store.state.user);
        return this.$store.state.user;
      },
      authUser() {
        // console.log(this.$store.state.user);
        return this.$store.state.auth.user;
      },
      formattedDate() {
        if (this.selectedBook.date_published) {
          const parts = this.selectedBook.date_published.split("-");
          return parts.slice(1).concat(parts[0]).join("/");
        }
        return "";
      },

      themeState() {
        return inject("themeState") as { theme: string; changeTheme: () => void };
      },
      theme() {
        return this.themeState.theme;
      },
      panelColor() {
        return this.$store.state.theme.themeMode === "light" ? "grey-lighten-3" : "grey-darken-3";
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

    getAllAuthors() {
      this.$store.dispatch("books/getAllAuthors").then(() => {
        this.isLoadingBooks = false;
      });
    },

    getInitials(full_name) {
      const nameArray = full_name.split(" ");
      const firstInitial = nameArray[0][0]; // Get the first initial
      const lastInitial = nameArray.length > 1 ? nameArray[nameArray.length - 1][0] : ""; // Get the last initial (if there is more than one word)
      const result = firstInitial + lastInitial;

      return result;
    },

    openAddDialog() {
      this.getAllAuthors();
      this.newBook = {
        title: "",
        series: "",
        author_id: 0,
        author_name: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
        cover_display: "",
      };
      this.addBookDialog = true;
    },
    onNewBookImageChange(e) {
      this.addBookDialogIsLoading = true;

      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) {
        this.addBookDialogIsLoading = false;
        return;
      }

      this.newBook.cover = image[0];

      const reader = new FileReader();

      reader.onload = (event) => {
        // Set newBook.cover to the data URL
        if (event.target) {
          this.newBook.cover_display = event.target.result;
        } else {
          this.newBook.cover_display = null;
        }
        this.addBookDialogIsLoading = false;
      };

      // Read the uploaded file as a data URL
      reader.readAsDataURL(image[0]);
    },
    addBook() {
      this.addBookDialogIsLoading = true;
      this.errorMessage = null;

      const addAuthor = this.allAuthors.find((author) => author.name === this.newBook.author_name);
      if (addAuthor) {
        this.newBook.author_id = addAuthor.id;
      }

      this.$store
        .dispatch("books/createBook", this.newBook)
        .then(() => {
          this.closeAddDialog();
          this.newBook = {
            title: "",
            series: "",
            author_id: 0,
            author_name: "",
            cover: "",
            description: "",
            rating: 0,
            date_published: "",
            cover_display: "",
          };
          this.addBookDialogIsLoading = false;
          this.openSnackbar("Book Added", "success");
        })
        .catch((error) => {
          this.openSnackbar("Adding book failed. " + error.response.data.message, "red");
          this.newBook = {
            title: "",
            series: "",
            author_id: 0,
            author_name: "",
            cover: "",
            description: "",
            rating: 0,
            date_published: "",
            cover_display: "",
          };
          this.addBookDialogIsLoading = false;
        });
    },
    closeAddDialog() {
      this.addBookDialog = false;
      this.newBook = {
        title: "",
        series: "",
        author_id: 0,
        author_name: "",
        cover: "",
        description: "",
        rating: 0,
        date_published: "",
        cover_display: "",
      };
    },

    openBookDialog(book) {
      this.viewBookDialog = true;
      this.selectedBook = book;
      this.selectedBook = { ...book, newReview: { rating: 0, comment: "" } }; // Add userRating field with value 0
    },
    addBookToReadingList(selectedBook) {
      this.isAddingBookToReadingList = true;

      var BooksToAddArray = [selectedBook];

      this.$store
        .dispatch("user/addBookToReadingList", BooksToAddArray)
        .then(() => {
          this.isAddingBookToReadingList = false;
          this.openSnackbar("Book added to Reading List!", "success");
        })
        .catch((error) => {
          this.openSnackbar("Failed to add book to reading list. " + error.response.data.message, "red");
          this.isAddingBookToReadingList = false;
        });
    },
    submitReview() {
      this.isAddingReview = true;

      this.$store
        .dispatch("books/addReview", this.selectedBook)
        .then((response) => {
          this.isAddingReview = false;
          this.openSnackbar("Review submitted.", "success");
          this.selectedBook = { ...response, newReview: { rating: 0, comment: "" } };
          this.getBooks();
          // might be response.book
          // this.selectedBook = response;
        })
        .catch((error) => {
          this.openSnackbar("Failed to add review. " + error.response.data.message, "red");
          this.isAddingReview = false;
        });
    },
    removeReview(id) {
      this.isRemovingReview = true;

      this.$store
        .dispatch("books/removeReview", id)
        .then((response) => {
          this.isRemovingReview = false;
          this.openSnackbar("Review removed.", "red");
          this.selectedBook = { ...response, newReview: { rating: 0, comment: "" } };
          this.getBooks();
          // might be response.book
          // this.selectedBook = response;
        })
        .catch((error) => {
          this.openSnackbar("Failed to remove review. " + error.response.data.message, "red");
          this.isRemovingReview = false;
        });
    },
    closeBookDialog() {
      this.selectedBook = { newReview: { rating: 0, comment: "" } };
      this.showReviews = "";
      this.viewBookDialog = false;
    },

    openEditDialog(book) {
      this.getAllAuthors();

      // const author = this.allAuthors.find((author) => author.id === book.author_id);
      // this.editingBook = { ...book, author_name: author ? author.name : "" };
      this.editingBook = { ...book, author_name: book.author ? book.author.name : "" };

      this.viewBookDialog = false;
      this.editBookDialog = true;
    },
    onExistingBookCoverChange(e) {
      this.errorMessage = null;
      // this.editingBook.cover = null;
      var backupCover = this.editingBook.cover;

      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) {
        this.viewBookDialogIsLoading = false;
        this.editBookDialogIsLoading = false;
        return;
      }

      this.editingBook.cover = image[0];
      this.editBookDialogIsLoading = true;

      this.$store
        .dispatch("books/updateBookCover", this.editingBook)
        .then((response) => {
          this.editingBook = response;
          this.selectedBook = { ...this.editingBoook, newReview: { rating: 0, comment: "" } };
          this.editingBook = { ...this.editingBook, author_name: this.editingBook.author ? this.editingBook.author.name : "" };
          this.openSnackbar("Cover Updated", "success");
          this.viewBookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        })
        .catch((error) => {
          this.openSnackbar("Book Cover Upload failed. " + error.response.data.message, "red");
          this.editingBook.cover = backupCover;
          this.viewBookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        });

      this.viewBookDialogIsLoading = false;
      this.editBookDialogIsLoading = false;
    },
    removeBookCover() {
      this.errorMessage = null;
      // this.editingBook.cover = null;
      var backupCover = this.editingBook.cover;

      this.editBookDialogIsLoading = true;
      this.viewBookDialogIsLoading = true;

      var image = null;

      if (image != null) {
        this.viewBookDialogIsLoading = false;
        this.editBookDialogIsLoading = false;
        return;
      }

      this.editingBook.cover = null;

      this.$store
        .dispatch("books/removeBookCover", this.editingBook)
        .then((response) => {
          this.editingBook = response;
          this.selectedBook = { ...this.editingBoook, newReview: { rating: 0, comment: "" } };
          this.editingBook = { ...this.editingBook, author_name: this.editingBook.author ? this.editingBook.author.name : "" };
          this.openSnackbar("Cover removed.", "red");
          this.viewBookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
          this.getBooks();
        })
        .catch((error) => {
          console.log(error);
          if (error != undefined) {
            this.openSnackbar("Failed to remove book cover. " + error.response.data.message, "red");
          } else {
            this.openSnackbar(error, "red");
          }

          this.editingBook.cover = backupCover;
          this.viewBookDialogIsLoading = false;
          this.editBookDialogIsLoading = false;
        });

      this.viewBookDialogIsLoading = false;
      this.editBookDialogIsLoading = false;
    },
    editBook() {
      this.editBookDialogIsLoading = true;
      this.errorMessage = null;

      // Update the editingBook object with author_id based on author_name or handle it appropriately in your updateBook action
      // For example:
      const editAuthor = this.allAuthors.find((author) => author.name === this.editingBook.author_name);
      if (editAuthor) {
        this.editingBook.author_id = editAuthor.id;
      }

      this.$store
        .dispatch("books/updateBook", this.editingBook)
        .then((response) => {
          // Adding the returned (updated) book (which is response) as the selectedBook
          this.selectedBook = { ...response, newReview: { rating: 0, comment: "" } };
          this.closeEditDialog();
          this.openBookDialog(response);
          this.editingBook = {}; // Reset editingBook after successful update
          this.openSnackbar("Edits Saved", "success");
          this.editBookDialogIsLoading = false;
        })
        .catch((error) => {
          this.openSnackbar("Editing failed. " + error.response.data.message, "red");
          this.editBookDialogIsLoading = false;
        });
    },
    closeEditDialog() {
      this.editBookDialog = false;
      this.openBookDialog(this.editingBook);
      this.editingBook = {};
      // this.viewBookDialog = true;
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
          this.openSnackbar("Book Deleted", "red");
          this.deleteBookDialogIsLoading = false;
          this.selectedDeleteBook = false;
          this.$store.dispatch("user/getUser");
        })
        .catch((error) => {
          this.openSnackbar("Deleting failed. " + error.response.data.message, "red");
          this.deleteBookDialogIsLoading = false;
        });

      this.closeDeleteDialog();
      this.closeBookDialog();
    },
    closeDeleteDialog(book) {
      this.deleteBookDialog = false;
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
    if (this.authUser) {
      this.getBooks();
    }
    // check snackbar
    // this.openSnackbar("Hello there", "success");
    // this.openSnackbar("General Kenobi", "red");
  },
  updated() {
    if (this.authUser) {
      // this.getBooks();
      // console.log("BooksView updated(): ", this.booksList);
    }
  },
};
