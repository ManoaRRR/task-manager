import create from 'zustand';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  addTask: (task: Task) => void;
  updateTask: (taskId: number, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  setSearchQuery: (query: string) => void;
}

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

const useTaskManager = () => {
  const { tasks, searchQuery, addTask, updateTask, deleteTask, setSearchQuery } = useTaskStore();

  const searchTasks = () => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addNewTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    addTask(newTask);
  };

  const updateExistingTask = (taskId: number, updatedTitle: string) => {
    updateTask(taskId, { title: updatedTitle });
  };

  const deleteTaskById = (taskId: number) => {
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