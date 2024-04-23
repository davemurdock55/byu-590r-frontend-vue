<template>
  <v-sheet class="d-flex align-center ga-10 pa-10 mobile-styles">
    <v-sheet>
      <h1 class="pb-4 text-left text-h3 text-blue">About Bookhaven</h1>
      <v-text class="text-h6"
        >Bookhaven was a company founded to help readers find and read good books. It's so hard to keep track of all the books you want to read, and the aim of Bookhaven is to help you track that, so
        that you never have to remember which book you wanted to read next again.</v-text
      >
    </v-sheet>

    <v-img src="/images/Bookhaven_about_sq.png" width="600"></v-img>
  </v-sheet>
</template>

<style scoped>
@media (max-width: 600px) {
  .mobile-styles {
    flex-direction: column;
  }
}
</style>
