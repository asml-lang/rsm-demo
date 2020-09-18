// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const Handsoff = require('handsoff')

const handsoff = new Handsoff('demo-app-two', 'handsoff-demo', getData, onConnection)
handsoff.run()

function $(selector) {
    return document.querySelector(selector)
}

$("#get-devices").addEventListener('click', function () {
    $('#devices').innerText = JSON.stringify(handsoff.getDevices())
}, false)

$("#my-data").addEventListener('keyup', function() {
    handsoff.setData($("#my-data").value)
}, false)


$("#get-data").addEventListener('click', function () {
    const devices = handsoff.getDevices()
    if (devices.length > 0) {
         handsoff.request({ action: 'get-data' }, devices[0])
    }
}, false)


function onConnection(connections) {
    // console.log(connections.size)
    $('#devices').innerText = JSON.stringify(handsoff.getDevices())
}


function getData(data) {
    $('#data').innerText = JSON.stringify(data)
}

