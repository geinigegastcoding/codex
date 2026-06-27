"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCompanyData } from "../actions";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    getCompanyData().then(data => {
      if (data?.tasks) {
        setTasks(data.tasks);
      }
    });
  }, []);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pending = tasks.filter(t => !t.done).length;
  const total = tasks.length;
  const progress = Math.round(((total - pending) / total) * 100) || 0;

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-4xl">
      <header className="border-b border-cyan-900/50 pb-4">
        <h1 className="text-2xl font-bold text-cyan-100 tracking-widest uppercase">Daily To-Do List</h1>
        <p className="text-cyan-600 text-sm mt-1">Focus engine and active task tracker.</p>
      </header>

      {/* Progress */}
      <div className="p-4 border border-cyan-800/50 bg-cyan-950/20 rounded flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-cyan-400 text-sm tracking-widest uppercase">Daily Progress</span>
          <span className="text-cyan-600 text-xs">{total - pending} of {total} tasks completed</span>
        </div>
        <div className="flex items-center gap-4 w-1/2">
          <div className="flex-1 h-2 bg-cyan-950 rounded overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            ></motion.div>
          </div>
          <span className="text-cyan-200 font-mono text-sm">{progress}%</span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {tasks.map((task, idx) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 border rounded flex items-center gap-4 transition-all cursor-pointer ${
              task.done 
                ? "border-cyan-900/30 bg-cyan-950/10 opacity-50" 
                : "border-cyan-800/80 bg-cyan-950/30 hover:border-cyan-500 hover:bg-cyan-900/40"
            }`}
            onClick={() => toggleTask(task.id)}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              task.done ? "border-cyan-500 bg-cyan-500" : "border-cyan-600"
            }`}>
              {task.done && <span className="text-slate-900 text-xs font-bold">✓</span>}
            </div>
            
            <div className={`flex-1 text-sm ${task.done ? "text-cyan-600 line-through" : "text-cyan-200"}`}>
              {task.text}
            </div>

            <div className="text-[10px] uppercase tracking-widest px-2 py-1 bg-cyan-950 border border-cyan-900 text-cyan-500 rounded">
              {task.tag}
            </div>
          </motion.div>
        ))}

        {/* Add Task Input */}
        <div className="mt-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Add new task..." 
            className="flex-1 bg-cyan-950/50 border border-cyan-800 text-cyan-200 text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 placeholder:text-cyan-800 rounded"
          />
          <button className="px-6 bg-cyan-900/50 border border-cyan-600 text-cyan-200 text-xs uppercase tracking-widest hover:bg-cyan-800 transition-colors rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
