//------- DEVICE INFORMATION SECTION--------- //


// date and time  
function updateDateTime() {
    let now = new Date();
    //console.log(now);
    let day = now.getDay();
    //console.log(day)
    let year = now.getFullYear();
    //console.log(year)
    let month = now.getMonth();
    //console.log(month)
    let hours = now.getHours()
    //console.log(hours)
    let minutes = now.getMinutes();
    //console.log(minutes)
    let seconds = now.getSeconds();
    //console.log(seconds)
    let time = (`${hours}:${minutes}:${seconds}`)
    let date = (`${day}/${month}/${year}`)
    // console.log(date)
    // console.log(time)
    document.getElementById('date').innerText = date;
    document.getElementById('time').innerText = time;
}
updateDateTime();
setInterval(updateDateTime, 1000);





// fetch the device Name
function getDeviceName() {
    let deviceName = "Unknown";

    if (navigator && navigator.userAgent) {
        deviceName = navigator.userAgent;
    }
    return deviceName;
}
let device = getDeviceName();
console.log(device);
document.getElementById('device').innerText = device


//------- DEVICE INFORMATION SECTION ENDS --------- //




//------- SYSTEM STATUS AND CONTROLS SECTION  --------- //


//battery level and status
const batteryEndPoint = "http://192.168.43.92/battery";
navigator.getBattery().then(function (battery) {
    function updateBatteryStatus() {
        const level = (battery.level * 100).toFixed(0);
        const status = battery.charging;
       
        //posting the battery level to nodemcu/device
        fetch(batteryEndPoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'  
            },
            body: JSON.stringify({ level: level})
        }).then(Response => {
            if (Response.ok) {
                console.log(`Battery level ${level}% sent succesfully`);
            } else {
                console.log(`Battery level ${level}% could not be sent`)
                    .catch(error => {
                        console.log('Fetch error:' + error);
                    });
                                        
            }
        })

        if (status) {
            document.getElementById('status').innerText = "Charging";
            document.getElementById('status').style.color = "#69ff3f";
        }
        else {
            document.getElementById('status').innerText = "!Charging";
            document.getElementById('status').style.color = "#1a2faa";
        }
        document.getElementById('level').innerText = level;
        console.log(`The battery charge is ${level}`)
    }
    updateBatteryStatus();
    battery.addEventListener('levelchange', updateBatteryStatus);
    battery.addEventListener('chargingchange', updateBatteryStatus);
    setInterval(() => {
        updateBatteryStatus();
    }, 150);
})





//fetching  relayState from nodemcu/device
const RelayStatusEndPoint = "http://192.168.43.92/relayStatus";
function updateRelaystatus() {
    fetch(RelayStatusEndPoint)
        .then(response => response.json())
        .then(data => {
            const relayState = data.relayState;
            if (relayState == 1) {
                document.getElementById('relayStatus').innerText = "On";
            } else {
                document.getElementById('relayStatus').innerText = "Off"
            }
        })
}
updateRelaystatus();
setInterval(updateRelaystatus, 500);
//------- SYSTEM STATUS ENDS  --------- // 





document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded and parsed Successfully");
    const handleModeEndpoint = "http://192.168.43.92/mode";
    const handleRelayEndpoint = "http://192.168.43.92/relay";  // Add the endpoint for relay control
    const btn = document.getElementById('btn');

    if (btn) {
        btn.addEventListener('click', () => {
            let checkbox = document.getElementById('btn');
            let mode;
            
            if (checkbox.checked) {
                mode = "1";
                console.log("Manual Mode");
                let manual = document.getElementById("mode-type");
                manual.innerText = "Manual";
                manual.style.color = "blue";
                const container = document.getElementById('container');
                container.innerHTML = `
                    <p>Change Relay State  <input type="checkbox" id="relay-state"></p>
                    <p id="message"> </p>`;

                function updateRelayState() {
                    let relayCheckbox = document.getElementById("relay-state");
                    let relayState = relayCheckbox.checked ? "1" : "0";
                    
                    console.log(`Relay is ${relayState === "1" ? "ON" : "OFF"}`);
                    let message = document.getElementById("message");
                    message.innerText = `Relay is ${relayState === "1" ? "ON" : "OFF"}`;
                    message.style.color = relayState === "1" ? "lightgreen" : "aqua";

                    // Send POST request to update relay state
                    fetch(handleRelayEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ relay: relayState })
                    }).then(response => {
                        if (response.ok) {
                            console.log(`Relay state change req sent`);
                        } else {
                            console.log(`Relay state change req rejected`);
                        }
                    }).catch(error => {
                        console.log('Fetch error: ' + error);
                    });
                }

                updateRelayState();
                let relayCheckbox = document.getElementById("relay-state");
                relayCheckbox.addEventListener('change', updateRelayState);

            } else {
                mode = "0";
                console.log("Autopilot Mode");
                let autopilot = document.getElementById("mode-type");
                autopilot.innerText = "AutoPilot";
                autopilot.style.color = "lightgreen";
                const container = document.getElementById('container');
                container.innerHTML = "";
            }

            // Send the switch request to the device
            fetch(handleModeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mode: mode })
            }).then(response => {
                if (response.ok) {
                    console.log(`Mode change req sent`);
                } else {
                    console.log(`Mode change req rejected`);
                }
            }).catch(error => {
                console.log('Fetch error: ' + error);
            });
        });
    } else {
        console.log('Button element not found');
    }
});
