import axios from 'axios'
const request = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1'
})
// 请求拦截器
request.interceptors.request.use(
  // 任何所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const token = window.sessionStorage.getItem('token')

    // 如果有登录用户信息，则统一设置 token
    if (token) {
      config.headers.Authorization = token
    }

    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如：统一的设置 token

    // 当这里 return config 之后请求在会真正的发出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  // 任何超出 2xx 的响应码都会进入这里
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的token
    window.sessionStorage.removeItem('token')
    this.$router.push('/login')
    this.$message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    this.$message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    this.$message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    this.$message.error('服务端内部异常，请稍后重试')
  }

  return Promise.reject(error)
})

export default request
