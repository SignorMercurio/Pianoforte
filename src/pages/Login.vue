<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-center">
          <q-icon name="img:logo.png" size="xl" />
        </div>
      </q-card-section>

      <q-tab-panel name="login">
        <q-form @submit="login" class="q-pa-md q-gutter-md">
          <q-input
            autofocus
            outlined
            v-model="loginData.username"
            label="Account"
            lazy-rules
            :rules="[(val) => !!val || '* Required']"
            ><template v-slot:prepend>
              <q-icon name="person"></q-icon> </template
          ></q-input>

          <q-input
            outlined
            type="password"
            v-model="loginData.password"
            label="Password"
            lazy-rules
            :rules="[(val) => !!val || '* Required']"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key"></q-icon>
            </template>
          </q-input>

          <div>
            <q-btn
              push
              class="full-width"
              label="Login"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-tab-panel>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { NoAuthApi } from 'components/axios'
import { UserCreate } from 'src/models/user'

const api = NoAuthApi.getInstance()

function useLogin(store: any, router: any) {
  const loginData = ref<UserCreate>({
    username: '',
    password: '',
  })

  async function login() {
    const { access_token } = (await api.login(loginData.value)) || {}
    if (access_token) {
      store.commit('account/login', access_token)
      // success('Login successfully')
      setTimeout(() => {
        router.push('/projects')
      }, 500)
    }
  }

  return {
    loginData,
    login,
  }
}

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    return { ...useLogin(store, router) }
  },
})
</script>
