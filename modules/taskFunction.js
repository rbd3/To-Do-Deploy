import TODoTasks from './tasks.js';

const task = document.getElementsByClassName('tasks')[0];
const addNew = document.createElement('input');
addNew.type = 'text';
addNew.placeholder = 'Add to your list...';
addNew.classList.add('addNew');
task.appendChild(addNew);
const ulElement = document.createElement('ul');
ulElement.classList.add('card-sub');

const tasks = new TODoTasks();

// Clear existing tasks
const clearTaskList = () => {
  const ulElement = task.querySelector('.card-sub');
  if (ulElement) {
    ulElement.innerHTML = '';
  }
};

function editTaskDescription(taskId, liElement, taskList) {
  const taskDescriptionElement = liElement.querySelector('.task-description');
  if (taskDescriptionElement) {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = taskDescriptionElement.textContent;

    inputElement.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        const newDescription = inputElement.value.trim();
        const success = tasks.editDescription(taskId, newDescription);
        if (success) {
          taskList();
        }
      }
    });

    taskDescriptionElement.replaceWith(inputElement);
    inputElement.focus();
  }
}
const taskList = () => {
  clearTaskList();

  tasks.tasks.forEach((task) => {
    const liElement = document.createElement('li');
    liElement.dataset.taskId = task.id;
    liElement.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-description">${task.description}</span>
      <i class="fas fa-ellipsis-v display"></i>
      <i class="fa-solid fa-trash-can ${task.completed ? '' : 'hide'}"></i>
    `;

    const threeDotsIcon = liElement.querySelector('.fa-ellipsis-v');
    const trashIcon = liElement.querySelector('.fa-trash-can');
    const checkbox = liElement.querySelector('input[type="checkbox"]');

    threeDotsIcon.addEventListener('click', () => {
      editTaskDescription(task.id, liElement, taskList);
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        trashIcon.classList.remove('hide');
        threeDotsIcon.classList.add('hide');
      } else {
        trashIcon.classList.add('hide');
        threeDotsIcon.classList.remove('hide');
      }
    });

    trashIcon.addEventListener('click', () => {
      const taskId = parseInt(liElement.dataset.taskId, 10);
      tasks.remove(taskId);
      clearTaskList();
      taskList();
    });

    ulElement.appendChild(liElement);
  });

  task.appendChild(ulElement);
  localStorage.setItem('tasks', JSON.stringify(tasks.tasks));
};

const buttonClear = document.createElement('button');
buttonClear.type = 'button';
buttonClear.classList.add('button-clear');
buttonClear.textContent = 'Clear All Completed!';
document.body.appendChild(buttonClear);

const addTask = () => {
  const newTaskDescription = addNew.value.trim();
  if (newTaskDescription !== '') {
    const existingTask = tasks.tasks.find((task) => task.description === newTaskDescription);
    if (!existingTask) {
      const newTask = {
        id: tasks.tasks.length + 1,
        description: newTaskDescription,
        completed: false,
      };
      tasks.tasks.push(newTask);
      tasks.tasks.forEach((task, index) => {
        task.id = index + 1;
      });
      clearTaskList();
      taskList();
      addNew.value = '';
    }
  }
};

addNew.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    addTask();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  taskList();
});

const clearCompletedTasks = () => {
  const taskElements = ulElement.querySelectorAll('li');
  const updatedTasks = [];

  taskElements.forEach((element) => {
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) {
      const taskId = Number(element.dataset.taskId);
      updatedTasks.push(tasks.tasks.find((task) => task.id === taskId));
    }
  });

  // Update the tasks array
  tasks.tasks = updatedTasks;
  clearTaskList();
  taskList();
  localStorage.setItem('tasks', JSON.stringify(tasks.tasks));
};

buttonClear.addEventListener('click', clearCompletedTasks);

export default taskList;
