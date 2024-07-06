// Manual relay switch

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const ManualSwitchEndPoint = "http://192.168.137.104/manualbtn";
    const btn = document.getElementById('btn');

    if (btn) {
        btn.addEventListener('change', function () {
            console.log('Button changed');

            let button;
            let switchState;
            
            if (this.checked) {
                button = "1";
                switchState = "switched-On";
                this.style.color = "green";
            } else {
                button = "0";
                switchState = "switched-Off";
                this.style.color = "red";
            }

            console.log(`Sending switchState: ${button}`);
            
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
