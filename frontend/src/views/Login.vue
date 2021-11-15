<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card v-model="dialog" persistent max-width="600px" min-width="360px">
          <div>
            <v-tabs v-model="tab" show-arrows icons-and-text dark grow>
              <v-tabs-slider></v-tabs-slider>
              <v-tab v-for="i in tabs" :key="i.name">
                <v-icon large>{{ i.icon }}</v-icon>
                <div class="caption py-1">{{ i.name }}</div>
              </v-tab>
              <v-tab-item>
                <v-card class="px-4">
                  <v-card-text>
                    <v-form
                      ref="loginForm"
                      v-model="validLogin"
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginEmail"
                            :rules="emailRules"
                            label="E-mail"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginPassword"
                            :append-icon="show1 ? 'eye' : 'eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col
                          class="d-flex"
                          cols="12"
                          sm="3"
                          xsm="12"
                          align-end
                        >
                          <v-btn
                            :disabled="!validLogin"
                            color="success"
                            @click="$refs.loginForm.validate() ? login() : null"
                          >
                            Login
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="px-4">
                  <v-card-text>
                    <v-form
                      ref="registerForm"
                      v-model="validRegister"
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="firstName"
                            :rules="[rules.required]"
                            label="First Name"
                            maxlength="20"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="lastName"
                            :rules="[rules.required]"
                            label="Last Name"
                            maxlength="20"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            block
                            v-model="verify"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, passwordMatch]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Confirm Password"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                          <v-btn
                            :disabled="!validRegister"
                            color="success"
                            @click="
                              $refs.registerForm.validate() ? register() : null
                            "
                            >Register</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { storeActions } from "@/store/actions.constants";

export default {
  data: () => ({
    validRegister: false,
    validLogin: false,
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length >= 8) || "One A-Z and a-z and 1-9 and min 8 character",
      (v) => /[a-z]/.test(v) || "Atleast One a-z is reqiured",
      (v) => /[A-Z]/.test(v) || "Atleast One A-Z is reqiured",
      (v) => /[0-9]/.test(v) || "Atleast One 0-9 is reqiured",
    ],

    dialog: false,
    tab: 0,
    tabs: [
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" },
    ],
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },
  beforeMount() {},
  methods: {
    login() {
      let payload = {
        email: this.loginEmail,
        password: this.loginPassword,
      };
      this.$store
        .dispatch(`user/${storeActions.loginAction}`, payload)
        .then(() => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Logged In..!",
            timeout: 3000,
            color: "success",
          });

          this.$store.dispatch(`user/${storeActions.getUser}`);
          this.$router.push({ name: "restaurants" });
        })
        .catch((err) => {
          console.log(err);
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Unable to Log In..!",
            timeout: 3000,
            color: "error",
          });
        });
    },
    register() {
      let payload = {
        email: this.email,
        password: this.password,
        FName: this.firstName,
        LName: this.lastName,
      };
      this.$store
        .dispatch(`user/${storeActions.registerUser}`, {data:payload})
        .then((res) => {
          console.log(res);
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Registered successfully.!",
            timeout: 3000,
            color: "success",
          });
        })
        .catch((err) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
  },
};
</script>
