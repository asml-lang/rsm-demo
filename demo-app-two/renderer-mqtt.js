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

$("#device").innerHTML = rsm.getDevice()._id;
$("title").innerHTML = rsm.getDevice().name + ' - MQTT';

if (rsm.addModel(sampleModel)) {
    var option = document.createElement("option");
    option.value = sampleModel.info.title;
    option.innerHTML = sampleModel.info.title;
    $("#models").appendChild(option);
    currentModel = '';
}


console.log('introducing device ...');
rsm.introduce();

$("#get-devices").addEventListener('click', function () {
    getDevices()
}, false)

$("#get-data").addEventListener('click', function () {
    if ($All('input[name=devices]') !== undefined) {
        const model_name = $("#models").value;
        const device_id = $('input[name=devices]:checked').value;
        rsm.getStateDevice(model_name, device_id);
    }
}, false)


function getDevices() {
    console.log('get devices');
    const model_name = $("#models").value;
    devices = rsm.getDevices(model_name);
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

}

function onState(data) {
    console.log('onState', data);

    $("#from").value = data.state.from
    $("#to").value = data.state.to
    $("#body").value = data.state.body

}

function onDevice(data) {
    $("#alert").innerHTML = `'${data.device.name}' joined '${data.model_name}'`;
    $("#alert").style.opacity = '1';
    setTimeout(() => {
        $("#alert").style.opacity = '0';
    }, 2000);
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