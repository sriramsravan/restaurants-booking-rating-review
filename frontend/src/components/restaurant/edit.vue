<template>
  <v-dialog v-model="editPopUp" width="400">
    <template v-slot:activator="{ on }">
      <!-- <v-btn outlined slot="activator"
        ><v-icon left>mdi-plus</v-icon>Add
      </v-btn> -->
      <v-list-item v-on="on">
        <v-list-item-title>Edit</v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <h2>Edit Restaurant</h2>
      </v-card-title>

      <v-card-text>
        <v-form ref="update">
          <v-row>
            <v-text-field v-model="name" label="Name" required></v-text-field>
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
        <v-btn @click="editPopUp = false" color="error">Cancel</v-btn>
        <v-btn
          @click="$refs.update.validate() ? update() : null"
          color="success"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { storeActions } from "@/store/actions.constants";
export default {
  name: "restaurant-edit",
  props: {
    card: Object,
  },
  data() {
    return {
      editPopUp: false,
      name: this.card.name,
      location: this.card.location,
      description: this.card.description,
      photo: this.card.img,
    };
  },
  methods: {
    update() {
      this.$store
        .dispatch(`restaurant/${storeActions.editRestaurant}`, {
          id: this.card._id,
          data: {
            name: this.name,
            location: this.location,
            description: this.description,
            img: this.photo,
          },
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.editPopUp = false;
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
  },
};
</script>
