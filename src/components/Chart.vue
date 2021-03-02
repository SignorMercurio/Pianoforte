<template>
  <module parent="Scan" icon="find_in_page" name="Charts">
    <template v-slot:card>
      <q-card-section class="row justify-around">
        <div ref="aDom" style="width: 400px; height: 500px" class="shadow-8" />
        <div ref="bDom" style="width: 400px; height: 500px" class="shadow-8" />
      </q-card-section>
    </template>
  </module>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { MainApi } from './axios'
import module from './Module.vue'

import * as echarts from 'echarts/core'
import {
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { Data } from 'src/models/misc'

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
])

const api = MainApi.getInstance()

export default defineComponent({
  name: 'chart',
  components: {
    module,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: 'scans',
    },
    aName: {
      type: String,
      required: true,
    },
    bName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const aDom = ref<HTMLElement>()
    const bDom = ref<HTMLElement>()
    const aOption = {
      tooltip: {
        trigger: 'item',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true },
        },
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: props.aName,
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#1d1d1d',
            borderWidth: 1,
          },
          label: {
            show: false,
          },
          data: [] as Data[],
        },
      ],
    }
    const bOption = {
      tooltip: {
        trigger: 'item',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true },
        },
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: props.bName,
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#1d1d1d',
            borderWidth: 1,
          },
          label: {
            show: false,
          },
          data: [] as Data[],
        },
      ],
    }

    const getData = async () => {
      let data = null
      if (props.type === 'scans') {
        data = await api.getScansData(props.id)
      } else {
        data = await api.getData(props.type, props.id)
      }

      aOption.series[0].data = data[0]
      bOption.series[0].data = data[1]
      echarts.init(aDom.value!, 'dark').setOption(aOption)
      echarts.init(bDom.value!, 'dark').setOption(bOption)
    }

    onMounted(getData)

    return {
      aDom,
      bDom,
    }
  },
})
</script>
