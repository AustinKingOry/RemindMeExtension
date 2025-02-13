document.addEventListener("DOMContentLoaded", function () {
    const keepHistoryCheckbox = document.getElementById("keepHistory");
    const notificationSoundSelect = document.getElementById("notificationSound");
    const saveSettingsBtn = document.getElementById("saveSettings");
    const previewSoundBtn = document.getElementById("previewSound");

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

    // Play selected sound when "Preview" is clicked
    previewSoundBtn.addEventListener("click", function () {
        let selectedSound = notificationSoundSelect.value;
        if (selectedSound === "Mute") return; // Don't play anything if "Mute" is selected
        if(selectedSound == "Default") selectedSound = "notification"

        const audio = new Audio(chrome.runtime.getURL(`assets/audio/${selectedSound}.mp3`));
        audio.play().catch(err => console.error("Audio play error:", err));
    });
});
