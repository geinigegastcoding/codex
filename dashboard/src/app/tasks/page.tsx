import { getAllTasks } from '@/lib/kennis';

export default async function TasksPage() {
  const tasks = getAllTasks();
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-700 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-widest text-cyan-200 mb-6 flex items-center gap-3">
        <span className="w-2 h-6 bg-cyan-500 inline-block"></span>
        GLOBAL TASK MATRIX
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <section className="bg-slate-950/80 border border-cyan-900/40 backdrop-blur-md p-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <h2 className="text-sm font-bold border-b border-cyan-800 pb-2 mb-4 uppercase tracking-widest text-cyan-400">
            Active Directives ({pendingTasks.length})
          </h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-cyan-950/20 border border-cyan-900/30 hover:border-cyan-500/50 transition-colors">
                <div className="w-4 h-4 border border-cyan-500 mt-0.5 flex-shrink-0 cursor-pointer hover:bg-cyan-900/50"></div>
                <div>
                  <p className="text-sm text-cyan-100">{task.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] text-cyan-600 uppercase border border-cyan-900 px-1.5 py-0.5">
                      {task.file}
                    </span>
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-cyan-400 uppercase bg-cyan-950 px-1.5 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-cyan-600/50 text-sm italic py-4">No active directives found in Kennis vault.</div>
            )}
          </div>
        </section>

        {/* Completed Tasks */}
        <section className="bg-slate-950/80 border border-cyan-900/40 backdrop-blur-md p-6">
          <h2 className="text-sm font-bold border-b border-cyan-800 pb-2 mb-4 uppercase tracking-widest text-cyan-700">
            Archived Directives ({completedTasks.length})
          </h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 opacity-50 hover:opacity-80 transition-opacity">
                <div className="w-4 h-4 border border-cyan-700 bg-cyan-900 mt-0.5 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-500"></div>
                </div>
                <div>
                  <p className="text-sm text-cyan-600 line-through">{task.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-cyan-800 uppercase">
                      {task.file}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
