import api from '../../config/api'
import { funMixin } from '../../config/mixin'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { canvasStore } from '@/components/canvas/store/canvas'
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();

export default function (componentContent, typeId, shopId) {
  const { sendReq, beforeGetData, afterGetData, jumpProductDetail, jumpGroupWorks } = funMixin()
  const { discountNum } = storeToRefs(canvasStoreObj);
  const activityData = ref({})
  const productList = ref([])
  const count = ref([])
  const timer = ref(null)
  const countDownInterval = ref(null)

  onMounted(() => {
    if (componentContent.value.id) {
      getProList()
      getActivit()
    } else {
      productList.value = []
    }
  })

  onBeforeUnmount(() => {
    clearInterval(timer.value)
  })

  function getProList () {
    beforeGetData()
    const params = {
      method: 'POST',
      url: api.getActivityProduct,
      data: {
        isPage: 2,
        ids: [componentContent.value.id]
      }
    }
    sendReq(
      params,
      (res) => {
        afterGetData()
        productList.value = res.data.list
      },
      () => {
        afterGetData()
      }
    )
  }

  function getActivit () {
    beforeGetData()
    const params = {
      method: 'GET',
      url: `${api.getActivity}?id=${componentContent.value.id}`,
    }
    sendReq(
      params,
      (res) => {
        afterGetData()
        activityData.value = res.data
        getTime()
      },
      () => {
        afterGetData()
      }
    )
  }

  function getTime () {
    const date = new Date().getTime()
    let startTime = activityData.value.startTime
    let endTime = activityData.value.endTime
    let time = 0
    if (activityData.value.state === 0) {
      time = startTime - date // 未开始
    } else if(activityData.value.state === 1) {
      time = endTime - date // 进行中
    }
    if(countDownInterval.value){
      clearInterval(countDownInterval.value)
    }
    countDownInterval.value = setInterval(()=>{
      countDown(time)
      time -= 1000
      if(time <= 0){
        clearInterval(countDownInterval.value)
        activityData.value.state ++
      }
    },1000)
  }
  function countDown (time) {
    const fn = (v) => (v < 10 ? `0${v}` : v)
    const t = parseInt(time / 1000)
    const text = activityData.value.state === 0 ? '开始' : '结束'
    const hour = parseInt(t / 3600)
    const min = parseInt((t % 3600) / 60)
    const s = t % 60
    count.value = [text, fn(hour), fn(min), fn(s)]
  }

  watch(() =>
      discountNum,
    (newVal) => {
      getProList()
      getActivit()
    }, { immediate: false, deep: true })

  return {
    activityData,
    productList,
    count,
    jumpProductDetail,
    jumpGroupWorks
  }
}
