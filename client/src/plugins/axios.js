import axios from "axios";
import Vue from "vue";

const devInstance = createInstance("https://discussjunction.herokuapp.com/api");

function createInstance(baseURL) {
  return axios.create({
    baseURL,
  });
}

export default {
  install() {
    Vue.prototype.$axios = devInstance;
  },
}; 
