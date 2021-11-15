<template>
  <v-layout row justify-center>
    <v-app-bar
      app
      dark
      fixed
      color="blue-grey darken-1"
      class="hidden-xs-and-down"
    >
      <v-img
        class="mx-2"
        src="https://i.imgur.com/qgGY4tB.png"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
      <v-toolbar-title>Company Name</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-for="item in nav"
          :key="item.icon"
          :to="item.to"
          :title="item.title"
          text
          >{{ item.text }}</v-btn
        >
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text slot="activator" small v-on="on"
              >{{ user.FName }} {{ user.LName }}
              <v-icon>mdi-chevron-down</v-icon></v-btn
            >
          </template>
          <v-list>
            <!-- <v-list-item>
              <v-icon class="mr-2">mdi-cog</v-icon>
              <v-list-item-title>Settings</v-list-item-title></v-list-item
            > -->
            <v-list-item @click="logout">
              <v-icon class="mr-2">mdi-exit-to-app</v-icon>
              <v-list-item-title>Logout</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
        <v-avatar>
          <v-img src="http://i.pravatar.cc/150?img=55"></v-img>
        </v-avatar>
      </v-toolbar-items>
    </v-app-bar>

    <v-app-bar
      app
      dark
      fixed
      color="blue-grey darken-3"
      class="hidden-sm-and-up"
    >
      <v-img
        class="mx-2"
        src="https://i.imgur.com/qgGY4tB.png"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
      <v-toolbar-title>Company Name</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        close-on-content
      >
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
        </template>
        <v-card>
          <v-app-bar flat color="blue-grey darken-2">
            <v-img
              class="mx-2"
              src="https://i.imgur.com/qgGY4tB.png"
              max-height="40"
              max-width="40"
              contain
            ></v-img>
            <v-toolbar-title>Company Name</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>

          <v-list>
            <v-list-item
              v-for="(item, index) in nav"
              :key="index"
              :to="item.to"
              @click.stop="dialog = false"
            >
              <v-list-item-action>
                <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title :title="item.title">{{
                  item.text
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main app fluid>
      <v-slide-x-transition mode="out-in">
        <router-view />
      </v-slide-x-transition>
    </v-main>
  </v-layout>
</template>
<script>
import { mapGetters } from "vuex";
import { storeActions } from "@/store/actions.constants";

export default {
  data: () => ({
    dialog: false,
    navs: [
      {
        icon: "mdi-home",
        text: "Home",
        title: "Back to Home page",
        to: { name: "restaurants" },
        permission: ["admin", "user"],
      },
      {
        icon: "mdi-account-multiple",
        text: "Users",
        title: "User management",
        permission: ["admin"],
        to: { name: "Users" },
      },
      {
        icon: "mdi-food",
        text: "Bookings",
        title: "Booking management",
        permission: ["admin", "user"],
        to: { name: "Booking" },
      },
      // {
      //   icon: "mdi-information-outline",
      //   text: "About",
      //   title: "About this demo",
      //   permission: ["admin", "user"],
      //   to: { name: "About" },
      // },
      // {
      //   icon: "mdi-email",
      //   text: "Contact",
      //   title: "Our Contact info",
      //   permission: ["admin", "user"],
      //   to: { name: "Contact" },
      // },
    ],
  }),
  computed: {
    nav: function() {
      return this.navs.filter((item) =>
        item.permission.includes(this.user.role)
      );
    },
    ...mapGetters("user", ["isAdmin", "user"]),
  },
  methods: {
    logout() {
      this.$store
        .dispatch(`user/${storeActions.logoutAction}`)
        .then(() => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: "Logged out...!",
            timeout: 3000,
            color: "success",
          });
          this.$router.push({ name: "Login" });
        })
        .catch((err) => {
          this.$router.push({ name: "Login" });
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
  },
  beforeMount() {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      event.returnValue = "";
    });
  },

  beforeDestroy() {
    window.removeEventListener("beforeunload", (event) => {
      event.preventDefault();
      event.returnValue = "";
    });
  },
};
</script>
