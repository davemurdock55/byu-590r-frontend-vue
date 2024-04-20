// calls the API
import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";

class UserService {
  getUser() {
    return axios.get(API_URL + "user", { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  uploadAvatar(image) {
    let formData = new FormData();
    formData.append("image", image);
    return axios.post(API_URL + "user/upload_avatar", formData, { headers: authHeader("multipart") }).then((response) => {
      return response.data.result;
    });
  }

  removeAvatar() {
    return axios.delete(API_URL + "user/remove_avatar", { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  sendVerificationEmail(emailData) {
    return axios.post(API_URL + "user/send_verification_email", emailData, { headers: authHeader() }).then((response) => {
      return response.data;
    });
  }

  changeEmail(changeEmail) {
    return axios.post(API_URL + "user/change_email", changeEmail, { headers: authHeader() }).then((response) => {
      return response.data.result;
    });
  }

  addBookToReadingList(books_to_add) {
    return axios.post(API_URL + "user/add_books_to_reading_list", books_to_add, { headers: authHeader() }).then((response) => {
      console.log(response.data.result);
      return response.data.result;
    });
  }

  removeBookFromReadingList(book) {
    let formData = new FormData();

    formData.append("id", book.id);

    return axios.post(API_URL + "user/" + book.id + "/remove_book_from_reading_list", book.id, { headers: authHeader() }).then((response) => {
      console.log(response);
      return response.data.result;
    });
  }
}

const userService = new UserService();
export default userService;
