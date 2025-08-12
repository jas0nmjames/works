document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript is working!");
});

// Display Browser Information to the User

document.addEventListener('DOMContentLoaded', async () => {
    const infoDiv = document.getElementById('info');
    
    // Basic info
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const cores = navigator.hardwareConcurrency;
    const memory = navigator.deviceMemory || 'Unknown';
    const online = navigator.onLine ? 'Yes' : 'No';
  
    // Battery info
    let batteryInfo = 'Battery API not supported.';
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      batteryInfo = `Level: ${(battery.level * 100).toFixed(0)}%, Charging: ${battery.charging}`;
    }
  
    // Display info
    infoDiv.innerHTML = `
      <p><small><strong>User Agent:</strong> ${userAgent}</small></p>
      <p><small><strong>Platform:</strong> ${platform}</small></p>
      <p><small><strong>Language:</strong> ${language}</small></p>
      <p><small><strong>Online:</strong> ${online}</small></p>
      <p><small><strong>CPU Cores:</strong> ${cores}</small></p>
      <p><small><strong>Memory (GB):</strong> ${memory}</small></p>
      <p><small><strong>Battery:</strong> ${batteryInfo}</small></p>
    `;
  });
  