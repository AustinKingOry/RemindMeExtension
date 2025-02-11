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
        const task = taskInput.value.trim();
        const time = timeInput.value;
        if (!task || !time) return;

        chrome.storage.sync.get(["tasks"], function (result) {
            const tasks = result.tasks || [];
            tasks.push({ name: task, time: time });
            chrome.storage.sync.set({ tasks }, function () {
                chrome.alarms.create(task, { when: new Date(time).getTime() });
                loadTasks();
                taskInput.value = "";
                timeInput.value = "";
            });
        });
    });

    loadTasks();
});
