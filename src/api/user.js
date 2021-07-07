import request from '@/utils/request.js'
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
