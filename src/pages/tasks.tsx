import React, { ChangeEvent, useRef } from 'react';
import { useTaskManager } from '@/store/useTaskManager';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskManager = () => {
  const createTaskRef = useRef<HTMLInputElement>(null);
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    searchTasks,
    addNewTask,
    updateExistingTask,
    deleteTaskById,
  } = useTaskManager();

  const handleAddTask = () => {
    const title = createTaskRef.current?.value || '';
    if (title) {
      const newTask: Task = {
        id: Date.now(),
        title,
        completed: false,
      };
      addNewTask(newTask);
      createTaskRef.current!.value = '';
    }
  };

  const handleUpdateTask = (taskId: number, updatedTitle: string) => {
    updateExistingTask(taskId, updatedTitle);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskById(taskId);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = searchQuery ? searchTasks() : tasks;

  return (
    <div>
      <h1>Task Manager</h1>

      <input type="text" ref={createTaskRef} />

      <button onClick={handleAddTask}>Add Task</button>

      <input type="text" onChange={handleSearch} placeholder="Search Task" />

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input
              type="text"
              value={task.title}
              onChange={(e) => handleUpdateTask(task.id, e.target.value)}
            />
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
