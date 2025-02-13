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
    chrome.runtime.sendMessage({ type: "play-sound" });

    // Remove the completed task
    chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(task => task.name !== alarm.name);
        chrome.storage.sync.set({ tasks: updatedTasks });
    });
});
