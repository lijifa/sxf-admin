import cookie from 'js-cookie'

let cookieSecret = 'cmbc'

export default {
  set: (key, val) => {
    cookie.set(`${cookieSecret}_${key}`, val)
  },
  get: key => {
    return cookie.get(`${cookieSecret}_${key}`)
  },
  remove: (key, prefix=true) => {
    let cookie_key = key
    if (prefix) {
      cookie_key = cookieSecret+'_'+key
    }
    cookie.remove(`${cookie_key}`)
  }
}