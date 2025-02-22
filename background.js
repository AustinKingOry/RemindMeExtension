// Ensure an offscreen document exists for audio playback
async function ensureOffscreenDocument() {
    const existingContexts = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] });

    if (existingContexts.length === 0) {
        await chrome.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["AUDIO_PLAYBACK"],
            justification: "Play notification sounds for task reminders"
        });
    }
}

// Function to schedule a reminder and store it in storage
function scheduleReminder(task) {
    chrome.alarms.create(task.name, { when: task.time });

    chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const updatedTasks = [...tasks, task];
        chrome.storage.sync.set({ tasks: updatedTasks });
    });
}

// Restore reminders when Chrome starts
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const now = Date.now();

        tasks.forEach((task) => {
            if (task.time > now) {
                chrome.alarms.create(task.name, { when: task.time });
            }
        });
    });
});

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async function (alarm) {
    const notificationId = `task-${Date.now()}`;
    chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Task Reminder",
        message: `Time for: ${alarm.name}`,
        priority: 2,
        silent: true
    });

    // Keep the notification for 10 seconds
    setTimeout(() => {
        chrome.notifications.clear(notificationId);
    }, 10000);

    // Ensure offscreen document exists for sound playback
    await ensureOffscreenDocument();
    // Retrieve the user's selected sound
    chrome.storage.sync.get(["notificationSound"], function (data) {
        let soundFile = "notification.mp3"; // Default sound file

        switch (data.notificationSound) {
            case "Alert":
                soundFile = "Alert.mp3";
                break;
            case "Computer":
                soundFile = "Computer.mp3";
                break;
            case "Guitar":
                soundFile = "Guitar.mp3";
                break;
            case "Mute":
                return; // Do not play any sound
        }

        // Send message to offscreen document to play the selected sound
        chrome.runtime.sendMessage({ type: "play-sound", sound: soundFile });
    });

    // Check user settings before deleting the task
    chrome.storage.sync.get(["keepHistory"], function (data) {
        if (!data.keepHistory) {
            chrome.storage.sync.get(["tasks"], function (result) {
                const tasks = result.tasks || [];
                const updatedTasks = tasks.filter(task => task.name !== alarm.name);
                chrome.storage.sync.set({ tasks: updatedTasks });
            });
        }
    });
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "schedule-task") {
        scheduleReminder(message.task);
        sendResponse({ success: true });
    }
});
