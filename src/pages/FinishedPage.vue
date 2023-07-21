<template>
  <q-page class="flex flex-center">
    <div>
      You are finished ...
      <q-btn flat rounded class="text-grey-6" icon="home" @click="$router.push({ name: 'IndexPage' })"><q-tooltip>Go back
          to the start page</q-tooltip></q-btn>
    </div>
    <q-img src="~assets/finished_img.gif" height="300px" />
  </q-page>
</template>

<script>
import SELECT_FOLDER from 'src/components/SelectFolder.vue'

export default {
  name: 'FinishedPage',

  // props: ['input_data', 'title'],

  components: {},

  data() {
    return {

    }
  },

  mounted() {
    if (this.$store.getters.RESULTS.length === 0) {
      this.$q.notify({
        message: 'No results found',
        color: 'negative',
        icon: 'report_problem'
      })
    } else {
      // export as json
      const json = JSON.stringify(this.$store.getters.RESULTS)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'results.json'
      link.click()

    }
  },

  watch: {

  },

  computed: {

  },

  methods: {


    // ENDE METHODS
  }


}
</script>
