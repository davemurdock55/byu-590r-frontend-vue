<template>
  <!-- Add Dialog -->
  <v-dialog v-model="addBookDialog" max-width="500">
    <v-card class="px-5">
      <v-card-title>
        <v-text>Add Books To Your Reading List</v-text>
      </v-card-title>
      <v-autocomplete
        chips
        closable-chips
        label="Books to Add"
        @update:modelValue="booksToAdd = $event"
        @keyup.enter="addBookToReadingList()"
        :items="allBooks"
        :item-title="(book) => book.title"
        :item-value="(book) => book"
        color="blue"
        variant="outlined"
        item-color="blue"
        multiple
      >
        <template v-slot:chip="{ props, item }">
          <v-chip v-bind="props" :color="$vuetify.theme.dark ? 'blue-darken-2' : 'blue'">
            {{ item.title }}
          </v-chip>
        </template>
      </v-autocomplete>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeAddBookDialog()">Cancel</v-btn>
        <v-btn @click="addBookToReadingList()" v-model="booksToAdd" color="blue" variant="flat" :loading="isAddingBooks">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Remove Dialog -->
  <v-dialog v-model="removeBookDialog" max-width="500">
    <v-card>
      <v-card-title>
        <v-text class="text-red">Remove From Reading List?</v-text>
      </v-card-title>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
      </template>
      <v-card-text>
        Are you sure you want to remove <strong>{{ selectedBook.title }}</strong> from your reading list?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeRemoveBookDialog()">Cancel</v-btn>
        <v-btn @click="removeBookFromReadingList(selectedBook, 'Book removed', 'red')" variant="flat" color="red" :loading="removeBookDialogIsLoading">Remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-sheet class="justify-center d-flex flex-column align-center pa-10">
    <div v-if="reading_list" class="justify-center mb-5 d-flex flex-column align-center">
      <h1 class="pb-4 text-center text-h3 text-blue">{{ reading_list.name }}</h1>
      <v-text class="text-h6">{{ reading_list.description }}</v-text>
      <v-chip v-if="reading_list" :color="reading_list_status_color" class="mt-2">
        {{ reading_list_status_capitalized }}
      </v-chip>

      <v-btn @click="openAddBookDialog()" class="mt-5" variant="flat" prepend-icon="mdi-plus" color="blue" size="large" type="submit">Add Books</v-btn>
    </div>
    <p v-else>We couldn't find a reading list for you.</p>

    <!-- Reading List Items -->
    <v-hover v-if="reading_list && reading_list.books" v-for="book in reading_list.books">
      <template v-slot:default="{ isHovering, props }">
        <v-card :key="book.id"  class="my-2 d-flex align-center responsive-width responsive-direction" variant="outlined" v-bind="props" :color="isHovering ? 'blue' : undefined" :elevation="isHovering ? 6 : 0" hover>
          <img v-if="book.cover" :src="book.cover" class="h-full responsive-img-padding" style="max-width: 150px;" cover></img>
          <div v-else class="default_book_area light pa-6" style="width: 150px; height: 100%; min-height: 215px;" @click="$refs.bookCoverUpload.click()">
              <v-icon icon="mdi-book-open-blank-variant-outline" color="grey-lighten-1" style="font-size: 80px; width: 80px; height: 80px"></v-icon>
            </div>
          <!-- <v-img :src="book.cover" min-width="135" class="h-full" cover></v-img> -->
          <v-card-item :class="{ 'text-blue': isHovering, 'text-black': !isHovering && $vuetify.theme.dark === false, 'text-white': !isHovering && $vuetify.theme.dark === true }">
            <v-card-title>{{ book.title }}</v-card-title>
            <v-card-subtitle>{{ book.author.name }}</v-card-subtitle>
          </v-card-item>
          <div class="py-2 responsive-alignment">
            <div class="justify-start text-center d-flex align-center responsive-alignment">
              <p class="text-h6 font-weight-normal text-yellow-darken-2">{{ book.overall_rating }}</p>
              <v-rating v-model="book.overall_rating" active-color="yellow-darken-2" color="yellow-darken-2" density="compact" clearable hover half-increments readonly></v-rating>
            </div>
            <v-card-text :class="{ 'text-black': $vuetify.theme.dark === false, 'text-white': $vuetify.theme.dark === true }" class="pl-0 responsive-padding">{{ book.description }}</v-card-text>
            <div class="flex-row d-flex ga-5 responsive-alignment">
              <v-btn prepend-icon="mdi-book-check-outline" color="success" variant="outlined" @click="removeBookFromReadingList(book, 'Congratulations on finishing the book!!', 'success')"
                >Finished</v-btn
              >
              <v-btn prepend-icon="mdi-book-minus-outline" color="red" variant="outlined" @click="openRemoveBookDialog(book)">Remove</v-btn>
            </div>
          </div>
        </v-card>
      </template>
    </v-hover>
    <v-progress-linear v-else-if="isLoadingBooks" color="blue" class="mt-12" width="200" indeterminate></v-progress-linear>

    <v-text v-else>No books in the reading list.</v-text>
  </v-sheet>

  <!-- Snackbar -->
  <v-snackbar :color="snackbarColor" v-model="snackbar">
    <!-- <template v-slot:activator="{ props }"> </template> -->
    <p class="text-body-1">{{ snackBarMessage }}</p>
    <template v-slot:actions>
      <v-btn variant="text" @click="closeSnackbar">CLOSE</v-btn>
    </template>
  </v-snackbar>
</template>

<script src="./ReadingListView.ts" />
<style src="./ReadingListView.scss" />


<style scoped>
.responsive-width {
  width: 800px;
}


@media (max-width: 600px) {
  .responsive-width {
    width: 100% !important;
  }

  .responsive-direction {
    flex-direction: column !important;
  }

  .responsive-alignment {
    justify-content: center !important;
  }

  .responsive-padding {
    padding: 10% !important;
  }

  .responsive-img-padding {
    padding-top: 10px;
  }
}
</style>
