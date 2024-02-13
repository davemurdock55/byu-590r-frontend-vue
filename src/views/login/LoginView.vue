<template>
  <v-dialog v-model="forgotPasswordDialog" :scrim="false" persistent>
    <v-card>
      <v-card-text>
        <v-text-field v-model="email" label="Password Reset Email" :rules="emailRules" hide-details="auto"></v-text-field>
        <v-card-actions>
          <v-btn variant="text" @click="forgotPasswordDialog = false">Close</v-btn>
          <v-btn variant="text">Submit</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
  <div class="login-page-content">
    <div class="login-form-container">
      <v-form v-model="isLoginFormValid" @submit.prevent="submitLogin">
        <div className="inside-form-container">
          <h2 className="login-header">Welcome to My App</h2>
          <div className="form-inputs">
            <v-text-field v-model="email" :rules="emailRules" label="Email" color="blue" required></v-text-field>
            <v-text-field @keyup.enter="submitLogin()" v-model="password" :rules="passwordRules" label="Password" type="password" color="blue" required></v-text-field>
          </div>
          <v-alert v-if="alertMessage !== ''" @click="alertMessage = ''" closable :type="alertType" style="margin-bottom: 25px">{{ alertMessage }}</v-alert>
        </div>
        <div className="login-form-button-group">
          <v-btn v-if="!isAuthenticated" @click="submitLogin()" :loading="isLoading" :disabled="!isLoginFormValid" type="submit" variant="flat" color="blue">Log In</v-btn>
          <v-btn @click="forgotPasswordDialog = true" variant="outlined" color="blue">Forgot Password?</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script src="./LoginView.ts" />
<style src="./LoginView.scss" />
