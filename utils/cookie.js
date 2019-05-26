const key = "cookie"

function getSessionIDFromResponse(res) {
  var cookie = res.header['Set-Cookie']
  console.log("get cookie from response" + cookie)
  return cookie
}

function setCookieToStorage(cookie) {
  try{
    wx.setStorageSync(key, cookie)
  }catch(e){console.log(e)}
}

function getCookieFromStorage() {
  var cookie = wx.getStorageSync(key)
  return cookie
}

module.exports={
  getSessionIDFromResponse: getSessionIDFromResponse,
  setCookieToStorage: setCookieToStorage,
  getCookieFromStorage: getCookieFromStorage
}