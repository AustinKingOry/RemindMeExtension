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

chrome.alarms.onAlarm.addListener(async function (alarm) {
    const notificationId = `task-${Date.now()}`;
    chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Task Reminder",
        message: `Time for: ${alarm.name}`,
        priority: 2
    });

     // Keep the notification for 10 seconds
     setTimeout(() => {
        chrome.notifications.clear(notificationId);
    }, 10000);
    // Ensure the offscreen document exists
    await ensureOffscreenDocument();

    // Send a message to the offscreen document to play the sound
    chrome.runtime.sendMessage({ type: "play-sound" });

    // Remove the completed task
    chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(task => task.name !== alarm.name);
        chrome.storage.sync.set({ tasks: updatedTasks });
    });
});
