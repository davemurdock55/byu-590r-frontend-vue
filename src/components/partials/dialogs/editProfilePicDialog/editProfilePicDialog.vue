<template>
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
            <v-btn :disabled="!avatarURL" prepend-icon="mdi-close-box" @click="removeAvatar()" class="mt-3" variant="text" color="red"> Clear Profile Picture</v-btn>
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
</template>
