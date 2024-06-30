navigator.getBattery().then(function(battery) {
    function updateBatteryStatus() {
        const batteryLevel = (battery.level * 100).toFixed(0);
        const isCharging = battery.charging;

        console.log(`Battery Level: ${batteryLevel}%`);
        console.log(`Is Charging: ${isCharging}`);

        document.getElementById('battery-level').textContent = batteryLevel;
        if (isCharging) {
            document.getElementById('charging-status').textContent = 'Charging...';
            document.getElementById('charging-status').classList.add('charging');
        } else {
            document.getElementById('charging-status').textContent = 'Not charging';
            document.getElementById('charging-status').classList.remove('charging');
        }
    }

    // Initial update
    updateBatteryStatus();

    // Update on events
    battery.addEventListener('levelchange', updateBatteryStatus);
    battery.addEventListener('chargingchange', updateBatteryStatus);
}).catch(function(error) {
    console.error('Battery Status API not supported:', error);
});