document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const timeInput = document.getElementById("time");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const settingsButton = document.getElementById("openSettings");

    function loadTasks() {
        chrome.storage.sync.get(["tasks"], function (result) {
            taskList.innerHTML = "";
            const tasks = result.tasks || [];
            tasks.forEach((task, index) => {
                const li = document.createElement("li");
                li.classList.add("bg-white", "border", "border-gray-200", "rounded-lg", "p-3", "shadow-sm", "hover:shadow-md", "transition", "duration-300");
                
                const wrapperDiv = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-gray-800">${task.name}</h3>
                        <p class="text-sm text-gray-500">${new Date(task.time).toLocaleString()} </p>
                    </div>
                    <button class="delete-btn text-red-500 hover:text-red-700 focus:outline-none" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                `;

                li.innerHTML=wrapperDiv;
                taskList.appendChild(li);
            });
        });
    }

    settingsButton.addEventListener("click", function () {
        chrome.tabs.create({ url: "settings.html" });
    });

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
        const deleteButton = event.target.closest(".delete-btn"); // Find the nearest delete button
        if (!deleteButton) return; // Exit if click was outside a delete button
    
        const index = deleteButton.getAttribute("data-index");
        chrome.storage.sync.get(["tasks"], function (result) {
            const tasks = result.tasks || [];
            const [removedTask] = tasks.splice(index, 1);
            chrome.storage.sync.set({ tasks }, function () {
                chrome.alarms.clear(removedTask.name);
                loadTasks();
            });
        });
    });
    

    // Listen for changes in storage and reload tasks dynamically
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === "sync" && changes.tasks) {
            loadTasks();
        }
    });

    loadTasks();
});
