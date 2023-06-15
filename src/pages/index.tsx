import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Définition des interfaces pour la tâche et l'état des tâches
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  searchQuery: string;
}

// Définition des actions pour la gestion des tâches
type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; completed: boolean }
  | { type: "DELETE_TASK"; id: string }
  | { type: "SET_SEARCH_QUERY"; query: string };

// Hook personnalisé pour gérer les fonctionnalités de recherche, d'ajout, de mise à jour et de suppression des tâches
const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Charger les tâches depuis le Local Storage lors du montage du composant
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Sauvegarder les tâches dans le Local Storage lorsque l'état des tâches change
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

// Fonction utilitaire pour calculer la différence entre l'heure du serveur et l'heure du navigateur
const calculateTimeDifference = (server: Date, client: Date) => {
  const diff = Math.abs(server.getTime() - client.getTime()) / 1000;
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

// Fonction Next.js pour récupérer l'heure du serveur côté serveur
export async function getServerSideProps() {
  const serverTime = new Date().toISOString();

  return {
    props: {
      serverTime,
    },
  };
}

// Composant de la page d'accueil
export default function Home({ serverTime }: { serverTime: string }) {
  const router = useRouter();
  const { tasks, searchQuery, dispatch } = useTasks();
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

        {/* Afficher l'heure du serveur */}
        <div>
          <p>
            Server time: <span className="serverTime">{new Date(serverTime).toLocaleString()}</span>
          </p>

          {/* Calculer et afficher la différence entre l'heure du serveur et l'heure du navigateur */}
          <p>
            Time diff: <span className="serverTime">{calculateTimeDifference(new Date(serverTime), clientTime)}</span>
          </p>
        </div>

        <div>
          <button onClick={moveToTaskManager}>Go to task manager</button>
        </div>
      </main>
    </>
  );
}
