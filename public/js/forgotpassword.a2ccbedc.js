(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["forgotpassword"],{3273:function(e,t,r){"use strict";var s=r("46e8"),a=r.n(s);a.a},"37ec":function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("v-row",{attrs:{id:"logo"}},[r("v-col")],1),r("v-row",[r("v-col",[r("v-card",{staticClass:"pa-6",attrs:{elevation:"24",dark:"","min-height":"300px"}},[r("v-overlay",{attrs:{value:e.overlay,absolute:"",color:"primary"}},[r("v-progress-circular",{attrs:{indeterminate:"",size:"50"}})],1),r("v-card-subtitle",{staticClass:"text-center orange--text"},[e._v("Forgot password")]),""!=e.errormessage?r("v-row",{staticClass:"red--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[e._v(e._s(e.errormessage)+" !")]):e._e(),""!=e.successmessage?r("v-row",{staticClass:"green--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[e._v(e._s(e.successmessage)+" !")]):e._e(),r("v-row",{attrs:{justify:"center"}},[r("v-form",{ref:"forgotpasswordform"},[r("v-text-field",{attrs:{dense:"",label:"email",type:"text","prepend-icon":"mdi-account-box",required:"",rules:[function(e){return!!e||"Email id is required"}],color:"orange"},model:{value:e.send.user_email,callback:function(t){e.$set(e.send,"user_email",t)},expression:"send.user_email"}}),r("v-btn",{staticClass:"primary mt-5",attrs:{block:"",small:""},on:{click:function(t){return t.preventDefault(),e.resend(t)}}},[e._v("submit")])],1)],1),r("v-row",{staticClass:"white--text mt-10",attrs:{justify:"center"}},[r("span",[e._v("Not an existing user ?")])]),r("v-row",{staticClass:"white--text",attrs:{justify:"center"}},[r("router-link",{staticClass:"signuptext",attrs:{to:"/signup"}},[r("p",[e._v("signup")])])],1)],1)],1)],1),r("dialog-box")],1)},a=[],n=r("b14a"),o={components:{"dialog-box":n["a"]},data:function(){return{overlay:!1,errormessage:"",successmessage:"",send:{user_email:""}}},methods:{resend:function(){var e=this;this.errormessage="",this.successmessage="",this.overlay=!0,this.$axios.post("/forgotpassword",this.send).then((function(t){t.data.success&&(e.overlay=!1,e.successmessage=t.data.success),t.data.error&&(e.errormessage=t.data.error,e.overlay=!1)}))}}},i=o,c=(r("3273"),r("2877")),u=r("6544"),l=r.n(u),d=r("8336"),f=r("b0af"),p=r("99d9"),m=r("62ad"),v=r("a523"),g=r("4bd4"),h=r("a797"),y=r("490a"),b=r("0fd9"),w=r("8654"),x=Object(c["a"])(i,s,a,!1,null,"3edd17fc",null);t["default"]=x.exports;l()(x,{VBtn:d["a"],VCard:f["a"],VCardSubtitle:p["b"],VCol:m["a"],VContainer:v["a"],VForm:g["a"],VOverlay:h["a"],VProgressCircular:y["a"],VRow:b["a"],VTextField:w["a"]})},"457b":function(e,t,r){},"46e8":function(e,t,r){},"4bd4":function(e,t,r){"use strict";r("4de4"),r("7db0"),r("4160"),r("caad"),r("07ac"),r("2532"),r("159b"),r("4795");var s=r("5530"),a=r("58df"),n=r("7e2b"),o=r("3206");t["a"]=Object(a["a"])(n["a"],Object(o["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(e){var t=Object.values(e).includes(!0);this.$emit("input",!t)},deep:!0,immediate:!0}},methods:{watchInput:function(e){var t=this,r=function(e){return e.$watch("hasError",(function(r){t.$set(t.errorBag,e._uid,r)}),{immediate:!0})},s={_uid:e._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?s.shouldValidate=e.$watch("shouldValidate",(function(a){a&&(t.errorBag.hasOwnProperty(e._uid)||(s.valid=r(e)))})):s.valid=r(e),s},validate:function(){return 0===this.inputs.filter((function(e){return!e.validate(!0)})).length},reset:function(){this.inputs.forEach((function(e){return e.reset()})),this.resetErrorBag()},resetErrorBag:function(){var e=this;this.lazyValidation&&setTimeout((function(){e.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(e){return e.resetValidation()})),this.resetErrorBag()},register:function(e){this.inputs.push(e),this.watchers.push(this.watchInput(e))},unregister:function(e){var t=this.inputs.find((function(t){return t._uid===e._uid}));if(t){var r=this.watchers.find((function(e){return e._uid===t._uid}));r&&(r.valid(),r.shouldValidate()),this.watchers=this.watchers.filter((function(e){return e._uid!==t._uid})),this.inputs=this.inputs.filter((function(e){return e._uid!==t._uid})),this.$delete(this.errorBag,t._uid)}}},render:function(e){var t=this;return e("form",{staticClass:"v-form",attrs:Object(s["a"])({novalidate:!0},this.attrs$),on:{submit:function(e){return t.$emit("submit",e)}}},this.$slots["default"])}})},6453:function(e,t,r){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase())},"72bf":function(e,t,r){"use strict";const s=r("6453"),a=r("f234"),n=r("f32c"),o=e=>null===e||void 0===e;function i(e){switch(e.arrayFormat){case"index":return t=>(r,s)=>{const a=r.length;return void 0===s||e.skipNull&&null===s||e.skipEmptyString&&""===s?r:null===s?[...r,[l(t,e),"[",a,"]"].join("")]:[...r,[l(t,e),"[",l(a,e),"]=",l(s,e)].join("")]};case"bracket":return t=>(r,s)=>void 0===s||e.skipNull&&null===s||e.skipEmptyString&&""===s?r:null===s?[...r,[l(t,e),"[]"].join("")]:[...r,[l(t,e),"[]=",l(s,e)].join("")];case"comma":case"separator":return t=>(r,s)=>null===s||void 0===s||0===s.length?r:0===r.length?[[l(t,e),"=",l(s,e)].join("")]:[[r,l(s,e)].join(e.arrayFormatSeparator)];default:return t=>(r,s)=>void 0===s||e.skipNull&&null===s||e.skipEmptyString&&""===s?r:null===s?[...r,l(t,e)]:[...r,[l(t,e),"=",l(s,e)].join("")]}}function c(e){let t;switch(e.arrayFormat){case"index":return(e,r,s)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===s[e]&&(s[e]={}),s[e][t[1]]=r):s[e]=r};case"bracket":return(e,r,s)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==s[e]?s[e]=[].concat(s[e],r):s[e]=[r]:s[e]=r};case"comma":case"separator":return(t,r,s)=>{const a="string"===typeof r&&r.split("").indexOf(e.arrayFormatSeparator)>-1,n=a?r.split(e.arrayFormatSeparator).map(t=>d(t,e)):null===r?r:d(r,e);s[t]=n};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}function u(e){if("string"!==typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function l(e,t){return t.encode?t.strict?s(e):encodeURIComponent(e):e}function d(e,t){return t.decode?a(e):e}function f(e){return Array.isArray(e)?e.sort():"object"===typeof e?f(Object.keys(e)).sort((e,t)=>Number(e)-Number(t)).map(t=>e[t]):e}function p(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function m(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}function v(e){e=p(e);const t=e.indexOf("?");return-1===t?"":e.slice(t+1)}function g(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"===typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function h(e,t){t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t),u(t.arrayFormatSeparator);const r=c(t),s=Object.create(null);if("string"!==typeof e)return s;if(e=e.trim().replace(/^[?#&]/,""),!e)return s;for(const a of e.split("&")){let[e,o]=n(t.decode?a.replace(/\+/g," "):a,"=");o=void 0===o?null:["comma","separator"].includes(t.arrayFormat)?o:d(o,t),r(d(e,t),o,s)}for(const a of Object.keys(s)){const e=s[a];if("object"===typeof e&&null!==e)for(const r of Object.keys(e))e[r]=g(e[r],t);else s[a]=g(e,t)}return!1===t.sort?s:(!0===t.sort?Object.keys(s).sort():Object.keys(s).sort(t.sort)).reduce((e,t)=>{const r=s[t];return Boolean(r)&&"object"===typeof r&&!Array.isArray(r)?e[t]=f(r):e[t]=r,e},Object.create(null))}t.extract=v,t.parse=h,t.stringify=(e,t)=>{if(!e)return"";t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t),u(t.arrayFormatSeparator);const r=r=>t.skipNull&&o(e[r])||t.skipEmptyString&&""===e[r],s=i(t),a={};for(const o of Object.keys(e))r(o)||(a[o]=e[o]);const n=Object.keys(a);return!1!==t.sort&&n.sort(t.sort),n.map(r=>{const a=e[r];return void 0===a?"":null===a?l(r,t):Array.isArray(a)?a.reduce(s(r),[]).join("&"):l(r,t)+"="+l(a,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,s]=n(e,"#");return Object.assign({url:r.split("?")[0]||"",query:h(v(e),t)},t&&t.parseFragmentIdentifier&&s?{fragmentIdentifier:d(s,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0},r);const s=p(e.url).split("?")[0]||"",a=t.extract(e.url),n=t.parse(a,{sort:!1}),o=Object.assign(n,e.query);let i=t.stringify(o,r);i&&(i="?"+i);let c=m(e.url);return e.fragmentIdentifier&&(c="#"+l(e.fragmentIdentifier,r)),`${s}${i}${c}`}},7831:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("v-row",{attrs:{id:"logo"}},[r("v-col")],1),r("v-row",[r("v-col",[r("v-card",{staticClass:"pa-6",attrs:{elevation:"24",dark:"","min-height":"300px"}},[r("v-overlay",{attrs:{value:e.overlay,absolute:"",color:"primary"}},[r("v-progress-circular",{attrs:{indeterminate:"",size:"50"}})],1),r("v-card-subtitle",{staticClass:"text-center orange--text"},[e._v("Set a new password")]),""!=e.errormessage?r("v-row",{staticClass:"red--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[e._v(e._s(e.errormessage)+" !")]):e._e(),""!=e.successmessage?r("v-row",{staticClass:"green--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[e._v(e._s(e.successmessage)+" !")]):e._e(),r("v-row",{attrs:{justify:"center"}},[r("v-form",{ref:"forgotpasswordform"},[r("v-text-field",{attrs:{dense:"",label:"password",type:"password","prepend-icon":"mdi-lock",required:"",rules:[function(e){return!!e||"password is required"}],color:"orange"},model:{value:e.send.user_password,callback:function(t){e.$set(e.send,"user_password",t)},expression:"send.user_password"}}),r("v-text-field",{attrs:{dense:"",label:"re-type password",type:"password","prepend-icon":"mdi-lock-reset",required:"",rules:[function(e){return!!e||"retype password is required"}],color:"orange"},on:{keypress:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submit(t)}},model:{value:e.retypepassword,callback:function(t){e.retypepassword=t},expression:"retypepassword"}}),r("v-btn",{staticClass:"primary mt-5",attrs:{block:"",small:""},on:{click:function(t){return t.preventDefault(),e.submit(t)}}},[e._v("submit")])],1)],1),r("v-row",{staticClass:"white--text mt-10",attrs:{justify:"center"}},[r("span",[e._v("Not an existing user ?")])]),r("v-row",{staticClass:"white--text",attrs:{justify:"center"}},[r("router-link",{staticClass:"signuptext",attrs:{to:"/signup"}},[r("p",[e._v("signup")])])],1)],1)],1)],1),r("dialog-box")],1)},a=[],n=(r("ac1f"),r("841c"),r("b14a")),o=r("72bf"),i=r.n(o),c={components:{"dialog-box":n["a"]},data:function(){return{overlay:!1,errormessage:"",successmessage:"",retypepassword:"",send:{user_email:"",user_password:"",token:""}}},methods:{submit:function(){var e=this;this.errormessage="",this.successmessage="",this.overlay=!0,this.$axios.post("/changeforgotpassword",this.send).then((function(t){t.data.success&&(e.overlay=!1,e.$router.push("/")),t.data.error&&(e.errormessage=t.data.error,e.overlay=!1)}))}},created:function(){var e=i.a.parse(location.search);e.token&&e.user_mail?(this.send.token=e.token,this.send.user_email=e.user_mail):e.error?(this.mainoverlay=!0,this.$store.dispatch("alertdialog",{show:!0,type:"error darken-2",title:"Error !",message:e.error,buttontext:"ok"})):this.$router.push("/")}},u=c,l=(r("b993"),r("2877")),d=r("6544"),f=r.n(d),p=r("8336"),m=r("b0af"),v=r("99d9"),g=r("62ad"),h=r("a523"),y=r("4bd4"),b=r("a797"),w=r("490a"),x=r("0fd9"),_=r("8654"),j=Object(l["a"])(u,s,a,!1,null,"dd1bd552",null);t["default"]=j.exports;f()(j,{VBtn:p["a"],VCard:m["a"],VCardSubtitle:v["b"],VCol:g["a"],VContainer:h["a"],VForm:y["a"],VOverlay:b["a"],VProgressCircular:w["a"],VRow:x["a"],VTextField:_["a"]})},"841c":function(e,t,r){"use strict";var s=r("d784"),a=r("825a"),n=r("1d80"),o=r("129f"),i=r("14c3");s("search",1,(function(e,t,r){return[function(t){var r=n(this),s=void 0==t?void 0:t[e];return void 0!==s?s.call(t,r):new RegExp(t)[e](String(r))},function(e){var s=r(t,e,this);if(s.done)return s.value;var n=a(e),c=String(this),u=n.lastIndex;o(u,0)||(n.lastIndex=0);var l=i(n,c);return o(n.lastIndex,u)||(n.lastIndex=u),null===l?-1:l.index}]}))},b993:function(e,t,r){"use strict";var s=r("457b"),a=r.n(s);a.a},f234:function(e,t,r){"use strict";var s="%[a-f0-9]{2}",a=new RegExp(s,"gi"),n=new RegExp("("+s+")+","gi");function o(e,t){try{return decodeURIComponent(e.join(""))}catch(a){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),s=e.slice(t);return Array.prototype.concat.call([],o(r),o(s))}function i(e){try{return decodeURIComponent(e)}catch(s){for(var t=e.match(a),r=1;r<t.length;r++)e=o(t,r).join(""),t=e.match(a);return e}}function c(e){var t={"%FE%FF":"��","%FF%FE":"��"},r=n.exec(e);while(r){try{t[r[0]]=decodeURIComponent(r[0])}catch(u){var s=i(r[0]);s!==r[0]&&(t[r[0]]=s)}r=n.exec(e)}t["%C2"]="�";for(var a=Object.keys(t),o=0;o<a.length;o++){var c=a[o];e=e.replace(new RegExp(c,"g"),t[c])}return e}e.exports=function(e){if("string"!==typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return c(e)}}},f32c:function(e,t,r){"use strict";e.exports=(e,t)=>{if("string"!==typeof e||"string"!==typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}}}]);
//# sourceMappingURL=forgotpassword.a2ccbedc.js.map