<template>
  <v-container>
    <!-- ---------------------------------------------------------------
                         CARD IN NON EDIT MODE
    -------------------------------------------------------------------->
    <!-- {{(Date.now() - this.chamber.created > 300000)?"not editable":"editable"}} -->
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 10 : 2" class="mb-3" v-if="!editmode&&!image_edit">
        <v-overlay :value="overlay" absolute color="sandalbg">
          <v-progress-circular indeterminate size="50"></v-progress-circular>
        </v-overlay>
        <v-container class="cardbg">
          <v-row class="pl-8 pr-8 mb-0 pb-0">
            <v-col cols="11">
              <v-row class="pl-8 pr-8 mb-0 pb-0">
                <v-col cols="12" md="3">
                  <v-row justify="center">
                    <v-img
                      :src="chamber_picture"
                      max-height="100px"
                      max-width="100px"
                      v-if="chamber_picture"
                      class="elevation-2"
                    />
                  </v-row>
                </v-col>
                <v-col class="white--text">
                  <v-row class="pa-0 ma-0">
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">created date:</v-col>
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{date}}</v-col>
                  </v-row>
                  <v-row class="pa-0 ma-0">
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">chamber name:</v-col>
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{send.chamber_name}}</v-col>
                  </v-row>

                  <v-row class="pa-0 ma-0">
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">chamber description:</v-col>
                    <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{send.chamber_description}}</v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="mb-2 white--text" justify="center">hashtags:</v-row>
              <v-row class="ml-5 mr-5" justify="center">
                <v-chip v-for="(chip,i) in send.hashtags" :key="i" class="mr-1 ml-1">{{chip}}</v-chip>
              </v-row>
            </v-col>
            <v-col cols="1">
              <v-row class="mb-1">
                <v-btn
                  color="transparent"
                  x-small
                  fab
                  top
                  right
                  v-show="hover? true:false"
                  @click="deletechamber"
                >
                  <v-icon color="black">mdi-delete</v-icon>
                </v-btn>
              </v-row>
              <v-row v-if="editable" class="mb-1">
                <v-btn
                  color="transparent"
                  x-small
                  fab
                  top
                  right
                  v-show="hover? true:false"
                  @click="editmode=true"
                >
                  <v-icon color="black">mdi-pencil</v-icon>
                </v-btn>
              </v-row>
              <v-row v-if="editable" class="mb-1">
                <v-btn
                  color="transparent"
                  x-small
                  fab
                  top
                  right
                  v-show="hover? true:false"
                  @click="initiate_image_change"
                >
                  <v-icon color="black">mdi-image-edit</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <!-- common dialog box -->
        <dialog-box />
      </v-card>
    </v-hover>
    <!-- -------------------------------------------------------------------------
                            CARD IN EDIT MODE
    ---------------------------------------------------------------------------->
    <v-card
      elevation="10"
      v-if="editmode&&!image_edit"
      :loading="textsubmitloading"
      :disabled="textsubmitloading"
      color="black"
    >
    <v-overlay :value="overlay" absolute color="sandalbg">
      <v-progress-circular indeterminate size="50"></v-progress-circular>
    </v-overlay>
      <v-container class="cardbg pa-10">
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="pb-3"
                dense
                label="Chamber name"
                type="text"
                v-model="send.chamber_name"
                prepend-icon="mdi-vector-circle"
                color="black"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="i in hashtag_count" :key="i">
            <v-col cols="9">
              <v-text-field
                class="pb-3"
                dense
                :label="`#hashtag ${i}`"
                type="text"
                v-model="send.hashtags[i-1]"
                prepend-icon="mdi-pound"
                color="black"
              />
            </v-col>
            <v-col cols="3">
              <v-btn class="red" small icon @click="delete_hashtag(i-1)" v-if="hashtag_count>1">
                <v-icon color="black">mdi-minus</v-icon>
              </v-btn>
              <v-btn class="red ml-1" small icon @click="hashtag_count++" v-if="hashtag_count===i">
                <v-icon color="black">mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                dense
                label="about"
                type="text"
                v-model="send.chamber_description"
                prepend-icon="mdi-information"
                color="black"
                height="60px"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel_editmode">cancel</v-btn>
          <v-btn @click="confirmedit">submit</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
    <!-- ----------------------------------------------------------------------------
                                IMAGE EDITOR
    ------------------------------------------------------------------------------->
    <v-card
      v-show="image_edit"
      :loading="imagesubmitloading"
      :disabled="imagesubmitloading"
      color="black"
    >
      <v-container class="cardbg">
        <div :id="`croppie-${index}`"></div>
        <v-row justify="space-around" class="white--text">
          <input name="image-upload" type="file" id="upload-image" v-on:change="setUpFileUploader" />
          <v-btn v-on:click="uploadFile">upload</v-btn>
        </v-row>
        <v-row class="mt-5" justify="center">
          <v-btn v-on:click="cancel_image_change">cancel</v-btn>
        </v-row>
      </v-container>
    </v-card>
    <!-- common dialog box -->
    <dialog-box />
  </v-container>
</template>
<script>
import Cookies from "universal-cookie";
import Croppie from "croppie";
import dialogbox from "../../components/miscellaneous/alert";
import naga from "../../../src/assets/logo.png";
const cookies = new Cookies();
export default {
  components: {
    "dialog-box": dialogbox
  },
  name: "ownchambercards",
  props: ["chamber", "index"],
  data: () => ({
    overlay:false,
    textsubmitloading: false,
    imagesubmitloading: false,
    croppie: null,
    hashtag_count: null,
    editmode: false,
    image_edit: false,
    chamber_picture: "",
    send: {
      chamber_id: "",
      scheduled_time: "none",
      chamber_name: "",
      chamber_description: "",
      hashtags: []
    }
  }),
  methods: {
    delete_hashtag: function(i) {
      this.send.hashtags.splice(i, 1);
      this.hashtag_count--;
    },
    cancel_editmode: function() {
      this.send.chamber_name = this.chamber.chamber_name;
      this.send.chamber_description = this.chamber.chamber_description;
      this.send.hashtags = this.chamber.hashtags.slice(0);
      this.hashtag_count = this.chamber.hashtags.length;
      this.editmode = false;
    },
    confirmedit: async function() {
      this.textsubmitloading = true;
      this.overlay=true;
      this.$axios
        .post("/changechamberdetails", this.send, {
          headers: { Authorization: "Bearer " + cookies.get("token") }
        })
        .then(Response => {
          if (Response.data.success) {
            this.overlay=false;
            this.textsubmitloading = false;
            this.editmode = false;
            this.$emit("change_create_chamber_details", {
              mode: "edit",
              index: this.index,
              _id: this.send.chamber_id,
              chamber_name: this.send.chamber_name,
              chamber_description: this.send.chamber_description,
              hashtags: this.send.hashtags.slice(0),
              scheduled_time: this.send.scheduled_time
            });
          }
          if (Response.data.error) {
            this.overlay=false;
            this.textsubmitloading = false;
            this.$store.dispatch("alertdialog", {
              show: true,
              type: "red darken-2",
              title: "Error !",
              message: Response.data.error,
              buttontext: "ok"
            });
          }
        });
    },
    deletechamber: function() {
      this.overlay=true;
      this.$axios
        .post(
          "/deletechamber",
          { chamber_id: this.send.chamber_id },
          {
            headers: { Authorization: "Bearer " + cookies.get("token") }
          }
        )
        .then(Response => {
          if (Response.data.success) {
            this.overlay=false;
            this.$emit("change_create_chamber_details", {
              mode: "delete",
              index: this.index
            });
          }
          if (Response.data.error) {
            this.overlay=false;
            this.$store.dispatch("alertdialog", {
              show: true,
              type: "red darken-2",
              title: "Error !",
              message: Response.data.error,
              buttontext: "ok"
            });
          }
        });
    },
    uploadFile() {
      this.imagesubmitloading = true;
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
              "/changechamberpicture",
              { file: response, chamber_id: this.send.chamber_id },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              if (Response.data.success) {
                this.imagesubmitloading = false;
                this.$emit("change_chamber_photo", {
                  index: this.index,
                  image: response
                });
                this.chamber_picture = response;
                this.image_edit = false;
                this.croppie.destroy();
              }
              if (Response.data.error) {
                this.imagesubmitloading = false;
                this.$store.dispatch("alertdialog", {
                  show: true,
                  type: "yellow darken-2",
                  title: "Warning !",
                  message: Response.data.error,
                  buttontext: "ok"
                });
                this.image_edit = false;
                this.croppie.destroy();
              }
            })
            .bind(this);
        });
    },
    setUpCroppie() {
      let el = document.getElementById(`croppie-${this.index}`);
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
    initiate_image_change: function() {
      this.setUpCroppie();
      this.image_edit = true;
      this.showimg = false;
    },
    cancel_image_change: function() {
      this.chamber_picture = this.chamber.photo_url;
      this.image_edit = false;
      this.croppie.destroy();
    }
  },
  computed: {
    date: function() {
      return new Date(parseInt(this.chamber.created)).toLocaleDateString(
        "en-US"
      );
    },
    editable: function() {
      if (Date.now() - this.chamber.created > 300000) {
        return false;
      } else {
        return true;
      }
    }
  },

  created() {
    this.send.chamber_id = this.chamber._id;
    this.send.chamber_name = this.chamber.chamber_name;
    this.send.chamber_description = this.chamber.chamber_description;
    this.send.hashtags = this.chamber.hashtags.slice(0);
    (this.chamber_picture = this.chamber.photo_url),
      (this.hashtag_count =
        this.chamber.hashtags.length > 0 ? this.chamber.hashtags.length : 1);
  },
  watch: {
    chamber: function() {
      this.send.chamber_id = this.chamber._id;
      this.send.chamber_name = this.chamber.chamber_name;
      this.send.chamber_description = this.chamber.chamber_description;
      this.send.hashtags = this.chamber.hashtags.slice(0);
      this.hashtag_count =
        this.chamber.hashtags.length > 0 ? this.chamber.hashtags.length : 1;
      this.chamber_picture = this.chamber.photo_url;
    }
  },
  mounted() {
    this.$on("imgUploaded", function(imageData) {
      this.image = imageData;
      this.croppie.destroy();
      this.setUpCroppie(imageData);
    });
    this.image = naga;
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
<style scoped>
.cardbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
</style>