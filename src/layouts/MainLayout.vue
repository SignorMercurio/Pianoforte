<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
        </q-avatar>
        <q-toolbar-title>
          Pianoforte
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn
          :label="user.username"
          flat
          icon="account_circle"
          to="/login"
        ></q-btn>
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
import { User } from '../models/user'

const api = MainApi.getInstance()

function useAccount() {
  const user = ref<User>({
    id: 0,
    username: ''
  })
  watchEffect(async () => {
    user.value = await api.getUser()
  })

  return { user }
}

function useDrawer() {
  const menuList = ref([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/'
    },
    {
      icon: 'format_list_numbered',
      label: 'Logging',
      route: '/log'
    }
  ])

  return { menuList }
}

export default defineComponent({
  setup() {
    return {
      ...useAccount(),
      ...useDrawer()
    }
  }
})
</script>
