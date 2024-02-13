export default {
  name: "LoginView",
  emits: ["authenticate"],
  data: function () {
    return {
      isAuthenticated: false,
      email: "",
      password: "",
      forgotPasswordDialog: false,
      emailRules: [(value) => !!value || "Required", (value) => (value && value.length >= 3) || "Min 3 characters"],
      passwordRules: [(value) => !!value || "Required", (value) => (value && value.length >= 8) || "Min 8 characters"],
      isLoginFormValid: false,
      alertMessage: "",
      alertType: "",
      isLoading: false,
      hardCodedEmailForDemo: "test@test.com",
      hardCodedPasswordForDemo: "password123",
    };
  },
  methods: {
    submitLogin() {
      if (!this.isLoginFormValid) {
        return;
      }
      this.errorMsg = "";
      if (this.email === this.password) {
        this.alertType = "warning";
        this.alertMessage = "Email and password can't match.";
        return;
      }

      if (this.password == this.hardCodedPasswordForDemo) {
        this.alertType = "success";
        this.alertMessage = "Login success! Redirecting...";

        this.isLoading = true;
        setTimeout(() => {
          this.isAuthenticated = true;
          this.$emit("authenticate", this.isAuthenticated);
          this.$refs.form.reset();
        }, 3000);
      } else {
        this.alertType = "error";
        this.alertMessage = "Login failed. Incorrect password.";
      }
    },
  },
  mounted() {
    console.log("Login mounted");
  },
  beforeCreate() {
    console.log("Login beforeCreate");
  },
  beforeMount() {
    console.log("Login beforeMount");
  },
  created() {
    console.log("Login created");
    console.log(this.isAuthenticated);
  },
};
