export default {
  name: "LoginView",
  emits: ["authenticate"],
  data: function () {
    return {
      isAuthenticated: false,
      email: "",
      password: "",
      register: {
        name: "",
        email: "",
        password: "",
        c_password: "",
      },
      forgotPasswordDialog: false,
      registerDialog: false,
      emailRules: [(value) => !!value || "Required", (value) => (value && value.length >= 3) || "Min 3 characters"],
      nameRules: [(value) => !!value || "Required", (value) => (value && value.length >= 1) || "Min 1 character"],
      passwordRules: [(value) => !!value || "Required", (value) => (value && value.length >= 8) || "Min 8 characters"],
      isLoginFormValid: false,
      isRegisterFormValid: false,
      alertMessage: "",
      alertType: "",
      isLoading: false,
      registerFormIsLoading: false,
    };
  },
  methods: {
    //     submitLogin() {
    //       if (!this.isLoginFormValid) {
    //         return;
    //       }
    //       this.errorMsg = "";
    //       if (this.email === this.password) {
    //         this.alertType = "warning";
    //         this.alertMessage = "Email and password can't match.";
    //         return;
    //       }
    //
    //       if (this.password == this.hardCodedPasswordForDemo) {
    //         this.alertType = "success";
    //         this.alertMessage = "Login success! Redirecting...";
    //
    //         this.isLoading = true;
    //         setTimeout(() => {
    //           this.isAuthenticated = true;
    //           this.$emit("authenticate", this.isAuthenticated);
    //           this.$refs.form.reset();
    //         }, 3000);
    //       } else {
    //         this.alertType = "error";
    //         this.alertMessage = "Login failed. Incorrect password.";
    //       }
    //     },
    submitLogin() {
      this.alertMessage = "";

      if (!this.isLoginFormValid) {
        return;
      }

      this.isLoading = true;

      const user = {
        email: this.email,
        password: this.password,
      };

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.alertType = "success";
          this.alertMessage = "Login Successful.";
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.isLoading = false;
          this.alertType = "error";
          this.alertMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        }
      );
    },
    submitRegister() {
      if (!this.isRegisterFormValid) {
        return;
      }

      this.registerFormIsLoading = true;

      const register = {
        name: this.register.name,
        email: this.register.email,
        password: this.register.password,
        c_password: this.register.c_password,
      };

      this.$store.dispatch("auth/register", register).then(
        () => {
          alert("success!");
          this.registerFormIsLoading = false;
          this.registerDialog = false;
        },
        (error) => {
          this.registerFormIsLoading = false;
          alert("error!");
        }
      );
    },
  },
  mounted() {
    // console.log("Login mounted");
  },
  beforeCreate() {
    // console.log("Login beforeCreate");
  },
  beforeMount() {
    // console.log("Login beforeMount");
  },
  created() {
    // console.log("Login created");
    // console.log(this.isAuthenticated);
  },
};
