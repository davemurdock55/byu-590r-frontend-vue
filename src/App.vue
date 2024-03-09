<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import LoginView from "./views/login/LoginView.vue";
import { mapState } from "vuex";
import { ref } from "vue";

export default {
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
      verificationEmailLoading: false,
      showEmailNotVerifiedDialog: false,
      showChangeEmailTextField: false,
      changeEmail: false,
      successVerificationMessage: "",
      changeEmailRules: [(value) => !!value || "Required.", (value) => (value && value.length >= 3) || "Min 3 characters"],
      profile: {
        avatar: "",
        name: "",
        email: "",
        title: "",
        initials: "",
        icon: "mdi-account-circle",
        color: "info",
      },
      profilePictureImage: "",
      emailOfVerification: "",
      editProfilePicDialog: false,
      switchModel: false,
    };
  },

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

  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      auth() {
        return this.$store.state.auth;
      },
      authUser() {
        return this.auth.user;
      },
      isAuthenticated() {
        return this.auth.status.loggedIn && this.authUser.token !== undefined;
      },
      title() {
        return "Welcome " + this.authUser.name + "!";
      },
      initials() {
        const nameArray = this.authUser.name.split(" ");
        const firstInitial = nameArray[0][0]; // Get the first initial
        const lastInitial = nameArray.length > 1 ? nameArray[nameArray.length - 1][0] : ""; // Get the last initial (if there is more than one word)
        const result = firstInitial + lastInitial;

        return result;
      },
      avatarURL() {
        return this.auth.user.avatar;
      },
      profilePictureChangeLabel() {
        return "Profile picture changed.";
      },
    }),
  },

  created() {
    if (this.authUser) {
      this.getCurrentUser();
    }
  },
  updated() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    checkAuth(auth) {},
    getCurrentUser() {
      this.profile.name = this.authUser.name;
      this.profile.email = this.authUser.email;

      this.profile.title = this.title;

      this.$store.dispatch("user/getUser").then((response) => {
        if (response.avatar) {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
        }
        if (!response.email_verified_at) {
          this.showEmailNotVerifiedDialog = true;
        }
      });
    },
    onAvatarChange(e) {
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) return;
      this.profileIsUploading = true;
      this.$store
        .dispatch("user/uploadAvatar", image[0], { root: true })
        .then((response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        })
        .catch((error) => {
          console.log(error);
          alert("Error. Try again");
          this.profileIsUploading = false;
        });
    },
    removeAvatar() {
      this.profileIsUploading = true;
      this.$store
        .dispatch("user/removeAvatar")
        .then((response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        })
        .catch((error) => {
          console.log(error);
          alert("Error. Try again");
          this.profileIsUploading = false;
        });
    },
  },
};
</script>

<template>
  <v-app :theme="theme">
    <v-dialog v-model="editProfilePicDialog" max-width="600">
      <v-card rounded="lg" :loading="profileIsUploading" accent="blue">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
        </template>
        <v-card-title class="px-2 d-flex justify-space-between align-center">
          <div class="pl-3 d-flex">
            <v-icon>mdi-account-circle-outline</v-icon>
            <div class="text-h5 text-medium-emphasis ps-2">Edit Profile Picture</div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="editProfilePicDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <div class="justify-center gap-5 d-flex flex-column">
            <div v-if="avatarURL == null || avatarURL == undefined || avatarURL == ''" class="upload_avatar_area pa-6">
              <v-text class="justify-center text-h5 d-flex text-grey-lighten-1" color="grey-lighten-1">Upload Profile Picture</v-text>
              <v-img
                height="200"
                aspect-ratio="1/1"
                class="cursor-pointer"
                @click="$refs.avatarUpload.click()"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"
              >
              </v-img>
            </div>
            <div v-else-if="avatarURL">
              <v-img height="300" aspect-ratio="1/1" :src="avatarURL"></v-img>
            </div>
            <div class="flex-row justify-center d-flex">
              <v-file-input
                prepend-icon="mdi-camera"
                clearable
                ref="avatarUpload"
                label="Upload Avatar"
                variant="outlined"
                @change="onAvatarChange($event)"
                rounded="lg"
                color="blue"
                class="d-none"
                :text="cursor"
              ></v-file-input>
              <!-- <v-btn icon="mdi-trash-can-outline" @click="removeAvatar()" class="mt-3" variant="text"></v-btn> -->
              <v-btn :disabled="!avatarURL" prepend-icon="mdi-close-box" @click="removeAvatar()" class="mt-3" variant="text" color="error"> Clear Profile Picture</v-btn>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-5 py-4 ga-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="editProfilePicDialog = false" size="large">Close</v-btn>
          <v-btn @click="editProfilePicDialog = false" :disabled="!avatarURL" variant="flat" color="blue" size="large" type="submit">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar :title="authUser.name === undefined ? '' : title" v-if="isAuthenticated" class="ga-3" gap="3">
      <v-spacer></v-spacer>
      <div class="flex-row d-flex ga-3 align-center pa-4">
        <v-btn to="/" default>Home</v-btn>
        <v-btn to="about">About</v-btn>

        <v-menu open-on-hover min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="info" :loading="profileIsUploading">
                <span v-if="!avatarURL" class="text-h6"
                  >{{ initials }}
                  <!-- <v-icon>mdi-account-circle-outline</v-icon> -->
                </span>
                <v-img v-else-if="avatarURL" :src="avatarURL" :loading="profileIsUploading"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="info" :loading="profileIsUploading">
                  <span v-if="!avatarURL" class="text-h6">{{ initials }}</span>
                  <v-img v-else-if="avatarURL" :src="avatarURL" :loading="profileIsUploading"></v-img>
                </v-avatar>
                <h3>{{ profile.name }}</h3>
                <p class="mt-1 text-caption">
                  {{ profile.email }}
                </p>
                <!-- <v-switch v-model="switchModel" :label="`change theme`" true-icon="mdi-weather-night" false-icon="mdi-weather-sunny" inset color="info" flat></v-switch> -->
                <v-divider class="my-3"></v-divider>
                <v-btn block variant="text" @click="editProfilePicDialog = true" rounded="lg">Edit Profile Picture</v-btn>
                <v-divider class="my-3"></v-divider>
                <!-- <v-btn variant="text" rounded> Toggle Theme </v-btn> -->
                <v-btn block :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changeTheme" variant="text" rounded="lg">Toggle Theme</v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn block variant="text" rounded="lg" @click="logout()"> Logout </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="pa-0" fluid>
        <div v-if="isAuthenticated" class="app-content">
          <RouterView />
        </div>
        <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
      </v-container>
    </v-main>
  </v-app>
</template>
