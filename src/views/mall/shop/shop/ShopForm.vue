<script setup lang="ts">
import * as ShopApi from '@/api/mall/shop/shop'
import AMap from "@/components/AMap/index.vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  storeName: undefined,
  storeIntro: undefined,
  storePhone: undefined,
  iconUrl: undefined,
  address: undefined,
  lon: undefined,
  lat: undefined,
  writeOffStartTime: 0,
  writeOffEndTime: 0,
  businessStartTime: '',
  businessEndTime: '',
  status: true
})
const formRules = reactive({
  storeName: [{ required: true, message: '门店名称不能为空', trigger: 'blur' }],
  storeIntro: [{ required: true, message: '门店简介不能为空', trigger: 'blur' }],
  storePhone: [{ required: true, message: '门店手机不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '门店地址不能为空', trigger: 'blur' }],
  lon: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  lat: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  businessStartTime: [{ required: true, message: '营业开始时间不能为空', trigger: 'blur' }],
  businessEndTime: [{ required: true, message: '营业结束时间不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ShopApi.getShop(id)
      if (formData.value.writeOffStartTime && formData.value.writeOffEndTime) {
        timeData.value = [
          formatTimestamp(formData.value.writeOffStartTime),
          formatTimestamp(formData.value.writeOffEndTime)
        ];
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const aMapRef = ref()

function openAMap(){
  if(formData.value.lon){
    aMapRef.value.open({
      lnglat:[formData.value.lon,formData.value.lat]
    })
  }else{
    aMapRef.value.open()
  }
}

async function handleAMapConfirm(address:any){
  formData.value.lon = address.position[0]
  formData.value.lat = address.position[1]
  formData.value.address = address.addressInfo.formattedAddress
  const valid = await formRef.value.validate()
  if (!valid) return
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  // 如果所有校验都通过，进行数据转化和接口请求代码
  let date1 = new Date(timeData.value[0]);
  let date2 = new Date(timeData.value[1]);
  formData.value.writeOffStartTime = date1.getTime();
  formData.value.writeOffEndTime = date2.getTime();
  formLoading.value = true
  try {
    const data = formData.value as unknown as ShopApi.ShopVO
    if (formType.value === 'create') {
      await ShopApi.createShop(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopApi.updateShop(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 核销时间
const timeData = ref([])
const doBusinessStartTime = ref('') // 营业时间

const changeDate = () => {
  console.log(doBusinessStartTime.value, 'doBusinessStartTime')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    storeName: undefined,
    storeIntro: undefined,
    storePhone: undefined,
    iconUrl: undefined,
    address: undefined,
    lon: undefined,
    lat: undefined,
    writeOffStartTime:0,
    writeOffEndTime: 0,
    businessStartTime: '',
    businessEndTime: '',
    status: true
  }
  formRef.value?.resetFields()
}

// 日期格式化
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="formData.storeName" placeholder="请输入门店名称" />
      </el-form-item>
      <el-form-item label="门店简介" prop="storeIntro">
        <el-input v-model="formData.storeIntro" placeholder="请输入门店简介" />
      </el-form-item>
      <el-form-item label="门店手机" prop="storePhone">
        <el-input v-model="formData.storePhone" placeholder="请输入门店手机" />
      </el-form-item>
      <el-form-item label="门店logo" prop="iconUrl">
        <Materials v-model="formData.iconUrl" :num="1" type="image" />
        <p class="ml-1">建议尺寸：100*100， jpg，jpeg，png格式</p>
      </el-form-item>
      <el-form-item label="选择地址">
        <el-button type="primary" @click="openAMap">打开地图</el-button>
      </el-form-item>
      <el-form-item label="门店地址" prop="address">
        <el-input v-model="formData.address" placeholder="请选择地址" disabled />
      </el-form-item>
      <el-form-item label="经度" prop="lon">
        <el-input v-model="formData.lon" placeholder="请选择地址" disabled />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input v-model="formData.lat" placeholder="请选择地址" disabled />
      </el-form-item>
      <el-form-item class="is-required" label="核销时间">
        <el-date-picker
          v-model="timeData"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item class="is-required" label="营业时间">
        <div class="demo-time-range">
          <el-time-select
            v-model="formData.businessStartTime"
            :max-time="formData.businessEndTime"
            class="mr-4"
            placeholder="开始时间"
            start="00:00"
            step="00:15"
            end="24:00"
            @change="changeDate"
          />
          至
          <el-time-select
            v-model="formData.businessEndTime"
            :min-time="formData.businessStartTime"
            placeholder="结束时间"
            start="00:00"
            step="00:15"
            end="24:00"
          />
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <AMap ref="aMapRef" @confirm="handleAMapConfirm" />

</template>
