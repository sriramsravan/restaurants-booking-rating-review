<script>
import { storeActions } from "@/store/actions.constants";

export default {
  props: {
    card: Object,
  },
  data() {
    return {
      loading: false,
      menu2: false,
      slots: [
        { hours: 10, mins: 0, type: "AM" },
        { hours: 10, mins: 30, type: "AM" },
        { hours: 10, mins: 0, type: "PM" },
        { hours: 10, mins: 30, type: "PM" },
      ],
      name: this.card.name,
      booking: false,
      tables: [1, 2, 3, 5, 6, 7, 8, 9],
      table: null,
      slot: null,
      minDate: new Date().toISOString().substr(0, 10),
      maxDate: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .substr(0, 10),
      date: null,
    };
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    submissionStartDateWithTimeZone() {
      let date = new Date(this.computedDateFormatted);
      date.setHours(
        this.slot.type === "AM" ? this.slot.hours : this.slot.hours + 12
      );
      date.setMinutes(this.slot.mins);
      return date.toISOString();
    },
    submissionEndDateWithTimeZone() {
      let date = new Date(this.computedDateFormatted);
      date.setHours(
        this.slot.type === "AM" ? this.slot.hours : this.slot.hours + 12
      );
      date.setMinutes(+this.slot.mins + 30);
      return date.toISOString();
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    bookATable() {
      this.loading = true;
      this.$store
        .dispatch(`booking/${storeActions.createBooking}`, {
          data: {
            restaurant: this.card._id,
            bookingStart: this.submissionStartDateWithTimeZone,
            bookingEnd: this.submissionEndDateWithTimeZone,
            tableNo: this.table,
          },
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.$emit("reloadNow");
          this.booking = false;
        })
        .catch((err) => {
          console.log(err);
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<template>
  <v-dialog v-model="booking" width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        outlined
        v-on="on"
        slot="activator"
        @click="
          date = null;
          $refs.bookATable && $refs.bookATable.reset();
        "
        >Book Now</v-btn
      >
    </template>
    <v-card :loading="loading">
      <v-card-title>
        <h2>Book A Table at {{ name }}</h2>
      </v-card-title>

      <v-card-text>
        <v-form ref="bookATable">
          <v-row>
            <v-select
              v-model="table"
              label="Table"
              :rules="[(v) => !!v || 'Table No. is required']"
              :items="tables"
              required
            ></v-select>
          </v-row>
          <v-row
            ><v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="computedDateFormatted"
                  label="Date (read only text field)"
                  hint="MM/DD/YYYY format"
                  :rules="[(v) => !!v || 'Required']"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                @input="menu2 = false"
                :min="minDate"
                :max="maxDate"
              ></v-date-picker> </v-menu
          ></v-row>
          <v-chip-group
            v-model="slot"
            active-class="primary--text"
            column
            mandatory
          >
            <v-chip
              v-for="slot in slots"
              :key="`${slot.hours}:${slot.mins} ${slot.type}`"
              :value="slot"
            >
              {{
                `${String(slot.hours).padStart(2, 0)}:${String(
                  slot.mins
                ).padStart(2, 0)} ${slot.type}`
              }}
            </v-chip>
          </v-chip-group>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="booking = false" color="error">Cancel</v-btn>
        <v-btn
          @click="$refs.bookATable.validate() ? bookATable() : null"
          color="success"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog></template
>
