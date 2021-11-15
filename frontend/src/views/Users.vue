<template>
  <v-container>
    <v-data-table
      v-if="users.length > 0"
      hide-default-footer
      :headers="headers"
      :items="users"
      :items-per-page="users.length"
      item-key="name"
      class="elevation-1"
      ><template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>User Management</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="userAdd" width="400">
            <template v-slot:activator="{ on }">
              <v-btn @click.stop="" v-on="on"
                ><v-icon left>mdi-account-multiple-plus</v-icon>Add</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <h2>Create a User</h2>
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
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="userAdd = false" color="error">Cancel</v-btn>
                <v-btn
                  @click="$refs.user.validate() ? register() : false"
                  color="success"
                  >Submit</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <template v-slot:item.actions="{ item }">
        <actions
          @reloadNow="
            () => {
              users = [];
              disable = false;
              page = 1;
            }
          "
          :user="item"
        ></actions> </template
    ></v-data-table>
    <scroll-loader :loader-method="getAll" :loader-disable="disable">
    </scroll-loader>
  </v-container>
</template>
<script>
import { storeActions } from "@/store/actions.constants";
import actions from "@/components/users/actions";
export default {
  components: {
    actions,
  },
  data() {
    return {
      disable: false,
      userAdd: false,
      page: 1,
      validRegister: false,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "One A-Z and a-z and 1-9 and min 8 character",
        (v) => /[a-z]/.test(v) || "Atleast One a-z is reqiured",
        (v) => /[A-Z]/.test(v) || "Atleast One A-Z is reqiured",
        (v) => /[0-9]/.test(v) || "Atleast One 0-9 is reqiured",
      ],
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      verify: "",
      show1: false,
      headers: [
        {
          text: "First Name",
          value: "FName",
        },
        { text: "Last Name", value: "LName" },
        { text: "E-Mail", value: "email" },
        { text: "Role", value: "role" },
        { text: "Actions", value: "actions" },
      ],
      users: [],
    };
  },
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },
  mounted() {
    // this.getAll();
  },
  methods: {
    getAll() {
      this.$store
        .dispatch(`user/${storeActions.getAllUsers}`, {
          params: { page: this.page++, limit: 15 },
        })
        .then((res) => {
          let { docs, ...meta } = res.data;
          this.users = [...this.users, ...docs];
          this.disable = !meta.hasNextPage;
          // this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
          //   text: "Create successfully.!",
          //   timeout: 3000,
          //   color: "success",
          // })
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push({ name: "restaurants" });
          }
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    register() {
      let payload = {
        email: this.email,
        password: this.password,
        FName: this.firstName,
        LName: this.lastName,
      };
      this.$store
        .dispatch(`user/${storeActions.createUser}`, { data: payload })
        .then(() => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Create successfully.!",
            timeout: 3000,
            color: "success",
          });
          this.page = 1;
          this.users = [];
          this.disable = false;
          this.userAdd = false;
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
