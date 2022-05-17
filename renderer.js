// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const getMac = require('getmac').default;
const clientId = getMac();
console.log("本机mac地址：", clientId);  


const http = require('http')
function getIP(cb) {
  const url = 'http://txt.go.sohu.com/ip/soip'
  http.get(url, res => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
      let m = data.match(/\d+\.\d+\.\d+\.\d+/g)
      if (m.length > 0) {
        cb(m[0])
      }
    })
  }).on('error', e => console.log(`error messsage: ${e.message}`))
}

getIP((ip) => {
	console.log("公网IP", ip)
})

