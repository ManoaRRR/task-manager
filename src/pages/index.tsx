import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  searchQuery: string;
}

type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; completed: boolean }
  | { type: "DELETE_TASK"; id: string }
  | { type: "SET_SEARCH_QUERY"; query: string };

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load tasks from Local Storage on component mount
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to Local Storage when tasks state changes
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const dispatch = (action: TaskAction) => {
    switch (action.type) {
      case "ADD_TASK":
        setTasks([...tasks, action.task]);
        break;
      case "UPDATE_TASK":
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === action.id ? { ...task, completed: action.completed } : task
          )
        );
        break;
      case "DELETE_TASK":
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== action.id));
        break;
      case "SET_SEARCH_QUERY":
        setSearchQuery(action.query);
        break;
      default:
        break;
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { tasks: filteredTasks, searchQuery, dispatch };
};

const calculateTimeDifference = (server: Date, client: Date) => {
  const diff = Math.abs(server.getTime() - client.getTime()) / 1000;
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

export default function Home() {
  const router = useRouter();
  const { tasks, searchQuery, dispatch } = useTasks();
  const serverTime = new Date(); // Replace with your server time
  const clientTime = new Date();

  const moveToTaskManager = () => {
    router.push("/tasks");
  };

  return (
    <>
      <Head>
        <title>Web 2 - Exam TD</title>
        <meta name="description" content="Just an exam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>The easiest exam you will ever find</h1>
        <div>
          <p>
            Server time: <span className="serverTime">{serverTime.toLocaleString()}</span>
          </p>
          <p>
            Time diff: <span className="serverTime">{calculateTimeDifference(serverTime, clientTime)}</span>
          </p>
        </div>

        <div>
          <button onClick={moveToTaskManager}>Go to task manager</button>
        </div>
      </main>
    </>
  );
}
