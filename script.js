const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const countValue = document.querySelector(".count-value");
const error = document.getElementById("error");
const deleteAllBtn = document.getElementById("delete-all-btn");
let taskCount = 0;
let editMode = false;
let currentTask = null;

const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
}

const updateCompletedCount = () => {
    const completedTasks = tasksContainer.querySelectorAll('.task-check:checked').length;
    const totalTasks = tasksContainer.querySelectorAll('.task').length;
    document.querySelector('#pending-tasks span').innerText = totalTasks - completedTasks;
}

const saveTasks = () => {
    const tasks = [];
    tasksContainer.querySelectorAll('.task').forEach(task => {
        tasks.push({
            name: task.querySelector('.taskName').innerText,
            completed: task.querySelector('.task-check').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.name, task.completed);
    });
    taskCount = tasks.length;
    displayCount(taskCount);
    updateCompletedCount();
}

const addTaskToDOM = (taskName, completed = false) => {
    const task = document.createElement('div');
    task.classList.add('task');
    task.innerHTML = `
        <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}>
        <span class="taskName ${completed ? 'completed' : ''}">${taskName}</span>
        <button class="edit">
            <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="delete">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    `;

    const deleteButton = task.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        tasksContainer.removeChild(task);
        taskCount--;
        displayCount(taskCount);
        saveTasks();
        updateCompletedCount();
    });

    const editButton = task.querySelector('.edit');
    editButton.addEventListener('click', () => {
        newTaskInput.value = taskName;
        editMode = true;
        currentTask = task;
    });

    const taskCheck = task.querySelector('.task-check');
    taskCheck.addEventListener('change', () => {
        task.querySelector('.taskName').classList.toggle('completed', taskCheck.checked);
        updateCompletedCount();
        saveTasks();
    });

    tasksContainer.appendChild(task);
}

const addTask = () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = "none";
    if (!taskName) {
        setTimeout(() => {
            error.style.display = "block";
        }, 200);
        return;
    }
    if (editMode) {
        currentTask.querySelector('.taskName').innerText = taskName;
        editMode = false;
        currentTask = null;
    } else {
        addTaskToDOM(taskName);
        taskCount++;
        displayCount(taskCount);
    }
    newTaskInput.value = "";
    saveTasks();
    updateCompletedCount();
}

const deleteAllTasks = () => {
    tasksContainer.innerHTML = '<p id="pending-tasks">You have <span class="count-value">0</span> task(s) to complete.</p>';
    taskCount = 0;
    displayCount(taskCount);
    localStorage.removeItem('tasks');
}

addBtn.addEventListener("click", addTask);
deleteAllBtn.addEventListener("click", deleteAllTasks);
document.addEventListener("DOMContentLoaded", loadTasks);
