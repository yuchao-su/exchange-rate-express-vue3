import request from '@/config/axios'

/**
 * 客服品牌
 */
export interface KfVO {
  /**
   * 客服编号
   */
  id?: number
  /**
   * 客服名称
   */
  name: string
  /**
   * 图片素材id
   */
  mediaId: string
}

// 创建客服
export const createKf = (data: KfVO) => {
  return request.post({ url: '/cp/kf', data })
}

// 更新客服
export const updateKf = (data: KfVO) => {
  return request.put({ url: '/cp/kf', data })
}

// 删除客服
export const deleteKf = (data: any) => {
  return request.delete({ url: `/cp/kf`, data })
}


// 获得客服列表
export const getKfPage = (params: PageParam) => {
  return request.get({ url: '/cp/kf/page', params })
}

