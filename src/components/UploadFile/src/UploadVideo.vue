<template>
  <div class="upload-box">
    <el-upload
      :action="updateUrl"
      :id="uuid"
      :class="['upload', drag ? 'no-border' : '']"
      :multiple="false"
      :show-file-list="false"
      :headers="uploadHeaders"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="modelValue">
        <el-image class="upload-image">
          <template #error>
            <div class="image-slot" @click="materialVisit(item)">
              <Icon class="icon" icon="fa:play-circle" :size="60" color="#409eff"/>
            </div>
          </template>
        </el-image>
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="editImg">
            <Icon icon="ep:edit" />
            <span>{{ t('action.edit') }}</span>
          </div>
          <div class="handle-icon" @click="openVisitForm">
            <Icon icon="ep:zoom-in" />
            <span>{{ t('action.detail') }}</span>
          </div>
          <div class="handle-icon" @click="deleteImg">
            <Icon icon="ep:delete" />
            <span>{{ t('action.del') }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <Icon icon="ep:plus" />
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <visitForm ref="visitFormRef" />
  </div>
</template>

<script setup lang="ts" name="UploadVideo">
import type { UploadProps } from 'element-plus'
import visitForm from '@/components/Materials/src/visitForm.vue'
import { generateUUID } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { getAccessToken, getTenantId } from '@/utils/auth'

type FileTypes =
  | 'video/mp4'
  | 'video/ogg'
  | 'video/flv'
  | 'video/avi'
  | 'video/wmv'
  | 'video/rmvb'

// 接受父组件参数
const props = defineProps({
  modelValue: propTypes.string.def(''),
  updateUrl: propTypes.string.def(import.meta.env.VITE_UPLOAD_URL),
  drag: propTypes.bool.def(true), // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: propTypes.bool.def(false), // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize: propTypes.number.def(100), // 视频大小限制 ==> 非必传（默认为 5M）
  fileType: propTypes.array.def(['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb']), // 视频类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height: propTypes.string.def('150px'), // 组件高度 ==> 非必传（默认为 150px）
  width: propTypes.string.def('150px'), // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius: propTypes.string.def('8px') // 组件边框圆角 ==> 非必传（默认为 8px）
})
const { t } = useI18n() // 国际化
const visitFormRef = ref()
const message = useMessage() // 消息弹窗
// 生成组件唯一id
const uuid = ref('id-' + generateUUID())

const emit = defineEmits(['update:modelValue'])

const deleteImg = () => {
  emit('update:modelValue', '')
}

const uploadHeaders = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId()
})

const editImg = () => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`)
  dom && dom.dispatchEvent(new MouseEvent('click'))
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    message.notifyWarning('上传视频不符合所需的格式！')
  if (!imgSize) message.notifyWarning(`上传视频大小不能超过 ${props.fileSize}M！`)
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// 视频上传成功提示
const uploadSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
  emit('update:modelValue', res.data)
}

// 视频上传错误提示
const uploadError = () => {
  message.notifyError('视频上传失败，请您重新上传！')
}

const openVisitForm = () => {
  visitFormRef.value.open({
    name: '查看视频',
    url: props.modelValue,
    type: 2
  })
}
</script>
<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}

.image-slot{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}
</style>
