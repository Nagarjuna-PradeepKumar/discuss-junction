<template>
  <v-card min-width="500px" class="background">
    <v-card-title>Change your details</v-card-title>
    <v-container>
      <v-form ref="changedetailsform">
        <v-container>
          <v-row>
            <v-select
              dense
              outlined
              prepend-icon="mdi-account-tie"
              v-model="send.user_gender"
              item-text="text"
              item-value="value"
              :items="gender"
              label="Gender"
            />
          </v-row>
          <v-row>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="bday"
                  label="Birthday"
                  prepend-icon="mdi-cake-variant"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-row>
          <v-row>
            <v-text-field
              class="pb-3"
              persistent-hint
              hint="Add your interests seperated by commas (,)"
              dense
              label="interest"
              type="text"
              v-model="send.interests"
              prepend-icon="mdi-account-box"
            />
          </v-row>
          <v-row>
            <v-textarea
              outlined
              dense
              label="about"
              type="text"
              v-model="send.about"
              prepend-icon="mdi-lock"
              rows="2"
            />
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text v-on:click="closedialog">cancel</v-btn>
        <v-btn color="#1E1E1E" class="white--text" v-on:click="sendforchangingdetails">change</v-btn>
      </v-card-actions>
    </v-container>
    <!-- common dialog box -->
    <dialog-box />
  </v-card>
</template>
<script>
import Cookies from "universal-cookie";
import dialogbox from "../../components/miscellaneous/alert";
const cookies = new Cookies();
export default {
  name: "change_userdetails",
  components: {
    "dialog-box": dialogbox
  },
  props: ["predetails"],
  data: () => ({
    modal: false,
    date: null,
    gender: [
      { text: "--Select--", value: "" },
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
      { text: "Other", value: "other" },
      { text: "Do not specify", value: "do not specify" }
    ],
    send: {
      user_gender: "",
      about: "",
      interests: []
    }
  }),
  methods: {
    sendforchangingdetails: function() {
      this.overlay = true;
      this.$axios
        .post(
          "/adduserdetails",
          {
            user_gender: this.send.user_gender,
            user_birthday: new Date(this.date).getTime(),
            about: this.send.about,
            interests: this.send.interests
          },
          {
            headers: { Authorization: `Bearer ${cookies.get("token")}` }
          }
        )
        .then(Response => {
          console.log(Response.data);
          if (Response.data.success) {
            this.$emit("changedetail", {
              user_gender: this.send.user_gender,
              user_birthday: new Date(this.bday).getTime(),
              about: this.send.about,
              interests: this.send.interests.split(",").filter(x => x != "")
            });
          }
          if (Response.data.error) {
            this.$emit("changedetail");
            this.$store.dispatch("alertdialog", {
              show: true,
              type: "yellow darken-2",
              title: "Warning !",
              message: Response.data.error,
              buttontext: "ok"
            });
          }
        });
    },
    closedialog: function() {
      this.$emit("changedetail");
    }
  },
  mounted() {
    this.send.user_gender = this.predetails.user_gender;
    this.send.about = this.predetails.about;
    this.send.interests = this.predetails.interests.join();
    if (this.predetails.user_birthday) {
      const d = new Date(this.predetails.user_birthday);
      return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
        "0" + d.getDate()
      ).slice(-2)}`;
    }
  },
  computed: {
    bday: function() {
      if (this.date === null) {
        const date = new Date(this.predetails.user_birthday);
        return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}-${("0" + date.getDate()).slice(-2)}`;
      } else {
        const date = new Date(this.date);
        return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}-${("0" + date.getDate()).slice(-2)}`;
      }
    },
    chipmaker: function() {
      if (Array.isArray(this.send.interests)) {
        return this.send.interests;
      } else {
        return this.send.interests.split(",").filter(x => x != "");
      }
    }
  }
};
</script>
<style scoped>
.background {
  background-color: #5b4d31;
}
</style>