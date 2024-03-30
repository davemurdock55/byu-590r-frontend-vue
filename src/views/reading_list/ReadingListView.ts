import { mapState } from "vuex";

export default {
  name: "ReadingListView",

  data: function () {},

  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      reading_list() {
        return this.user.reading_list;
      },
      reading_list_status_color() {
        if (this.user.reading_list.status == "complete") {
          return "green";
        } else {
          return "info";
        }
      },
    }),
  },

  created() {
    console.log(this.user);
  },
  mounted() {
    console.log(this.user.reading_list);
  },
  updated() {
    console.log(this.user);
  },
};
