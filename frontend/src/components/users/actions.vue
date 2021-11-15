<template>
  <v-container
    ><v-dialog v-model="userAdd" width="400">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" small>mdi-pencil-outline</v-icon>
      </template>
      <v-card>
        <v-card-title>
          <h2>Update User</h2>
        </v-card-title>

        <v-card-text>
          <v-form ref="user" v-model="validRegister" lazy-validation>
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
                  :rules="[...passwordRules]"
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
                  :rules="[passwordMatch, ...passwordRules]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Confirm Password"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="userAdd = false" color="error">Cancel</v-btn>
          <v-btn
            @click.stop="$refs.user.validate() ? update() : false"
            color="success"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-icon small color="red" @click.stop="deleteItem"
      >mdi-delete-sweep</v-icon
    ></v-container
  >
</template>
<script>
import { storeActions } from "@/store/actions.constants";

export default {
  props: ["user"],
  computed: {
    passwordMatch() {
      return () =>
        !this.password ||
        this.password === this.verify ||
        "Password must match";
    },
  },
  data() {
    return {
      userAdd: false,
      page: 1,
      validRegister: false,
      passwordRules: [
        // (v) => !!v || "Password is required",
        (v) =>
          !v ||
          (v && v.length >= 8) ||
          "One A-Z and a-z and 1-9 and min 8 character",
        (v) => !v || /[a-z]/.test(v) || "Atleast One a-z is reqiured",
        (v) => !v || /[A-Z]/.test(v) || "Atleast One A-Z is reqiured",
        (v) => !v || /[0-9]/.test(v) || "Atleast One 0-9 is reqiured",
      ],
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
      firstName: this.user.FName,
      lastName: this.user.LName,
      email: this.user.email,
      password: null,
      verify: null,
      show1: false,
    };
  },
  methods: {
    deleteItem() {
      this.$store
        .dispatch(`user/${storeActions.deleteUserById}`, {
          id: this.user._id,
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.addPopUp = false;
          this.$emit("reloadNow");
        })
        .catch((err) => {
          console.log(err);
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
    update() {
      let payload = {
        email: this.email,
        password: this.password,
        FName: this.firstName,
        LName: this.lastName,
      };
      this.$store
        .dispatch(`user/${storeActions.updateUserById}`, {
          id: this.user._id,
          data: payload,
        })
        .then(() => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Updated successfully.!",
            timeout: 3000,
            color: "success",
          });
          this.$emit("reloadNow");
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
