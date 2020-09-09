
<template>
  <v-container>
    <v-stepper v-model="element" dark>
      <v-overlay :value="mainoverlay" opacity="0.7" color="grey">
        <p>Go to home page</p>
      </v-overlay>
      <!-- stepper headers -->
      <v-stepper-header>
        <v-stepper-step :complete="element > 1" step="1" />
        <v-divider></v-divider>
        <v-stepper-step :complete="element > 2" step="2" />
        <v-divider></v-divider>
        <v-stepper-step :complete="element > 3" step="3" />
        <v-divider></v-divider>
        <v-stepper-step :complete="element > 4" step="4" />
      </v-stepper-header>
      <!-- stepper items -->
      <v-stepper-items>
        <!-- stepper item 3 -->
        <v-stepper-content step="3">
          <v-card class="pa-5 mb-5" dark>
            <v-overlay :value="overlay" absolute color="primary" opacity="0.2">
              <v-progress-circular indeterminate size="50"></v-progress-circular>
            </v-overlay>
            <v-container>
              <v-card-subtitle class="text-center orange--text">
                <b>Setup your profile</b>
              </v-card-subtitle>
              <v-form ref="signupform2">
                <v-row>
                  <v-select
                    dense
                    prepend-icon="mdi-account-tie"
                    v-model="send.user_gender"
                    item-text="text"
                    item-value="value"
                    :items="gender"
                    label="Gender"
                    color="orange"
                    dark
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
                        color="orange"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="bday" scrollable color="orange">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-row>
                <!-- {{new Date(bday).getTime()}} -->
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
                    color="orange"
                  />
                </v-row>
                <v-row justify="center">
                  <v-chip
                    v-for="(chip,i) in chipmaker"
                    :key="i"
                    class="ma-2"
                    color="primary"
                  >{{chip}}</v-chip>
                </v-row>
                <v-row class="mt-3">
                  <v-textarea
                    dense
                    label="about"
                    type="text"
                    v-model="send.about"
                    prepend-icon="mdi-information"
                    color="orange"
                    outlined
                    height="60px"
                  />
                </v-row>
                <v-row justify="end">
                  <v-btn color="primary" @click="sendforaddingdetails">next</v-btn>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
          <v-row justify="end" class="pa-2">
            <v-btn text @click="cancel_1" :disabled="overlay">Cancel</v-btn>
            <v-btn text @click="skiptoprofile" :disabled="overlay" class="orange--text">Skip</v-btn>
          </v-row>
        </v-stepper-content>
        <!-- stepper content 4 -->
        <v-stepper-content step="4">
          <v-card class="pa-10">
            <div id="croppie"></div>
            <v-row justify="space-between">
              <input
                name="image-upload"
                type="file"
                id="upload-image"
                v-on:change="setUpFileUploader"
              />
              <v-btn v-on:click="uploadFile">upload</v-btn>
            </v-row>
            <v-row justify="end" class="mt-5">
              <v-btn text @click="skiptoprofile" class="orange--text">Skip</v-btn>
            </v-row>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
      <dialog-box />
    </v-stepper>
  </v-container>
</template>


<script>
import Croppie from "croppie";
import dialogbox from "../miscellaneous/alert.vue";
import Cookies from "universal-cookie";
import querystring from "query-string";
import naga from "../../assets/logo.png";
const cookies = new Cookies();
export default {
  components: {
    "dialog-box": dialogbox
  },
  data() {
    return {
      element: 3,
      date: "",
      modal: false,
      mainoverlay: false,
      overlay: false,
      croppie: null,
      image: null,
      bday: "",
      gender: [
        { text: "--Select--", value: "" },
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
        { text: "Do not specify", value: "do not specify" }
      ],
      send: {
        user_gender: "",
        user_age: "",
        about: "",
        interests: ""
      }
    };
  },
  methods: {
    cancel_1: function() {
      this.$router.push("profile");
    },
    sendforaddingdetails: function() {
      this.overlay = true;
      this.$axios
        .post(
          "/adduserdetails",
          {
            user_gender: this.send.user_gender,
            user_birthday: new Date(this.bday).getTime(),
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
            this.element = 4;
            this.overlay = false;
            this.$on("imgUploaded", function(imageData) {
              this.image = imageData;
              this.croppie.destroy();
              this.setUpCroppie(imageData);
            });
            this.image = naga;
            this.setUpCroppie();
          }
          if (Response.data.error) {
            this.overlay = false;
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

    uploadFile() {
      this.croppie
        .result({
          format: "jpeg",
          quality: 1,
          type: "base64",
          size: "viewport"
        })
        .then(async response => {
          /* IF blob use to convert to file */
          // var picdata = new File([response], "name.jpeg", {
          //   type: "image/jpeg"
          // });
          // console.log(picdata);
          // var onform = new FormData();
          // onform.append("file", picdata);
          this.$axios
            .post(
              "/uploadprofilephoto",
              { file: response },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              if (Response.data.success) {
                this.$router.push("profile");
              }
              if (Response.data.error) {
                this.$store.dispatch("alertdialog", {
                  show: true,
                  type: "yellow darken-2",
                  title: "Warning !",
                  message: Response.data.error,
                  buttontext: "ok"
                });
              }
            });
        });
    },
    setUpCroppie() {
      let el = document.getElementById("croppie");
      this.croppie = new Croppie(el, {
        viewport: { width: 200, height: 200 },
        boundary: { width: 220, height: 220 },
        showZoomer: true,
        enableOrientation: true
      });
      this.croppie.bind({
        url: this.image
      });
    },
    setUpFileUploader(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();
      console.log(file);
      var vm = this;
      reader.onload = e => {
        vm.image = e.target.result;
        // console.log(e.target.result);
        this.$emit("imgUploaded", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    skiptoprofile: function() {
      this.$router.push("profile");
    }
  },
  created() {
    const querydata = querystring.parse(location.search);
    if (querydata.token) {
      cookies.set("token", querydata.token, {
        expires: new Date(Date.now() + 2.592e8),
        secure: false,
        sameSite: true
      });
    } else if (querydata.error) {
      this.mainoverlay = true;
      this.$store.dispatch("alertdialog", {
        show: true,
        type: "error darken-2",
        title: "Error !",
        message: querydata.error,
        buttontext: "ok"
      });
    } else {
      this.$router.push("/");
    }
  },
  computed: {
    chipmaker: function() {
      return this.send.interests.split(",").filter(x => x !== "");
    }
  }
};
</script>
<style>
.croppie-container {
  width: 100%;
  height: 100%;
}

.croppie-container .cr-image {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  max-height: none;
  max-width: none;
}

.croppie-container .cr-boundary {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.croppie-container .cr-viewport,
.croppie-container .cr-resizer {
  position: absolute;
  border: 2px solid #fff;
  margin: auto;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  box-shadow: 0 0 2000px 2000px rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.croppie-container .cr-resizer {
  z-index: 2;
  box-shadow: none;
  pointer-events: none;
}

.croppie-container .cr-resizer-vertical,
.croppie-container .cr-resizer-horisontal {
  position: absolute;
  pointer-events: all;
}

.croppie-container .cr-resizer-vertical::after,
.croppie-container .cr-resizer-horisontal::after {
  display: block;
  position: absolute;
  box-sizing: border-box;
  border: 1px solid black;
  background: #fff;
  width: 10px;
  height: 10px;
  content: "";
}

.croppie-container .cr-resizer-vertical {
  bottom: -5px;
  cursor: row-resize;
  width: 100%;
  height: 10px;
}

.croppie-container .cr-resizer-vertical::after {
  left: 50%;
  margin-left: -5px;
}

.croppie-container .cr-resizer-horisontal {
  right: -5px;
  cursor: col-resize;
  width: 10px;
  height: 100%;
}

.croppie-container .cr-resizer-horisontal::after {
  top: 50%;
  margin-top: -5px;
}

.croppie-container .cr-original-image {
  display: none;
}

.croppie-container .cr-vp-circle {
  border-radius: 50%;
}

.croppie-container .cr-overlay {
  z-index: 1;
  position: absolute;
  cursor: move;
  touch-action: none;
}

.croppie-container .cr-slider-wrap {
  width: 75%;
  margin: 15px auto;
  text-align: center;
}

.croppie-result {
  position: relative;
  overflow: hidden;
}

.croppie-result img {
  position: absolute;
}

.croppie-container .cr-image,
.croppie-container .cr-overlay,
.croppie-container .cr-viewport {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}

/*************************************/
/***** STYLING RANGE INPUT ***********/
/*************************************/
/*http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html */
/*************************************/

.cr-slider {
  -webkit-appearance: none;
  /*removes default webkit styles*/
  /*border: 1px solid white; */ /*fix for FF unable to apply focus style bug */
  width: 300px;
  /*required for proper track sizing in FF*/
  max-width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: transparent;
}

.cr-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.5);
  border: 0;
  border-radius: 3px;
}

.cr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #ddd;
  margin-top: -6px;
}

.cr-slider:focus {
  outline: none;
}
/*
.cr-slider:focus::-webkit-slider-runnable-track {
background: #ccc;
}
*/

.cr-slider::-moz-range-track {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.5);
  border: 0;
  border-radius: 3px;
}

.cr-slider::-moz-range-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #ddd;
  margin-top: -6px;
}

/*hide the outline behind the border*/
.cr-slider:-moz-focusring {
  outline: 1px solid white;
  outline-offset: -1px;
}

.cr-slider::-ms-track {
  width: 100%;
  height: 5px;
  background: transparent;
  /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
  border-color: transparent; /*leave room for the larger thumb to overflow with a transparent border */
  border-width: 6px 0;
  color: transparent; /*remove default tick marks*/
}
.cr-slider::-ms-fill-lower {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.cr-slider::-ms-fill-upper {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.cr-slider::-ms-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #ddd;
  margin-top: 1px;
}
.cr-slider:focus::-ms-fill-lower {
  background: rgba(0, 0, 0, 0.5);
}
.cr-slider:focus::-ms-fill-upper {
  background: rgba(0, 0, 0, 0.5);
}
/*******************************************/

/***********************************/
/* Rotation Tools */
/***********************************/
.cr-rotate-controls {
  position: absolute;
  bottom: 5px;
  left: 5px;
  z-index: 1;
}
.cr-rotate-controls button {
  border: 0;
  background: none;
}
.cr-rotate-controls i:before {
  display: inline-block;
  font-style: normal;
  font-weight: 900;
  font-size: 22px;
}
.cr-rotate-l i:before {
  content: "↺";
}
.cr-rotate-r i:before {
  content: "↻";
}
</style>
