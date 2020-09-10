<template>
  <v-card min-height="200px" class="background">
    <v-overlay :value="overlay" absolute color="sandalbg">
      <v-progress-circular indeterminate size="50"></v-progress-circular>
    </v-overlay>
    <v-card-title>change profile picture</v-card-title>
    <v-container>
      <div id="croppie"></div>
      <v-row justify="center">
        <input
          name="image-upload"
          type="file"
          id="upload-image"
          v-on:change="setUpFileUploader"
          accept="image/*"
        />
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn text v-on:click="closedialog">cancel</v-btn>
      <v-btn v-on:click="uploadFile" color="orange">upload</v-btn>
    </v-card-actions>
    <!-- common dialog box -->
    <dialog-box />
  </v-card>
</template>
<script>
import Cookies from "universal-cookie";
import Croppie from "croppie";
import dialogbox from "../../components/miscellaneous/alert";
const cookies = new Cookies();
import naga from "../../assets/commonimage.png";
export default {
  components: {
    "dialog-box": dialogbox
  },
  name: "changeprofilepicture",
  data: () => ({
    image: null,
    overlay:false
  }),
  methods: {
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
          this.overlay=true;
          this.$axios
            .post(
              "/changeprofilephoto",
              { file: response },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              if (Response.data.success) {
                this.overlay=false;
                this.$emit("changepic", { image: response });
              }
              if (Response.data.error) {
                this.overlay=false;
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
      if (/^image/.test(file.type)) {
        var reader = new FileReader();
        console.log(file.type);
        var vm = this;
        reader.onload = e => {
          vm.image = e.target.result;
          // console.log(e.target.result);
          this.$emit("imgUploaded", e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.$emit("changepic");
        return this.$store.dispatch("alertdialog", {
          show: true,
          type: "yellow darken-2",
          title: "Warning !",
          message: "Not a valid file type",
          buttontext: "ok"
        });
      }
    },
    skiptoprofile: function() {
      this.$router.push("profile");
    },
    closedialog: function() {
      this.$emit("changepic");
    }
  },
  mounted() {
    this.$on("imgUploaded", function(imageData) {
      this.image = imageData;
      this.croppie.destroy();
      this.setUpCroppie(imageData);
    });
    this.image = naga;
    this.setUpCroppie();
  },
  destroyed() {
    this.croppie.destroy();
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
<style scoped>
.background {
  background-color: #5b4d31;
}
</style>
