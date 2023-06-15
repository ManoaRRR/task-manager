import create from 'zustand';

type Task = {
  id: string;
  title: string;
};

type TaskStore = {
  tasks: Task[];
  searchQuery: string;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setSearchQuery: (query: string) => void;
};

// Définir le store Zustand
const useTaskStore = create<TaskStore>((set) => ({
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

  const addNewTask = (title: string) => {
    const newTask: Task = {
      id: Math.random().toString(),
      title,
    };
    addTask(newTask);
  };

  const updateExistingTask = (taskId: string, updatedTitle: string) => {
    updateTask(taskId, { title: updatedTitle });
  };

  const deleteTaskById = (taskId: string) => {
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
