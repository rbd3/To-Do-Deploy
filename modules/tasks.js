export default class TODoTasks {
  constructor() {
    this.tasks = [];
  }

  add(task) {
    task.completed = false;
    task.id = this.tasks.length + 1;
    this.tasks.push(task);
  }

  remove(id) {
    this.tasks = this.tasks.filter((item) => item.id !== id);
    this.tasks.forEach((item, index) => {
      item.id = index;
    });
  }

  editDescription(id, newDescription) {
    const task = this.tasks.find((item) => item.id === id);
    if (task) {
      task.description = newDescription;
      return true;
    }
    return false;
  }

  updateCompletionStatus(taskId, completed) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = completed;
    }
  }
}
