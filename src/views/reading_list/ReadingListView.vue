<template>
  <v-sheet class="justify-center d-flex flex-column align-center pa-10">
    <h1 class="pb-4 text-center text-h3 text-blue">{{ reading_list.name }}</h1>
    <v-text class="text-h6">{{ reading_list.description }}</v-text>
    <v-chip :color="reading_list_status_color"> {{ reading_list.status.charAt(0).toUpperCase() + reading_list.status.slice(1) }} </v-chip>

    <v-card width="800" height="200" class="d-flex my-2 align-center" v-for="book in reading_list.books" v-if="reading_list" :key="book.id">
      <v-img :src="book.cover" width="135" cover></v-img>
      <v-card-item>
        <v-card-title>{{ book.title }}</v-card-title>

        <v-card-subtitle>{{ book.author.name }}</v-card-subtitle>
      </v-card-item>
      <div>
        <div class="d-flex justify-start align-center text-center">
          <p class="text-h6 font-weight-light text-yellow-darken-2">{{ book.overall_rating }}</p>
          <v-rating v-model="book.overall_rating" active-color="yellow-darken-2" color="yellow-darken-2" density="compact" readonly hover half-increments></v-rating>
        </div>
        <v-card-text>{{ book.description }}</v-card-text>
      </div>
    </v-card>

    <p v-else>No books in the reading list.</p>
  </v-sheet>
</template>

<script src="./ReadingListView.ts" />
<style src="./ReadingListView.scss" />
