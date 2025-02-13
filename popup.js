document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const timeInput = document.getElementById("time");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    function loadTasks() {
        chrome.storage.sync.get(["tasks"], function (result) {
            taskList.innerHTML = "";
            const tasks = result.tasks || [];
            tasks.forEach((task, index) => {
                const li = document.createElement("li");
                li.innerHTML = `${task.name} - ${new Date(task.time).toLocaleString()} 
                    <button data-index="${index}" class="delete-btn">X</button>`;
                taskList.appendChild(li);
            });
        });
    }

    addTaskBtn.addEventListener("click", function () {
        const taskName = taskInput.value.trim();
        const taskTime = timeInput.value;
        if (!taskName || !taskTime) return;

        const taskTimestamp = new Date(taskTime).getTime();
        if (taskTimestamp <= Date.now()) {
            alert("Please select a future time.");
            return;
        }

        const task = { name: taskName, time: taskTimestamp };

        // Send message to background.js to schedule the task
        chrome.runtime.sendMessage({ type: "schedule-task", task }, function (response) {
            if (response.success) {
                taskInput.value = "";
                timeInput.value = "";
            }
        });
    });

    taskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            chrome.storage.sync.get(["tasks"], function (result) {
                const tasks = result.tasks || [];
                const [removedTask] = tasks.splice(index, 1);
                chrome.storage.sync.set({ tasks }, function () {
                    chrome.alarms.clear(removedTask.name);
                    loadTasks();
                });
            });
        }
    });

    // Listen for changes in storage and reload tasks dynamically
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === "sync" && changes.tasks) {
            loadTasks();
        }
    });

    loadTasks();
});
