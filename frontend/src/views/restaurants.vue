<template>
  <v-container
    ><v-row
      ><v-spacer></v-spacer>
      <v-dialog v-model="addPopUp" width="400">
        <template v-slot:activator="{ on }">
          <v-btn outlined @click.stop="" v-on="on" slot="activator"
            ><v-icon left>mdi-plus</v-icon>Add
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <h2>Add Restaurant</h2>
          </v-card-title>

          <v-card-text>
            <v-form ref="create">
              <v-row>
                <v-text-field
                  v-model="name"
                  label="Name"
                  required
                ></v-text-field>
              </v-row>
              <v-row
                ><v-text-field
                  v-model="location"
                  label="Location"
                  required
                ></v-text-field
              ></v-row>

              <v-row>
                <v-textarea
                  label="Description"
                  v-model="description"
                  rows="1"
                  auto-grow
                ></v-textarea>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="addPopUp = false" color="error">Cancel</v-btn>
            <v-btn
              @click="$refs.create.validate() ? create() : null"
              color="success"
              >Submit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog></v-row
    >

    <restaurant
      @reloadNow="
        () => {
          data = [];
          disable = false;
          page = 1;
        }
      "
      :card="obj"
      v-for="obj in data"
      :key="obj._id"
    ></restaurant>
    <scroll-loader :loader-method="getAll" :loader-disable="disable">
    </scroll-loader>
  </v-container>
</template>
<script>
import Restaurant from "@/components/restaurant/item";
import { storeActions } from "@/store/actions.constants";

export default {
  components: {
    Restaurant,
  },
  data: () => ({
    data: [],
    disable: false,
    page: 1,
    addPopUp: false,
    valid: false,
    location: null,
    name: null,
    description: null,
  }),
  // mounted() {
  //   this.getAll();
  // },
  methods: {
    getAll() {
      this.$store
        .dispatch(`restaurant/${storeActions.getAllRestaurants}`, {
          params: { page: this.page++ },
        })
        .then((res) => {
          let { docs, ...meta } = res.data;
          this.data = [...this.data, ...docs];
          this.disable = !meta.hasNextPage;
        })
        .catch((err) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
    create() {
      this.$store
        .dispatch(`restaurant/${storeActions.createRestaurant}`, {
          data: {
            name: this.name,
            location: this.location,
            description: this.description,
          },
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.addPopUp = false;
          // this.getAll();
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
