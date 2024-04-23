<template>
  <!-- View Book Dialog -->
  <v-dialog v-model="viewBookDialog" max-width="600">
    <v-card rounded="lg" :loading="viewBookDialogIsLoading" accent="blue" class="pb-1">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
      </template>

      <!-- Card Top Bar -->
      <v-card-title class="mb-12">
        <v-app-bar app flat class="mt-n16" rounded="lg">
          <div class="pl-3 d-flex align-center">
            <v-icon color="grey-darken-1">mdi-book-outline</v-icon>
            <h5 class="text-body-1 text-medium-emphasis ps-2">{{ selectedBook.series }}</h5>
          </div>

          <template v-slot:append>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-book-settings-outline" variant="text" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item prepend-icon="mdi-square-edit-outline" @click="openEditDialog(selectedBook)">Edit Book</v-list-item>
                <v-list-item prepend-icon="mdi-delete-outline" @click="openDeleteDialog(selectedBook)" base-color="red">Remove Book</v-list-item>
              </v-list>
            </v-menu>
            <v-btn icon="mdi-close" variant="text" @click="closeBookDialog()"> </v-btn>
          </template>
        </v-app-bar>
      </v-card-title>

      <!-- Main Card Content -->
      <v-card-text class="pt-0">
        <div class="justify-center text-center d-flex flex-column">
          <h3 class="text-h4">{{ selectedBook.title }}</h3>
          <p class="text-grey-lighten-1" v-if="selectedBook.date_published">{{ formattedDate }}</p>

          <div class="mb-3 text-center">
            <div class="justify-center d-flex align-center mb-n2">
              <p class="text-h6 font-weight-medium text-yellow-darken-2">{{ selectedBook.overall_rating }}</p>
              <v-rating v-model="selectedBook.overall_rating" color="yellow-darken-2" density="comfortable" clearable hover half-increments readonly></v-rating>
            </div>
            <a class="text-yellow-darken-2 text-decoration-underline text-subtitle-2" @click="showReviews = showReviews === 'show' ? '' : 'show'" style="cursor: pointer"> See Reviews </a>
          </div>

          <div
            v-if="selectedBook.cover == null || selectedBook.cover == undefined || selectedBook.cover == '' || selectedBook == null || selectedBook == undefined || selectedBook == {}"
            class="default_book_area light pa-6"
            style="width: 200px; height: 300px"
            @click="$refs.bookCoverUpload.click()"
          >
            <v-icon icon="mdi-book-open-blank-variant-outline" color="grey-lighten-1" style="font-size: 80px; width: 80px; height: 80px"></v-icon>
          </div>
          <div v-else-if="selectedBook.cover" class="mb-2">
            <v-img height="300" :src="selectedBook.cover"></v-img>
          </div>
          <div class="flex-row justify-center mb-0 d-flex">
            <!-- <v-file-input
              prepend-icon="mdi-image-area"
              clearable
              ref="bookCoverUpload"
              label="Upload Book Cover"
              variant="outlined"
              @change="onExistingBookCoverChange($event)"
              rounded="lg"
              color="blue"
              class="d-none"
            ></v-file-input> -->
            <p class="text-medium-emphasis">{{ selectedBook.author ? selectedBook.author.name : "Unknown Author" }}</p>
            <!-- <p class="text-medium-emphasis">{{ selectedBook.author.name }}</p> -->
            <!-- <v-btn icon="mdi-trash-can-outline" @click="removeAvatar()" class="mt-3" variant="text"></v-btn> -->
            <!-- <v-btn :disabled="!avatarURL" prepend-icon="mdi-close-box" @click="removeAvatar()" class="mt-3" variant="text" color="red"> Clear Profile Picture</v-btn> -->
          </div>
        </div>
        <p class="mb-2">{{ selectedBook.description }}</p>
        <!-- Reviews -->
        <v-expansion-panels v-model="showReviews" variant="popout" :elevation="0">
          <v-expansion-panel title="Reviews" value="show" elevation="0" :color="panelColor">
            <v-expansion-panel-text>
              <div v-if="selectedBook.reviews" v-for="review in selectedBook.reviews" class="mb-3">
                <v-card class="mx-auto" :subtitle="review.email" :title="review.name" border flat>
                  <template v-slot:prepend>
                    <v-avatar color="info">
                      <span v-if="!review.avatar" class="text-h6"
                        >{{ getInitials(review.name) }}
                        <!-- <v-icon>mdi-account-circle-outline</v-icon> -->
                      </span>
                      <v-img v-else-if="review.avatar" :src="review.avatar"></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:append class="pa-0">
                    <div class="justify-start d-flex align-center mt-n6">
                      <p class="font-weight-medium text-h6 font-weight-light text-yellow-darken-2">{{ review.pivot.rating }}</p>
                      <v-rating v-model="review.pivot.rating" color="yellow-darken-2" density="comfortable" half-increments readonly></v-rating>
                    </div>
                  </template>
                  <div class="flex-row mr-2 d-flex" v-if="User.user.id == review.pivot.user_id">
                    <v-card-text class="text-body-1">{{ review.pivot.comment }}</v-card-text>
                    <v-hover>
                      <v-btn icon="mdi-trash-can" @click="removeReview(review.pivot.id)" :loading="isRemovingReview" flat>
                        <template v-slot:default>
                          <v-icon color="red">mdi-trash-can</v-icon>
                        </template>
                      </v-btn>
                    </v-hover>
                  </div>
                  <v-card-text class="text-body-1" v-else>{{ review.pivot.comment }}</v-card-text>
                </v-card>
              </div>

              <div class="justify-start mt-3 mb-1 d-flex align-center">
                <p class="font-weight-medium text-h6 font-weight-light text-yellow-darken-2">{{ selectedBook.newReview.rating }}</p>
                <v-rating v-model="selectedBook.newReview.rating" active-color="yellow-darken-2" color="yellow-darken-2" density="comfortable" clearable hover half-increments> </v-rating>
              </div>

              <v-textarea v-model="selectedBook.newReview.comment" label="Leave a Review" :loading="isAddingReview" row-height="15" rows="1" variant="outlined" color="yellow-darken-2" auto-grow>
                <template #prepend-inner>
                  <v-icon color="yellow-darken-2">mdi-message-text-outline</v-icon>
                </template>
                <template #append class="ma-0">
                  <v-btn icon="mdi-send-variant" type="submit" @click="submitReview()" :loading="isAddingReview" flat>
                    <template v-slot:default>
                      <v-icon color="yellow-darken-2" size="large">mdi-send-variant</v-icon>
                    </template>
                  </v-btn>
                  <!-- <v-icon size="large" color="yellow-darken-2">mdi-send-variant</v-icon> -->
                </template>
              </v-textarea>

              <!-- <v-btn type="submit" variant="flat" color="yellow-darken-2" class="text-white">Send</v-btn> -->
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions class="px-5 pt-2 ga-2">
        <v-spacer></v-spacer>
        <v-btn @click="addBookToReadingList(selectedBook)" variant="flat" prepend-icon="mdi-plus" color="blue" size="large" class="px-4" :loading="isAddingBookToReadingList">
          Add To Reading List
        </v-btn>
        <!-- <v-btn @click="" variant="outlined" prepend-icon="mdi-check" color="green" size="large" class="px-4" type="submit">Added To Reading List</v-btn> -->
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Book Dialog -->
  <v-dialog v-model="editBookDialog" max-width="600">
    <v-form v-model="isEditFormValid" @submit.prevent="editBook">
      <v-card rounded="lg" :loading="editBookDialogIsLoading" accent="blue">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
        </template>
        <v-card-title class="px-2 py-1 my-0 d-flex justify-space-between align-center">
          <div class="pl-3 d-flex align-center">
            <v-icon color="grey-darken-1">mdi-book-outline</v-icon>
            <v-responsive class="mx-auto" min-width="200">
              <v-text-field label="Series" variant="underlined" min-width="200" v-model="editingBook.series" color="blue"></v-text-field>
            </v-responsive>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="closeEditDialog()"></v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <div class="justify-center text-center d-flex flex-column">
            <v-responsive class="mx-auto" min-width="300">
              <v-text-field label="Title" variant="underlined" v-model="editingBook.title" :rules="requiredRule" color="blue"></v-text-field>
            </v-responsive>

            <v-responsive class="mx-auto" min-width="300">
              <v-text-field label="Date Published" variant="underlined" v-model="editingBook.date_published" :rules="dateFormatRule" color="blue" placeholder="YYYY-MM-DD"></v-text-field>
            </v-responsive>

            <!-- taking out "rating" since you should just rate the book to give it a rating. An admin shouldn't be able to just edit the ratings haha -->
            <!-- <div class="justify-center mb-2 text-center d-flex align-center">
              <p class="text-h6 font-weight-light text-yellow-darken-2">{{ editingBook.rating }}</p>
              <v-rating v-model="editingBook.rating" color="yellow-darken-2" density="comfortable" clearable hover half-increments></v-rating>
            </div> -->

            <!-- <v-skeleton-loader v-if="editBookDialogIsLoading || viewBookDialogIsLoading" type="card"></v-skeleton-loader> -->
            <div
              v-if="editingBook.cover == null || editingBook.cover == undefined || editingBook.cover == '' || editingBook == null || editingBook == undefined || editingBook == {}"
              class="cursor-pointer upload_book_area pa-6"
              style="cursor: pointer"
              @click="$refs.bookEditCoverUpload.click()"
              :loading="editBookDialogIsLoading || viewBookDialogIsLoading"
            >
              <v-text class="justify-center d-flex text-grey-lighten-1" color="grey-lighten-1">Upload Book Cover</v-text>
              <v-icon icon="mdi-image-area" color="grey-lighten-1" size="x-large"></v-icon>
            </div>
            <div v-else-if="editingBook.cover">
              <v-img height="300" :src="editingBook.cover" :loading="editBookDialogIsLoading || viewBookDialogIsLoading"></v-img>
            </div>
            <div class="justify-center d-flex flex-column">
              <v-file-input
                prepend-icon="mdi-image-area"
                clearable
                ref="bookEditCoverUpload"
                label="Upload Book Cover"
                variant="outlined"
                @change="onExistingBookCoverChange($event)"
                rounded="lg"
                color="blue"
                class="d-none"
              ></v-file-input>

              <v-responsive class="mx-auto" min-width="300">
                <v-btn :disabled="!editingBook.cover" prepend-icon="mdi-close-box" @click="removeBookCover()" class="mt-3" variant="text" color="red" :max-width="300">Remove Book Cover</v-btn>
                <v-autocomplete clearable label="Author" variant="underlined" v-model="editingBook.author_name" :items="allAuthorNames" :rules="requiredRule" color="blue"></v-autocomplete>
              </v-responsive>
              <v-textarea label="Description" variant="underlined" v-model="editingBook.description" color="blue" auto-grow :rows="3"></v-textarea>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="px-5 py-4 ga-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeEditDialog()" size="large">Cancel</v-btn>
          <v-btn @click="editBook()" :disabled="!isEditFormValid | editBookDialogIsLoading" :loading="editBookDialogIsLoading" variant="flat" color="blue" size="large" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- Add Book Dialog -->
  <v-dialog v-model="addBookDialog" max-width="600">
    <v-form v-model="isAddFormValid" @submit.prevent>
      <v-card rounded="lg" :loading="addBookDialogIsLoading" accent="blue">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
        </template>
        <v-card-title class="px-2 py-1 my-0 d-flex justify-space-between align-center">
          <div class="pl-3 d-flex align-center">
            <v-icon color="grey-darken-1">mdi-book-outline</v-icon>
            <v-responsive class="mx-auto" min-width="200">
              <v-text-field label="Series" variant="underlined" min-width="200" v-model="newBook.series" color="blue"></v-text-field>
            </v-responsive>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="closeAddDialog()"></v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <div class="justify-center text-center d-flex flex-column">
            <v-responsive class="mx-auto" min-width="300">
              <v-text-field label="Title" variant="underlined" v-model="newBook.title" :rules="requiredRule" color="blue"></v-text-field>
            </v-responsive>

            <v-responsive class="mx-auto" min-width="300">
              <v-text-field label="Date Published" variant="underlined" v-model="newBook.date_published" :rules="dateFormatRule" color="blue" placeholder="YYYY-MM-DD" required="false"></v-text-field>
            </v-responsive>

            <!-- <div class="justify-center mb-2 text-center d-flex align-center">
              <p class="text-h6 font-weight-light text-yellow-darken-2">{{ newBook.rating }}</p>
              <v-rating v-model="newBook.rating" color="yellow-darken-2" density="comfortable" clearable hover half-increments></v-rating>
            </div> -->

            <div v-if="newBook.cover && newBook.cover != null && newBook.cover != undefined && newBook.cover_display != null && newBook.cover_display != undefined">
              <v-img height="300" :src="newBook.cover_display"></v-img>
            </div>

            <div v-else class="cursor-pointer upload_book_area pa-6" style="cursor: pointer" @click="$refs.bookCoverUpload.click()">
              <v-text class="justify-center d-flex text-grey-lighten-1" color="grey-lighten-1">Upload Book Cover</v-text>
              <v-icon icon="mdi-image-area" color="grey-lighten-1" size="x-large"></v-icon>
            </div>

            <div class="justify-center mb-0 d-flex flex-column">
              <v-file-input
                prepend-icon="mdi-image-area"
                clearable
                ref="bookCoverUpload"
                label="Upload Book Cover"
                variant="outlined"
                accept="image/*"
                @change="onNewBookImageChange($event)"
                rounded="lg"
                color="blue"
                class="d-none"
              ></v-file-input>

              <v-responsive class="mx-auto" min-width="300">
                <v-btn :disabled="!newBook.cover" prepend-icon="mdi-close-box" @click="newBook.cover = null" class="mt-3" variant="text" color="red" :max-width="300">Remove Book Cover</v-btn>
                <v-autocomplete clearable label="Author" variant="underlined" v-model="newBook.author_name" :items="allAuthorNames" :rules="requiredRule" color="blue"></v-autocomplete>
              </v-responsive>
              <v-textarea label="Description" variant="underlined" v-model="newBook.description" color="blue" auto-grow :rows="3"></v-textarea>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="px-5 py-4 ga-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeAddDialog()" size="large">Close</v-btn>
          <v-btn @click="addBook()" :disabled="!isAddFormValid | addBookDialogIsLoading" :loading="addBookDialogIsLoading" variant="flat" color="blue" size="large" type="submit">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- Delete Book Dialog -->
  <v-dialog v-model="deleteBookDialog" max-width="500">
    <v-card>
      <v-card-title>
        <v-text class="text-red">Delete Book?</v-text>
      </v-card-title>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" color="blue" height="3" indeterminate></v-progress-linear>
      </template>
      <v-card-text>
        Are you sure you want to delete <strong>{{ selectedBook.title }}</strong
        >? This action cannot be undone.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDeleteDialog()">Cancel</v-btn>
        <v-btn @click="deleteBook()" color="red">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Title Area -->
  <div class="px-10 pt-10 text-center">
    <h1 class="text-h3 text-blue">Our Collection</h1>
    <h6 class="text-h6">Here are some books recommended just for you!</h6>
    <div class="justify-end my-3 d-flex mobile-styles">
      <v-btn @click="openAddDialog()" variant="flat" prepend-icon="mdi-plus" color="blue" size="large" type="submit">Add Book</v-btn>
    </div>
    <v-progress-linear v-if="isLoadingBooks" color="blue" class="mt-12" width="200" indeterminate></v-progress-linear>
  </div>

  <!-- Book List -->
  <v-sheet class="justify-center d-flex flex-column align-center">
    <v-sheet class="flex-wrap px-10 py-5 d-flex ga-10 mobile-styles">
      <v-hover v-for="book in booksList">
        <template v-slot:default="{ isHovering, props }">
          <v-card v-if="!isLoadingBooks" @click="openBookDialog(book)" v-bind="props" :color="isHovering ? 'blue' : undefined" variant="outlined" hover :width="240">
            <v-img v-if="book.cover" class="text-white" height="300" :src="book.cover" position="top" cover></v-img>
            <div v-else class="default_book_area light pa-6" style="width: 100%; height: 300px" @click="$refs.bookCoverUpload.click()">
              <v-icon icon="mdi-book-open-blank-variant-outline" color="grey-lighten-1" style="font-size: 80px; width: 80px; height: 80px"></v-icon>
            </div>
            <div class="justify-center pt-2 text-center d-flex align-center">
              <p class="text-h6 font-weight-normal text-yellow-darken-2">{{ book.overall_rating }}</p>
              <v-rating v-model="book.overall_rating" active-color="yellow-darken-2" color="yellow-darken-2" density="compact" readonly hover half-increments></v-rating>
            </div>

            <v-card-item class="text-center pa-0">
              <v-card-title>
                {{ book.title }}
              </v-card-title>
              <!-- <v-card-subtitle>{{ book.author.name }}</v-card-subtitle> -->
            </v-card-item>

            <v-card-text class="text-center text-medium-emphasis">{{ book.author.name }}</v-card-text>
          </v-card>
        </template>
      </v-hover>
    </v-sheet>
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

<script src="./BooksView.ts" />
<style src="./BooksView.scss" />

<style scoped>
@media (max-width: 600px) {
  .mobile-styles {
    justify-content: center !important;
  }
}
</style>
