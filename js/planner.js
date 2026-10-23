/* ==========================================================
   Academic Planner
   Add tasks, mark them as completed, delete them.
   Tasks are kept in an array and saved in localStorage.
   ========================================================== */

// ---------- 1. Get the elements from the page ----------
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskError = document.getElementById("task-error");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

// ---------- 2. The array that holds all tasks ----------
// Each task looks like: { id: 123, text: "Study", due: "2026-11-01", completed: false }
let tasks = [];

// ---------- 3. Saving and loading ----------
function saveTasks() {
  try {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
  } catch (error) {
    // Storage may be blocked. The planner still works without saving.
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem("plannerTasks");
    tasks = saved ? JSON.parse(saved) : [];
  } catch (error) {
    tasks = [];
  }
}

// ---------- 4. Add, toggle and delete ----------
function addTask(text, due) {
  const newTask = {
    id: Date.now(),
    text: text,
    due: due,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// ---------- 5. Show the tasks on the page ----------
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-msg";
    empty.textContent = "No tasks yet. Add your first one above.";
    taskList.appendChild(empty);
  }

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " completed" : "");
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");

    const textBox = document.createElement("div");
    textBox.className = "task-text";

    const title = document.createElement("strong");
    title.textContent = task.text;
    textBox.appendChild(title);

    if (task.due) {
      const dueDate = document.createElement("small");
      dueDate.textContent = "Due: " + task.due;
      textBox.appendChild(dueDate);
    }

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    item.appendChild(checkbox);
    item.appendChild(textBox);
    item.appendChild(deleteButton);
    taskList.appendChild(item);
  });

  updateCount();
}

function updateCount() {
  const total = tasks.length;
  const done = tasks.filter(function (task) {
    return task.completed;
  }).length;

  if (total === 0) {
    taskCount.textContent = "";
  } else {
    taskCount.textContent = done + " of " + total + " tasks completed";
  }
}

// ---------- 6. Event handling ----------
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    taskError.textContent = "Please type a task before adding it.";
    taskInput.classList.add("invalid");
    return;
  }

  taskError.textContent = "";
  taskInput.classList.remove("invalid");

  addTask(text, taskDate.value);

  taskForm.reset();
  taskInput.focus();
});

// One listener on the list handles every checkbox and delete button
taskList.addEventListener("click", function (event) {
  const item = event.target.closest(".task-item");
  if (!item) {
    return;
  }
  const id = Number(item.dataset.id);

  if (event.target.matches(".delete-btn")) {
    deleteTask(id);
  } else if (event.target.matches("input[type='checkbox']")) {
    toggleTask(id);
  }
});

// ---------- 7. Start ----------
loadTasks();
renderTasks();