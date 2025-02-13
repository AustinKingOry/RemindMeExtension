document.addEventListener("DOMContentLoaded", function () {
    const keepHistoryCheckbox = document.getElementById("keepHistory");
    const notificationSoundSelect = document.getElementById("notificationSound");
    const saveSettingsBtn = document.getElementById("saveSettings");

     // Load stored settings and apply defaults based on existing data
     chrome.storage.sync.get(["keepHistory", "notificationSound"], function (data) {
        if (data.keepHistory !== undefined) {
            keepHistoryCheckbox.checked = data.keepHistory;
        } else {
            keepHistoryCheckbox.checked = true; // Default if no stored value
        }

        if (data.notificationSound) {
            notificationSoundSelect.value = data.notificationSound;
        } else {
            notificationSoundSelect.value = "Default"; // Default if no stored value
        }
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
