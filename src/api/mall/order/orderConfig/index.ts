import request from '@/config/axios'


export const getOrderRule = async () => {
  return await request.get({ url: `/order/rule/get` })
}

export const updateOrderRule = async (data) => {
  return await request.put({ url: `/order/rule/update`,data })
}

