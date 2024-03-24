import { mapState } from "vuex";
import { useDisplay } from "vuetify";
import Navbar from "../../components/partials/navbar/Navbar.vue";
import AboutView from "../about/AboutView.vue";

export default {
  name: "HomeView",
  components: {
    AboutView,
    Navbar,
  },
  created() {
    // console.log("HomeView Created.");
  },
};
