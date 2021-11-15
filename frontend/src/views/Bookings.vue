<template>
  <v-container>
    <v-data-table
      v-if="bookings.length > 0"
      hide-default-footer
      :headers="headers"
      :items="bookings"
      :items-per-page="bookings.length"
      item-key="name"
      class="elevation-1"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <template v-slot:item.duration="{ item }">
        {{ +item.duration * 30 }}</template
      >
      <!-- eslint-disable-next-line vue/no-v-html -->

      <template v-slot:item.bookingStart="{ item }">
        {{ new Date(item.bookingStart).toLocaleString() }}</template
      >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <template v-slot:item.bookingEnd="{ item }">
        {{ new Date(item.bookingEnd).toLocaleString() }}</template
      ></v-data-table
    >
    <scroll-loader :loader-method="getAll" :loader-disable="disable">
    </scroll-loader>
  </v-container>
</template>
<script>
import { storeActions } from "@/store/actions.constants";
export default {
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
          text: "Restaurant Name ",
          value: "restaurant.name",
        },
        { text: "Duration(in mins)", value: "duration" },
        { text: "Booking Time", value: "bookingStart" },
        { text: "Role", value: "bookingEnd" },
      ],
      bookings: [],
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
        .dispatch(`booking/${storeActions.getAllBookings}`, {
          params: { page: this.page++, limit: 15 },
        })
        .then((res) => {
          let { docs, ...meta } = res.data;
          this.bookings = [...this.bookings, ...docs];
          this.disable = !meta.hasNextPage;
          // this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
          //   text: "Create successfully.!",
          //   timeout: 3000,
          //   color: "success",
          // })
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
  },
};
</script>
