<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import LoginView from "./views/login/LoginView.vue";
import { mapState } from "vuex";
import { ref } from "vue";

// export default {
//   name: "App",
//   components: {
//     LoginView,
//     RouterLink,
//     RouterView,
//   },
//   data: function () {
//     // This is where you put all of your variables that you want to be accessible in the component
//     return {
//       isAuthenticated: false,
//     };
//   },
//   created() {
//     if (this.isAuthenticated) {
//       this.$router.push("/home");
//     }
//   },
//   methods: {
//     logout() {
//       this.isAuthenticated = false;
//     },
//     checkAuth(auth) {
//       console.log("Authenticated!", auth);
//       this.isAuthenticated = auth;
//     },
//   },
// };

export default {
  setup() {
    const theme = ref("light");
    function changeTheme() {
      theme.value = theme.value === "light" ? "dark" : "light";
    }
    return { theme, changeTheme };
  },
  name: "App",
  components: {
    LoginView,
    RouterLink,
    RouterView,
  },

  computed: mapState({
    authUser() {
      return this.$store.state.auth.user;
    },
    isAuthenticated() {
      return this.$store.state.auth.status.loggedIn && this.authUser.token !== undefined;
    },
    title() {
      return "Welcome " + this.authUser.name + "!";
    },
  }),
  updated() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    checkAuth(auth) {
      console.log("Authenticated!", auth);
    },
  },
};
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar :title="authUser.name === undefined ? '' : title" v-if="isAuthenticated">
      <v-spacer></v-spacer>
      <v-btn to="/" default>Home</v-btn>
      <v-btn to="about">About</v-btn>
      <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changeTheme">Toggle Theme</v-btn>
      <v-btn @click="logout()">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="pa-0" fluid>
        <div v-if="isAuthenticated" class="app-content">
          <RouterView />
        </div>
        <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
      </v-container>
    </v-main>
    <!-- <div v-if="isAuthenticated">
      <header>
        <div class="header-navigation">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </div>
        <button @click="logout()">Logout</button>
      </header>

      <RouterView />
    </div>
    <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" /> -->
  </v-app>
</template>
