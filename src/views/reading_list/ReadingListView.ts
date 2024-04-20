import { mapState } from "vuex";

export default {
  name: "ReadingListView",

  data: function () {
    return {
      isLoadingBooks: false,
      addBookDialog: false,
      isAddingBooks: false,
      deleteBookDialog: false,
      booksToAdd: [],
    };
  },

  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      reading_list() {
        return this.user ? this.user.reading_list : null;
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
      console.log("books to add: ", this.booksToAdd);
      this.$store.dispatch("user/addBookToReadingList", this.booksToAdd).then(() => {
        this.isAddingBooks = false;
        this.closeAddBookDialog();
      });
    },
    closeAddBookDialog() {
      this.addBookDialog = false;
    },

    openDeleteBookDialog() {
      this.deleteBookDialog = true;
    },
    closeDeleteBookDialog() {
      this.deleteBookDialog = false;
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
