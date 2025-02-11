chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Task Reminder",
        message: `Time for: ${alarm.name}`,
        priority: 2
    });
    
    // Remove the completed task
    chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(task => task.name !== alarm.name);
        chrome.storage.sync.set({ tasks: updatedTasks });
    });
});
