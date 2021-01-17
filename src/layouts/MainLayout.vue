<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="logo.png" />
        </q-avatar>
        <q-toolbar-title>
          Pianoforte
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn :label="user.username" flat icon="account_circle">
          <q-menu fit transition-show="flip-right" transition-hide="flip-left">
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

    <q-drawer show-if-above mini side="left">
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(menuItem, index) in menuList">
            <q-item
              :key="index"
              clickable
              :active="$route.path.startsWith(menuItem.route)"
              v-ripple
              :to="menuItem.route"
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-tooltip
                anchor="center right"
                self="center left"
                :offset="[10, 10]"
              >
                {{ menuItem.label }}
              </q-tooltip>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import { success } from 'src/components/utils'
import { User } from '../models/user'

const api = MainApi.getInstance()

function useAccount(store: any, router: any) {
  const user = ref<User>({
    id: 0,
    username: ''
  })
  watchEffect(async () => {
    user.value = await api.getUser()
  })

  function logout() {
    store.dispatch('account/Logout')
    success('Logout')
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }

  return { user, logout }
}

function useDrawer() {
  const menuList = ref([
    {
      icon: 'format_list_numbered',
      label: 'Projects',
      route: '/'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/settings'
    }
  ])

  return { menuList }
}

export default defineComponent({
  setup(_, { root }) {
    const store = root.$store
    const router = root.$router
    return {
      ...useAccount(store, router),
      ...useDrawer()
    }
  }
})
</script>
