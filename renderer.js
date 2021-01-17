// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const RunTimeStateMigration = require('rsm-node');

const config = {
    name: 'Demo App',
}

const models = [];
models.push(require('./models/search.json'));
models.push(require('./models/sending-email.json'));



const rsm = new RunTimeStateMigration(config, onStateRequest, onStateReceive, onStateMigration, onDeviceJoin, onDeviceLeave)

$("#device").innerHTML = rsm.getDevice()._id;
$("title").innerHTML = rsm.getDevice().name + ' - MQTT';

for (let index = 0; index < models.length; index++) {
    const model = models[index];
    if (rsm.addModel(model)) {
        var option = document.createElement("option");
        option.value = model.info.title;
        option.innerHTML = model.info.title;
        $("#models").appendChild(option);
    }
}



console.log('introducing device ...');
rsm.introduce();

// $("#get-devices").addEventListener('click', function () {
//     getDevices()
// }, false)

function getData() {
    if ($('input[name=devices]:checked') !== null) {
        const model_name = $("#models").value;
        const device_id = $('input[name=devices]:checked').value;
        rsm.getStateDevice(model_name, device_id);
    } else {
        alert('Select a device');
    }
}

function setDate() {
    if ($('input[name=devices]:checked') !== null) {
        // const model_name = $("#models").value;
        const device_id = $('input[name=devices]:checked').value;
        // rsm.getStateDevice(model_name, device_id);
        // setState({ model_name })
        console.log('#set-data sendState');
        rsm.sendState(model_name, device_id);
    } else {
        alert('Select a device');
    }
}

$("#models").addEventListener('change', function () {
    $All('.models').forEach(el => el.style.display = 'none');
    if ($("#models").value) {
        console.log($("#models").value);
        $('#' + $("#models").value).style.display = 'block';
    }
})

$("#method").addEventListener('change', function () {
    if ($("#method").value == 'pull') {
        getDevices(true)
    } else {
        getDevices(false)
    }

})

$("#migrate").addEventListener('click', function () {
    if ($("#method").value == 'pull') {
        getData();
    } else {
        setDate();
    }
})

$All("input").forEach(inpt => {
    inpt.addEventListener('change', function () {
        const model_name = $("#models").value;
        if (model_name) {
            console.log('set state', model_name)
            setState({ model_name })
        }
    })
})


function getDevices(has_state) {
    has_state = has_state || false;
    console.log('get devices');
    const model_name = $("#models").value;

    if (model_name) {
        devices = rsm.getDevices(model_name, has_state);
        console.log(devices);
        if (devices.length) {
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
        } else {
            alert(`There is not device for '${model_name}'`)
        }
    } else {
        alert('Select a state');
    }

}

function onStateReceive(data) {
    console.log('onStateReceive', data);

    if (data.model_name == 'sending-email') {
        $("#from").value = data.state.from
        $("#to").value = data.state.to
        $("#subject").value = data.state.subject
        $("#body").value = data.state.body
    }

    if (data.model_name == 'search') {
        $("#query").value = data.state.query
        $("#submit").value = data.state.submit
    }

    rsm.setMigration(data.model_name, data.device._id);

}

function onDeviceJoin(data) {
    console.log('onDeviceJoin', data);
    $("#alert").innerHTML = `'${data.device.name}' joined '${data.model_name}'`;
    $("#alert").style.opacity = '1';
    setTimeout(() => {
        $("#alert").style.opacity = '0';
    }, 2000);
}

function onDeviceLeave(data) {
    console.log('onDeviceLeave', data);
    $("#alert").innerHTML = `'${data.name}' left`;
    $("#alert").style.opacity = '1';
    setTimeout(() => {
        $("#alert").style.opacity = '0';
    }, 2000);
}

function onStateRequest(data) {
    console.log('onRequestState', data);
    rsm.sendState(data.model_name, data.device._id);
}

function onStateMigration(data) {
    console.log('onStateMigration', data);

    if (data.model_name == 'sending-email') {
        $("#from").value = ""
        $("#to").value = ""
        $("#body").value = ""
    }

    if (data.model_name == 'search') {
        $("#query").value = ""
        $("#submit").value = "false"
    }
}

function setState(data) {
    if (data.model_name == 'sending-email') {
        var state = { from: $("#from").value, to: $("#to").value, subject: $("#subject").value, body: $("#body").value }
    } else if (data.model_name == 'search') {
        var state = { query: $("#query").value, submit: $("#submit").value == 'true' }
    }
    rsm.setState(data.model_name, state);
}

function $(selector) {
    return document.querySelector(selector)
}

function $All(selector) {
    return document.querySelectorAll(selector)
}
