document.addEventListener("DOMContentLoaded", function () {
    const keepHistoryCheckbox = document.getElementById("keepHistory");
    const notificationSoundSelect = document.getElementById("notificationSound");
    const saveSettingsBtn = document.getElementById("saveSettings");

    // Load saved settings
    chrome.storage.sync.get(["keepHistory"], function (data) {
        keepHistoryCheckbox.checked = data.keepHistory ?? true; // Default: true
        notificationSoundSelect.value = data.notificationSound || "Default"; // Default sound
    });

    // Save settings when the button is clicked
    saveSettingsBtn.addEventListener("click", function () {
        chrome.storage.sync.set({
            keepHistory: keepHistoryCheckbox.checked,
            notificationSound: notificationSoundSelect.value
        }, function () {
            alert("Settings saved!");
        });
    });
});
