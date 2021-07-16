import request from '@/utils/request.js'
// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
// 获取左侧菜单权限列表
export const getMenuList = () => {
  return request({
    method: 'GET',
    url: '/menus'
  })
}
// 获取用户列表
export const getUserList = (params) => {
  return request({
    method: 'GET',
    url: '/users',
    params
  })
}
// 修改用户状态
export const editUserStatus = (id, state) => {
  return request({
    method: 'PUT',
    url: `/users/${id}/state/${state}`
  })
}
// 添加用户
export const addUser = (data) => {
  return request({
    method: 'POST',
    url: '/users',
    data

  })
}
// 根据ID 获取用户信息
export const getUserInfo = (id) => {
  return request({
    method: 'GET',
    url: `users/${id}`
  })
}
// 编辑用户资料提交
export const editUserInfo = (id, data) => {
  return request({
    method: 'PUT',
    url: `users/${id}`,
    data
  })
}
// 删除用户
export const removeUser = (id) => {
  return request({
    method: 'DELETE',
    url: `users/${id}`
  })
}
