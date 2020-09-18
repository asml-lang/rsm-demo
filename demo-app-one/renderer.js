// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const RunTimeStateMigration = require('rsm-node');
const sampleModel = require('./model-example.json');

const config = {
    name: 'Demo App One',
}
const rsm = new RunTimeStateMigration(config)
console.log('introducing device ...');
rsm.introduceMe().then(res => {
    console.log('adding a model ...');
    rsm.addModel(sampleModel);
});

function $(selector) {
    return document.querySelector(selector)
}

function $All(selector) {
    return document.querySelectorAll(selector)
}
let states = [];
$("#get-devices").addEventListener('click', function () {
    console.log('get devices');
    rsm.getOtherStates(sampleModel.info.title).then(res => {
        console.log(res);
        states = res;
        $('#devices').innerHTML = '';

        for (i = 0; i < res.length; i++) {
            var selecttag1 = document.createElement("input");
            selecttag1.setAttribute("type", "radio");
            selecttag1.setAttribute("name", "devices");
            selecttag1.setAttribute("value", res[i]._id);
            selecttag1.setAttribute("id", "irrSelectNo" + i);

            var lbl1 = document.createElement("label");
            lbl1.innerHTML = res[i].devices[0].name;
            $('#devices').appendChild(lbl1);
            $('#devices').appendChild(selecttag1);
        }
    })
}, false)

$("#from").addEventListener('keyup', function () {
    setState()
}, false)

$("#to").addEventListener('keyup', function () {
    setState()
}, false)

$("#body").addEventListener('keyup', function () {
    setState()
}, false)


$("#get-data").addEventListener('click', function () {
    if ($All('input[name=devices]') !== undefined) {
        const state_id = $('input[name=devices]:checked').value;
        state = states.find(state => state._id == state_id);
        data = JSON.parse(state.content);
        $("#from").value = data.from
        $("#to").value = data.to
        $("#body").value = data.body
    }
}, false)

function setState() {
    const data = {
        from: $("#from").value,
        to: $("#to").value,
        body: $("#body").value
    }
    rsm.setState(data, sampleModel.info.title);
}
