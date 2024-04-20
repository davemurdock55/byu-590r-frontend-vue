// calls the API
import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";

class BooksService {
  getBooks() {
    return axios.get(API_URL + "books", { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  createBook(book) {
    let formData = new FormData();
    formData.append("title", book.title);
    formData.append("series", book.series);
    formData.append("author_id", book.author_id);
    formData.append("cover", book.cover);
    // // Append cover image if it exists
    // if (book.cover instanceof File) {
    //   formData.append("cover", book.cover);
    // }
    formData.append("description", book.description);
    // formData.append("rating", book.rating);

    // Ensure date_published is in YYYY-MM-DD format
    if (book.date_published) {
      const formattedDate = new Date(book.date_published).toISOString().split("T")[0];
      formData.append("date_published", formattedDate);
    }

    return axios.post(API_URL + "books", formData, { headers: authHeader("multipart") }).then((response) => {
      return response.data.result;
    });
  }

  updateBook(book) {
    return axios.put(API_URL + "books/" + book.id, book, { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  updateBookCover(book) {
    let formData = new FormData();

    formData.append("cover", book.cover);

    return axios.post(API_URL + "books/" + book.id + "/update_book_cover", formData, { headers: authHeader("multipart") }).then((response) => {
      return response.data.result;
    });
  }

  removeBookCover(book) {
    let formData = new FormData();

    formData.append("cover", book.cover);

    return axios.post(API_URL + "books/" + book.id + "/remove_book_cover", formData, { headers: authHeader("multipart") }).then((response) => {
      return response.data.result;
    });
  }

  deleteBook(book) {
    return axios.delete(API_URL + "books/" + book.id, { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  getAuthors() {
    return axios.get(API_URL + "authors", { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }
}

const booksService = new BooksService();
export default booksService;
