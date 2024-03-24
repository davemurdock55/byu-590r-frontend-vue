<template>
  <v-dialog @keyup.esc="forgotPasswordDialog = false" v-model="forgotPasswordDialog" :scrim="false">
    <v-container>
      <v-card title="Forgot Password?" rounded="lg">
        <v-card-text>
          <v-text-field v-model="email" label="Password Reset Email" :rules="emailRules" hide-details="auto" color="blue" rounded="lg" variant="outlined"></v-text-field>
          <v-card-actions>
            <v-btn variant="text" @click="forgotPasswordDialog = false">Close</v-btn>
            <v-btn variant="flat" color="blue">Submit</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </v-dialog>
  <v-dialog @keyup.esc="registerDialog = false" v-model="registerDialog" :scrim="false">
    <v-container>
      <v-card title="Register" rounded="lg">
        <v-card-text>
          <v-form v-model="isRegisterFormValid" @submit.prevent="submitRegister">
            <v-text-field v-model="register.name" :rules="nameRules" label="Name" color="blue" variant="outlined" rounded="lg" required></v-text-field>
            <v-text-field v-model="register.email" :rules="emailRules" label="Email" color="blue" variant="outlined" rounded="lg" required></v-text-field>
            <v-text-field v-model="register.password" :rules="passwordRules" label="Password" type="password" color="blue" variant="outlined" rounded="lg" required></v-text-field>
            <v-text-field
              @keyup.enter="submitRegister()"
              v-model="register.c_password"
              :rules="passwordRules"
              label="Confirm Password"
              type="password"
              color="blue"
              variant="outlined"
              rounded="lg"
              required
            ></v-text-field>
            <small>*indicates required field</small>
            <v-card-actions class="pa-0">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="registerDialog = false" size="large">Close</v-btn>
              <v-btn @click="submitRegister()" variant="flat" color="blue" :disabled="!isRegisterFormValid" :loading="registerFormIsLoading" size="large" type="submit">Sign Up</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-dialog>
  <div class="login-page-content">
    <!-- <div class="login-form-container"> -->
    <v-card rounded="xl" class="pa-5">
      <v-form v-model="isLoginFormValid" @submit.prevent="submitLogin">
        <div className="inside-form-container">
          <h2 className="login-header">Welcome to Bookhaven</h2>
          <div className="form-inputs">
            <v-text-field v-model="email" :rules="emailRules" label="Email" color="blue" variant="outlined" rounded="lg" required></v-text-field>
            <v-text-field @keyup.enter="submitLogin()" v-model="password" :rules="passwordRules" label="Password" type="password" color="blue" variant="outlined" rounded="lg" required></v-text-field>
          </div>
          <v-alert v-if="alertMessage !== ''" @click="alertMessage = ''" closable :type="alertType" style="margin-bottom: 25px">{{ alertMessage }}</v-alert>
        </div>
        <div className="login-form-button-group">
          <v-btn v-if="!isAuthenticated" @click="submitLogin()" :loading="isLoading" :disabled="!isLoginFormValid" type="submit" variant="flat" color="blue">Login</v-btn>
          <v-btn @click="registerDialog = true" variant="outlined" color="blue">Register</v-btn>
          <v-btn @click="forgotPasswordDialog = true" variant="text" color="blue">Forgot Password?</v-btn>
        </div>
      </v-form>
    </v-card>
    <!-- </div> -->
  </div>
</template>

<script src="./LoginView.ts" />
<style src="./LoginView.scss" />
