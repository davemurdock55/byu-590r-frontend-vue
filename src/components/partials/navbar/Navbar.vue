<script>
import { mapState } from "vuex";
import { ref } from "vue";

export default {
  name: "Navbar",
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
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
    };
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
  <v-app-bar :title="authUser.name === undefined ? '' : title" v-if="isAuthenticated" class="text-blue ga-3" gap="3">
    <v-spacer></v-spacer>
    <div class="flex-row d-flex ga-3 align-center pa-4">
      <v-btn to="/" flat color="blue" class="font-weight-medium" :ripple="false" default>Home</v-btn>
      <v-btn to="books" flat color="blue" class="font-weight-medium" :ripple="false">Books</v-btn>
      <v-btn to="about" flat class="font-weight-medium" :ripple="false">About</v-btn>

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
</template>
