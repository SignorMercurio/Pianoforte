<template>
  <q-page class="q-pa-lg">
    <module parent="Projects" icon="format_list_numbered" name="List">
      <template v-slot:card>
        <q-card-section>
          <q-list>
            <q-item v-for="item in projects" :key="item.id">
              <q-item-section>
                {{ item.name }}
              </q-item-section>

              <q-item-section side>
                <div class="q-gutter-sm">
                  <crud-btn @click="edit(item)" />

                  <crud-btn
                    type="info"
                    :to="`/projects/detail?id=${item.id}`"
                  />

                  <crud-btn type="del" @click="del(item.id)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn @click="add" />
        </q-card-actions>
      </template>
    </module>
    <q-dialog v-model="dialog">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">New / Edit Project</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            label="Project Name"
            v-model="curProject.name"
            lazy-rules
            :rules="[val => !!val || '* Required']"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-primary"
            flat
            label="OK"
            v-close-popup
            @click="submit"
          ></q-btn>
          <q-btn
            class="text-negative"
            flat
            label="Cancel"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import { Project } from 'src/models/project'
import { Dialog } from 'quasar'

const api = MainApi.getInstance()

function useList() {
  const projects = ref<Project[]>([])
  const getProjects = async () => {
    projects.value = await api.getProjects()
  }

  onMounted(getProjects)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this project?'
    }).onOk(() => {
      api.deleteProject(id).then(getProjects)
    })
  }

  return { projects, getProjects, del }
}

function useDialog() {
  const dialog = ref(false)
  const curProject = ref<Project>({
    id: 0,
    name: ''
  })

  function add() {
    dialog.value = true
    curProject.value = {
      id: 0,
      name: ''
    }
  }

  function edit(target: Project) {
    dialog.value = true
    curProject.value = { ...target }
  }

  return { dialog, curProject, add, edit }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn
  },
  setup() {
    const { projects, getProjects, del } = useList()
    const { dialog, curProject, add, edit } = useDialog()

    function submit() {
      const data = curProject.value
      if (data.id !== 0) {
        api.editProject(data.id, { name: data.name }).then(getProjects)
      } else {
        api.createProject(data).then(getProjects)
      }
    }

    return {
      projects,
      getProjects,
      del,
      dialog,
      curProject,
      add,
      edit,
      submit
    }
  }
})
</script>
