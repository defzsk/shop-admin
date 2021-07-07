import axios from 'axios'
const request = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1'
})
export default request
