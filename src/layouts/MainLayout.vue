<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="non-selectable">
        <q-toolbar-title>
          {{ $store.getters.ENV_APP_TITLE }}
        </q-toolbar-title>

        <div>{{ $store.getters.ENV_APP_VERSION }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container class="non-selectable">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {

  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
