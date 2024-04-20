import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { books } from "./books.module";
import { theme } from "./theme.module";

const store = createStore({
  modules: {
    auth,
    theme,
    user,
    books,
  },
});

export default store;
