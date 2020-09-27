// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const RunTimeStateMigration = require('rsm-node-mqtt');
const sampleModel = require('./model-example.json');

const config = {
    name: 'Demo App Two',
}
const rsm = new RunTimeStateMigration(config, onState, onRequestState, onDevice)

rsm.addModel(sampleModel);
var option = document.createElement("option");
option.value = sampleModel.info.title;
option.innerHTML = sampleModel.info.title;
$("#models").appendChild(option);
currentModel = '';


console.log('introducing device ...');
rsm.introduce();

$("#get-devices").addEventListener('click', function () {
    console.log('get devices');
    devices = rsm.getDevices(sampleModel.info.title);
    console.log(devices);
    $('#devices').innerHTML = '<ul></ul>';

    for (i = 0; i < devices.length; i++) {
        var selecttag1 = document.createElement("input");
        selecttag1.setAttribute("type", "radio");
        selecttag1.setAttribute("name", "devices");
        selecttag1.setAttribute("value", devices[i]._id);
        selecttag1.setAttribute("id", "irrSelectNo" + i);

        var lbl1 = document.createElement("label");
        lbl1.innerHTML = devices[i].name;

        var li = document.createElement("li");
        li.appendChild(selecttag1);
        li.appendChild(lbl1);
        $('#devices ul').appendChild(li);
    }

}, false)

$("#get-data").addEventListener('click', function () {
    if ($All('input[name=devices]') !== undefined) {
        const model_name = $("#models").value;
        const device_id = $('input[name=devices]:checked').value;
        rsm.getStateDevice(model_name, device_id);
    }
}, false)


function onState(data) {
    console.log('onState', data);

    // rsm.getStateById(state_id).then(res => {
    //     console.log(res);
    //     data = JSON.parse(res.content);
    //     $("#from").value = data.from
    //     $("#to").value = data.to
    //     $("#body").value = data.body
    // })
}

function onDevice(data) {
    console.log('onDevice', data);
}

function onRequestState(data) {
    console.log('onRequestState', data);

    var state = {
        from: $("#from").value,
        to: $("#to").value,
        body: $("#body").value
    }
    rsm.setState(data.model_name, state);
    rsm.sendState(data.model_name, data.device._id);
}

function $(selector) {
    return document.querySelector(selector)
}

function $All(selector) {
    return document.querySelectorAll(selector)
}