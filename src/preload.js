// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	const OS = require('os');
  if(OS.networkInterfaces().WLAN){
    sessionStorage.mac = OS.networkInterfaces().WLAN[0].mac
    sessionStorage.address = OS.networkInterfaces().WLAN[0].address
    sessionStorage.family = OS.networkInterfaces().WLAN[0].family
  }else{
    sessionStorage.mac = OS.networkInterfaces()['以太网'][0].mac
    sessionStorage.address = OS.networkInterfaces()['以太网'][0].address
    sessionStorage.family = OS.networkInterfaces()['以太网'][0].family
  }
  sessionStorage.name = OS.hostname()
  console.log(sessionStorage.getItem('mac'))
	console.log('os.address====', sessionStorage.getItem('address'))
	console.log('os.family====', sessionStorage.getItem('family'))
	console.log(sessionStorage.getItem('name'))

	// const IP = require('ip')
	// console.log('获得的IP地址==', IP.address())


 	// let interfaces = OS.networkInterfaces();
 	// for (let devName in interfaces) {
  //   let iface = interfaces[devName];
  //   for (let i = 0; i < iface.length; i++) {
  //     let alias = iface[i];
  //     if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
  //       console.log('获得的IP地址', alias.address)
  //     }
  //   }
  // }

  // let cpus = OS.cpus();
  // console.log('获得的CPU', cpus)

  // console.log('referrer', document.referrer);
	// console.log('userAgent', navigator.userAgent);

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
