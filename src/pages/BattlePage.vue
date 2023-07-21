<template>
  <q-page>
    <div class="column" style="height: calc(100vh - 50px)">
      <div class="col-1 row">
        <div class="col text-caption">Folder: {{ FOLDER }}</div>
        <div class="col text-right">
          <q-btn icon="close" round @click="unloadFolder()"><q-tooltip>Go back to start page</q-tooltip></q-btn>
        </div>
      </div>
      <div v-if="PNG_FILES === undefined" class="col-1 text-center">
        <q-btn class="my-btn" no-caps @click="scanFolder(FOLDER)">Scan folder</q-btn>
      </div>
      <div v-else class="col-11">
        <div class="col-11 ">
          <div class="row text-center">
            <div class="absolute-right column" style="top: 100px">
              <!-- size -->
              <div class="text-caption">{{ size }}px
                <q-popup-edit v-model.number="size" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"
                    @change="changeSize(scope.value)" />
                </q-popup-edit>
              </div>
              <q-btn flat rounded icon="zoom_in" @click="changeSize(size + 20)" />
              <q-btn flat rounded icon="zoom_out" @click="changeSize(size - 20)" />
              <!-- reset btn -->
              <q-btn class="q-mt-lg" flat rounded icon="restart_alt"
                @click="resetImg()"><q-tooltip>reset</q-tooltip></q-btn>
            </div>

            <div class="col" id="dicomImage" :style="`height:${SIZE}px`">
              <!-- {{ size }} -->
            </div>
          </div>
        </div>
        <div class="col-1">
          <div class="row text-center">
            <div class="col"><q-btn id="stroke_btn" no-caps class="my-btn"
                :class="{ 'bg-accent': activeBtn === 'stroke' }" icon="warning"
                @click="nextImage({ is_stroke: true })">Stroke</q-btn></div>
            <div class="col">{{ pos + 1 }} / {{ PNG_FILES.length }}</div>
            <div class="col"><q-btn id="no_stroke_btn" no-caps class="my-btn"
                :class="{ 'bg-accent': activeBtn === 'no_stroke' }" icon="check_circle"
                @click="nextImage({ is_stroke: false })">no
                Stroke</q-btn></div>
          </div>
        </div>
        <div class="text-center text-caption text-grey-6">left for stroke, right for no stroke, enter for select</div>
      </div>
      <!-- sho info button -->
      <q-btn flat rounded class="absolute-bottom-left text-grey-6" icon="info" @click="showInfo()"><q-tooltip>display the
          results in the console</q-tooltip></q-btn>
      <!-- timer -->
      <div class="absolute-bottom-right text-grey-6">{{ TIMER }}s</div>
    </div>
  </q-page>
</template>

<script>

import Hammer from 'src/tools/hammer.js'
// import dicomParser from 'src/tools/dicomParser.min.js'
import * as cornerstone from 'src/tools/cornerstone.min.js'
// import * as cornerstoneWADOImageLoader from 'src/tools/cornerstoneWADOImageLoader.bundle.min.js'
import * as cornerstoneWebImageLoader from 'src/tools/cornerstoneWebImageLoader.min.js'
import * as cornerstoneTools from 'src/tools/cornerstoneTools.js'
import * as cornerstoneMath from 'src/tools/cornerstoneMath.min.js'

import * as MYLOADER from 'src/tools/myLocalFileLoader'
MYLOADER.init(window.electron.fs)

cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.cornerstoneMath = cornerstoneMath
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

cornerstoneTools.init({
  globalToolSyncEnabled: false,
  // showSVGCursors: true,
  mouseEnabled: true,
  touchEnabled: true
})

export default {
  name: "BattlePage",

  // props: ['input_data', 'title'],

  components: {},

  data() {
    return {
      PNG_FILES: undefined,
      JSON_FILE: undefined,
      pos: 0,
      size: 300,
      RESULTS: [],
      activeBtn: undefined,
      timer: undefined,
      time: 0
    };
  },

  mounted() {
    if (this.FOLDER === undefined) {
      this.$router.push({ name: "IndexPage" });
    } else this.scanFolder(this.FOLDER)

    // add key listener
    window.addEventListener('keydown', this.handleKey);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKey);
  },


  watch: {},

  computed: {
    FOLDER() {
      return this.$store.getters.FOLDER;
    },

    SIZE() {
      return this.size;
    },

    TIMER() {
      return this.time
    },
  },

  methods: {
    // unload folder
    unloadFolder() {
      this.$store.commit("SET_FOLDER", undefined);
      this.$router.push({ name: "IndexPage" });
    },
    // enable CS
    async enableCS() {
      //set up CS
      const element = document.getElementById('dicomImage');
      cornerstone.enable(element);

      cornerstone.registerImageLoader('local', MYLOADER.loadImage)

      // const imageId = "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg"
      const imageId = `local:/${this.PNG_FILES[this.pos]}`

      cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(element, image);
      });

      this.startTimer()

      //add tool WWWc
      cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool)
      cornerstoneTools.setToolActiveForElement(element, 'Wwwc', { mouseButtonMask: 1 })

    },

    // scan folder
    async scanFolder(folder) {
      this.PNG_FILES = undefined;
      this.JSON_FILE = undefined;
      this.$store.commit("RESULTS_RESET")
      // read png
      const PNG_FILES = await this.$store.dispatch("SCAN_FOLDER", {
        folder: folder,
        ext: "png",
      });
      if (PNG_FILES.length > 0) this.PNG_FILES = PNG_FILES;
      else this.$q.notify("No png files found in folder " + folder);

      // read json
      const JSON_FILE = await this.$store.dispatch("SCAN_FOLDER", {
        folder: folder,
        ext: "json",
      });
      if (JSON_FILE.length > 0) this.JSON_FILE = JSON_FILE;
      else this.$q.notify("No json files found in folder " + folder);

      //enable CS
      if (this.PNG_FILES) this.enableCS()
    },

    // change image
    nextImage(payload) {
      // Store the result
      this.$store.commit("RESULTS_ADD", {
        file: this.PNG_FILES[this.pos],
        is_stroke: payload.is_stroke,
        duration_in_sec: this.time
      })
      // reset timer
      this.time = 0

      // Next image
      this.pos += 1
      // Finished, then go to finished page
      if (this.pos >= this.PNG_FILES.length) return this.$router.push({ name: "FinishedPage" })
      // else load next image
      const element = document.getElementById('dicomImage');
      const imageId = `local:/${this.PNG_FILES[this.pos]}`
      cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(element, image);
      });

    },

    // change size of image
    changeSize(payload) {
      this.size = payload
      this.$nextTick(() => {
        const element = document.getElementById('dicomImage');
        cornerstone.resize(element, true);
      })
    },

    resetImg() {
      const element = document.getElementById('dicomImage');
      cornerstone.reset(element)
    },

    showInfo() {
      console.log(this.$store.getters.RESULTS)
    },

    // KEYBOARD
    handleKey(event) {
      switch (event.keyCode) {
        case 37:
          this.activeBtn = 'stroke'
          break;
        case 39:
          this.activeBtn = 'no_stroke'
          break;
        // case enter
        case 13:
          if (this.activeBtn === undefined) return
          else this.nextImage({ is_stroke: this.activeBtn === 'stroke' })
          this.activeBtn = undefined
          break;
      }
    },

    // start timer
    startTimer() {
      this.timer = setInterval(() => {
        this.time += .1;
        this.time = Math.round(this.time * 10) / 10;
      }, 100);
    },

    // ENDE METHODS
  },

};
</script>
