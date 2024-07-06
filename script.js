
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





// device name
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







//battery level and status
const batteryEndPoint = "http://192.168.137.104/battery";
const RelayStatusEndPoint = "http://192.168.137.104/relayStatus";


navigator.getBattery().then(function (battery) {
    function updateBatteryStatus() {
        const level = (battery.level * 100).toFixed(0);
        const status = battery.charging;

        //post battery level 
        fetch(batteryEndPoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ level: level })
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
    }, 5000);
})





//fetch relayStatus
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
setInterval(updateRelaystatus, 1000);








//manual relay switch
let button;
let switchState;
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded and parsed Successfully")
    const ManualSwitchEndPoint = "http://192.168.137.104/manualbtn";
    const btn = document.getElementById('btn')
    if (btn) {
        btn.addEventListener('change', () => {
            console.log("button checked")
            let button;
            let switchState;
            if (this.checked) {
                button = "1";
                switchState = "switched-on";
               
            }
            else {
                button = "0"
                switchState = "switched-off";
            }
            console.log(`Sending switchState: ${switchState}`);
            
            fetch(ManualSwitchEndPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ switchState: button })
            }).then(response => {
                if (response.ok) {
                    console.log(`The state ${switchState} sent successfully`);
                } else {
                    console.log(`The state ${switchState} could not be sent`);
                }
            }).catch(error => {
                console.log('Fetch error: ' + error);
            });
        });
    } else {
        console.log('Button element not found');
    }
});

