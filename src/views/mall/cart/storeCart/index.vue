<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      @submit.enter.prevent
    >
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 0;display: none">
        <el-input />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="购物车ID" align="center" prop="id" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="商品名称" align="center" prop="storeName" />
      <el-table-column label="商品数量" align="center" prop="cartNum" />
      <el-table-column label="是否下单购买" align="center" prop="isPay" >
        <template #default="scope">
          <span v-if="scope.row.isPay == 1">已购买</span>
          <span v-else>未购买</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['cart:store-cart:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

</template>

<script setup lang="ts" name="StoreCart">
import { dateFormatter } from '@/utils/formatTime'
import * as StoreCartApi from '@/api/mall/cart/storeCart'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: ""
})
const queryFormRef = ref() // 搜索的表单


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreCartApi.getStoreCartPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}



/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StoreCartApi.deleteStoreCart(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}



/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
