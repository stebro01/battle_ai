<template>
  <q-page class="flex flex-center">
    <div>
      <div class="column q-gutter-y-md">
        <q-btn class="my-btn" @click="show_select_folder = true">Choose your enemy <q-tooltip>select a folder containing
            png files to evaluate</q-tooltip></q-btn>
        <q-btn @click="folder_selected(test_folder)">destroy starbase <q-tooltip>load sample data</q-tooltip></q-btn>
      </div>

      <div class="q-pa-xl">
        <q-img src="~assets/waiting_img.png" width="200px" />
      </div>
    </div>
    <!-- MODAL SELECT_FOLDER -->
    <q-dialog v-model="show_select_folder" persistent>
      <SELECT_FOLDER @close="show_select_folder = false" @save="folder_selected($event)" />
    </q-dialog>
  </q-page>
</template>

<script>
import SELECT_FOLDER from 'src/components/SelectFolder.vue'

export default {
  name: 'IndexPage',

  // props: ['input_data', 'title'],

  components: { SELECT_FOLDER },

  data() {
    return {
      show_select_folder: false,
      test_folder: '/Users/ste/MyProjects/battle_ai/test/jest/__tests__/mockups/EXAMPLE_FOLDER'

    }
  },

  watch: {

  },

  computed: {

  },

  methods: {
    folder_selected(folder) {
      this.$store.commit('SET_FOLDER', folder)
      this.show_select_folder = false
      this.$router.push({ name: 'BattlePage' })
    }

    // ENDE METHODS
  }


}
</script>
