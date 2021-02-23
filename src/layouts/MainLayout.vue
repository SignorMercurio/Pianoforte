<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn round flat @click="drawer = !drawer">
          <q-avatar>
            <img src="logo.png" />
          </q-avatar>
        </q-btn>

        <q-toolbar-title> Pianoforte </q-toolbar-title>
        <q-space></q-space>
        <q-btn :label="user.username" flat icon="account_circle">
          <q-menu fit transition-show="jump-down" transition-hide="jump-up">
            <q-list>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon color="primary" name="logout"></q-icon>
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="200" side="left">
      <q-scroll-area
        class="fit"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
      >
        <q-list padding>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              :active="route.path.startsWith(menuItem.route)"
              v-ripple
              @click="router.push(menuItem.route)"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>{{ menuItem.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"> -->
      <router-view />
      <!-- </q-scroll-area> -->
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { MainApi } from 'components/axios'
import { User } from 'src/models/user'

const api = MainApi.getInstance()

function useAccount(store: any, router: any) {
  const user = ref<User>({
    id: 0,
    username: '',
  })
  onMounted(async () => {
    user.value = await api.getUser()
  })

  function logout() {
    store.commit('account/logout')
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }

  return { user, logout }
}

function useDrawer() {
  const drawer = ref(true)
  const thumbStyle = {
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#027be3',
    width: '5px',
    opacity: 0.75,
  }
  const barStyle = {
    right: '2px',
    borderRadius: '9px',
    backgroundColor: '#027be3',
    width: '9px',
    opacity: 0.2,
  }

  const menuList = ref([
    {
      icon: 'format_list_numbered',
      label: 'Projects',
      route: '/projects',
    },
    {
      icon: 'web',
      label: 'Assets',
      route: '/assets',
    },
    {
      icon: 'dns',
      label: 'Domains',
      route: '/domains',
    },
    {
      icon: 'donut_large',
      label: 'Ports',
      route: '/ports',
    },
    {
      icon: 'folder',
      label: 'Directories',
      route: '/dirs',
    },
    {
      icon: 'fingerprint',
      label: 'Fingerprints',
      route: '/fingers',
    },
    {
      icon: 'link',
      label: 'Endpoints',
      route: '/endpoints',
    },
    {
      icon: 'bug_report',
      label: 'Vulnerabilities',
      route: '/vulns',
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/settings',
    },
  ])

  return { menuList, drawer, thumbStyle, barStyle }
}

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
      store.commit('project/setProjects', await api.getProjects())
    })

    return {
      ...useAccount(store, router),
      ...useDrawer(),
      router,
      route,
    }
  },
})
</script>
