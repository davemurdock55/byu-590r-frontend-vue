<template>
  <div class="home-page-content">
    <Navbar />
    <v-sheet class="d-flex flex-column align-center pa-10">
      <h1 class="text-h3 text-center text-blue">Welcome to Bookhaven</h1>
      <v-text class="text-h6 pb-5">Where you find and share great books</v-text>
      <v-img src="/images/Bookhaven_Hero_landscape.png" width="1000"></v-img>
    </v-sheet>
    <AboutView />
  </div>
</template>

<script src="./HomeView.ts" />
<style src="./HomeView.scss" />
