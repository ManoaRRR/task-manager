import create from 'zustand';

// Définir le store Zustand
const useTaskStore = create((set) => ({
  tasks: [],
  searchQuery: '',
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
    })),
  deleteTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) })),
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
}));

// Hook personnalisé pour gérer les fonctionnalités de recherche, d'ajout, de mise à jour et de suppression des tâches
const useTaskManager = () => {
  const { tasks, searchQuery, addTask, updateTask, deleteTask, setSearchQuery } = useTaskStore();

  const searchTasks = () => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addNewTask = (title) => {
    const newTask = {
      id: Math.random().toString(),
      title,
    };
    addTask(newTask);
  };

  const updateExistingTask = (taskId, updatedTitle) => {
    updateTask(taskId, { title: updatedTitle });
  };

  const deleteTaskById = (taskId) => {
    deleteTask(taskId);
  };

  return {
    tasks: searchQuery ? searchTasks() : tasks,
    searchQuery,
    setSearchQuery,
    searchTasks,
    addNewTask,
    updateExistingTask,
    deleteTaskById,
  };
};

export { useTaskManager };
