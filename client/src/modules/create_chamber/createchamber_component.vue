
<template>
  <v-container>
    <v-stepper v-model="element" class="titlebg">
      <!-- stepper headers -->
      <v-stepper-header>
        <v-stepper-step :complete="element > 1" step="1" />
        <v-divider></v-divider>
        <v-stepper-step :complete="element > 2" step="2" />
        <v-divider></v-divider>
        <v-stepper-step :complete="element > 3" step="3" />
      </v-stepper-header>
      <!-- stepper items -->
      <v-stepper-items>
        <!-- stepper item1 -->
        <v-stepper-content step="1" class="mb-0 pb-0">
          <v-row justify="center" class="ma-0 pa-0">
            <v-card class="pa-6 mb-12 sandal" max-width="600px" width="500px">
              <v-overlay :value="overlay_1" absolute color="titlebg">
                <v-progress-circular indeterminate size="50"></v-progress-circular>
              </v-overlay>
              <v-card-subtitle class="text-center">
                <b>Enter the details</b>
              </v-card-subtitle>

              <v-form ref="createform">
                <v-text-field
                  class="mb-3"
                  dense
                  label="Chamber name"
                  type="text"
                  v-model="send.chamber_name"
                  prepend-icon="mdi-google-circles-communities"
                  :rules="[v => !!v || 'chamber name is required']"
                />
                <v-text-field
                  class="mb-3"
                  dense
                  hint="maximum of 250 characters is allowed"
                  label="description"
                  type="text"
                  v-model="send.chamber_description"
                  prepend-icon="mdi-information-variant"
                  :rules="[v => !!v || 'Description is required',v => (v && v.length <= 250) || 'description must be less than 250 characters',]"
                />
                <v-textarea
                  dense
                  label="Hashtags"
                  type="text"
                  hint="start hashtags with #"
                  persistent-hint
                  v-model="entry_hashtags"
                  prepend-icon="mdi-pound"
                  rows="2"
                  value="asd"
                />
                <v-chip v-for="(chip,i) in chips" :key="i" class="ma-2" color="primary">{{chip}}</v-chip>
              </v-form>
              <v-row class="mt-5">
                <v-btn
                  @click="delete_chamber"
                  v-if="chamber_id!=''"
                  class="orange--text"
                  color="titlebg"
                >delete</v-btn>
                <v-spacer />
                <v-btn text @click="cancel_1">Cancel</v-btn>
                <v-btn color="primary" @click="submitdetails">next</v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-stepper-content>
        <!-- stepper content2 -->
        <v-stepper-content step="2">
          <v-row justify="center">
            <v-card class="pa-10 cardbg" max-width="600px " :loading="imageloading">
              <div id="croppie"></div>
              <v-row justify="center" class="white--text pa-0 ma-0">
                <input
                  name="image-upload"
                  type="file"
                  id="upload-image"
                  v-on:change="setUpFileUploader"
                />
                <v-btn color="orange" v-on:click="uploadFile">upload</v-btn>
              </v-row>
            </v-card>
          </v-row>
          <v-row justify="center" class="mt-5">
            <v-btn text @click="delete_chamber" v-if="chamber_id!=''">delete</v-btn>
          </v-row>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-row justify="center" class="mt-5">
            <v-card min-height="250px" class="cardbg" width="400px">
              <v-container class="fill-height">
                <v-row justify="center">
                  <v-img :src="image" max-height="150px" max-width="150px" />
                </v-row>
                <v-row justify="space-between" class="mt-6">
                  <v-btn @click="gotoprofile">back</v-btn>
                  <v-btn color="orange" @click="joinchamber(chamber_id)">join</v-btn>
                </v-row>
              </v-container>
            </v-card>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
      <dialog-box />
    </v-stepper>
  </v-container>
</template>
<script>
import Croppie from "croppie";
import Cookies from "universal-cookie";
import dialogbox from "../../components/miscellaneous/alert";
import mixin from "../../mixin/joinleave_mixin";
import naga from "../../assets/logo.png";
const cookies = new Cookies();
export default {
  name: "createchamber_component",
  components: {
    "dialog-box": dialogbox
  },
  mixins: [mixin],
  data: () => ({
    imageloading:false,
    editmode: false,
    croppie: null,
    image: null,
    element: 1,
    overlay_1: false,
    entry_hashtags: "",
    chamber_id: "",
    send: {
      scheduled_time: "null",
      chamber_name: "",
      chamber_description: ""
    }
  }),
  methods: {
    cancel_1: function() {
      this.send = {
        scheduled_time: "null",
        chamber_name: "",
        chamber_description: ""
      };
      this.entry_hashtags = "";
      this.$refs.createform.resetValidation();
    },
    submitdetails: async function() {
      if (this.$refs.createform.validate()) {
        this.overlay_1 = true;
        this.$axios
          .post(
            this.editmode ? "/changechamberdetails" : "/createchamber",
            {
              scheduled_time: this.send.scheduled_time,
              chamber_name: this.send.chamber_name,
              chamber_description: this.send.chamber_description,
              hashtags: this.entry_hashtags.split("#").filter(x => x != "")
            },
            {
              headers: {
                Authorization: `Bearer ${await cookies.get("token")}`
              }
            }
          )
          .then(Response => {
            console.log(Response.data);
            if (Response.data.success) {
              this.chamber_id = Response.data.success;
              this.element = 2;
              this.overlay_1 = false;
              this.editmode = false;
              this.$on("imgUploaded", function(imageData) {
                this.image = imageData;
                this.croppie.destroy();
                this.setUpCroppie(imageData);
              });
              this.image = naga;
              this.setUpCroppie();
            }
            if (Response.data.error) {
              this.overlay_1 = false;
              this.$store.dispatch("alertdialog", {
                show: true,
                type: "yellow darken-2",
                title: "Warning !",
                message: Response.data.error,
                buttontext: "ok"
              });
            }
          });
      }
    },
    delete_chamber: async function() {
      this.$axios
        .post(
          "/deletechamber",
          {
            chamber_id: this.chamber_id
          },
          {
            headers: {
              Authorization: `Bearer ${await cookies.get("token")}`
            }
          }
        )
        .then(Response => {
          if (Response.data.success) {
            this.element = 1;
            this.chamber_id = "";
            (this.entry_hashtags = ""),
              (this.send = {
                scheduled_time: "null",
                chamber_name: "",
                chamber_description: "",
                hashtags: []
              });
            this.cancel_1();
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
    },
    uploadFile() {
      this.imageloading=true;
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
              "/uploadchamberpicture",
              { file: response, chamber_id: this.chamber_id },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              this.imageloading=false;
              if (Response.data.success) {
                this.image = response;
                this.element = 3;
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
    gotoprofile: function() {
      this.$router.push("/profile");
    }
  },
  mounted() {
    this.$emit("settab", { id: 2, name: "createchamber" });
  },
  computed: {
    chips: function() {
      return this.entry_hashtags.split("#").filter(x => x != "");
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
  width: 150px;
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

<style>
.cardbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
</style>