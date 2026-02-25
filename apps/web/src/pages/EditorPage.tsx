import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import StatusBar from "@/components/StatusBar";
import VimCursor from "@/components/VimCursor";
import { useStore, type VimMode, type Priority } from "@/lib/store";

export default function EditorPage() {
  const { tasks, toggleTask, addTask, deleteTask, updateTask } = useStore();
  const [mode, setMode] = useState<VimMode>("NORMAL");
  const [selectedLine, setSelectedLine] = useState(1);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("M");
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("M");

  const handleStartEdit = (task: { id: string; text: string; priority: Priority }) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
    setMode("INSERT");
  };

  const handleSaveEdit = () => {
    if (editingTaskId && editText.trim()) {
      updateTask(editingTaskId, editText.trim(), editPriority);
      setEditingTaskId(null);
      setMode("NORMAL");
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setMode("NORMAL");
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), newTaskPriority);
      setNewTaskText("");
      setShowAddTask(false);
      setMode("NORMAL");
    }
  };

  const handleStartInsert = () => {
    setShowAddTask(true);
    setMode("INSERT");
  };

  const handleCancel = () => {
    setShowAddTask(false);
    setNewTaskText("");
    setMode("NORMAL");
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const allDisplayTasks = [...activeTasks, ...completedTasks];

  return (
    <AppLayout
      statusBar={
        <>
          {showAddTask && (
            <div className="bg-secondary border-t border-border px-4 py-2.5 flex items-center gap-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">Esc</span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-tight">save</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">Ctrl+c</span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-tight">cancel</span>
              </div>
            </div>
          )}
          <StatusBar mode={mode} fileName="todo.md" />
        </>
      }
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">terminal</span>
          <h1 className="font-display font-bold text-base tracking-tight">todo.md</h1>
        </div>
        <div className="flex items-center gap-5">
          {!showAddTask && (
            <button onClick={handleStartInsert} className="material-symbols-outlined text-primary hover:text-syntax-green transition-colors text-xl">
              add
            </button>
          )}
          <span className="material-symbols-outlined text-muted-foreground text-xl">search</span>
          <span className="material-symbols-outlined text-muted-foreground text-xl">more_vert</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-2 pb-36 scrollbar-hide">
        {showAddTask && (
          <div className="mb-4 border-b border-border pb-4">
            <div className="flex items-center py-2">
              <div className="line-number font-mono text-xs text-syntax-yellow">
                {String(allDisplayTasks.length + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex gap-1">
                  {(["H", "M", "L"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTaskPriority(p)}
                      className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                        newTaskPriority === p
                          ? p === "H"
                            ? "text-syntax-red bg-syntax-red/20"
                            : p === "M"
                            ? "text-syntax-yellow bg-syntax-yellow/20"
                            : "text-syntax-green bg-syntax-green/20"
                          : "text-muted-foreground"
                      }`}
                    >
                      [{p}]
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                    if (e.key === "Escape") handleCancel();
                  }}
                  className="bg-transparent border-none outline-none flex-1 text-foreground text-sm"
                  placeholder="Type your task..."
                  autoFocus
                />
                <VimCursor color="green" />
              </div>
            </div>
            <div className="mt-6 px-14 space-y-2.5 border-l-2 border-muted ml-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Syntax Legend</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-syntax-red font-bold w-8">[H]</span>
                <span className="text-muted-foreground">High Priority</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-syntax-yellow font-bold w-8">[M]</span>
                <span className="text-muted-foreground">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-syntax-green font-bold w-8">[L]</span>
                <span className="text-muted-foreground">Low Priority</span>
              </div>
            </div>
          </div>
        )}

        {!showAddTask &&
          allDisplayTasks.map((task, i) => {
            const lineNum = String(i + 1).padStart(2, "0");
            const isSelected = selectedLine === i + 1;
            const isEditing = editingTaskId === task.id;
            const priorityColor =
              task.priority === "H" ? "text-syntax-red" : task.priority === "M" ? "text-syntax-yellow" : "text-syntax-green";

            return (
              <div
                key={task.id}
                onClick={() => {
                  if (!isEditing) setSelectedLine(i + 1);
                }}
              className={`flex items-start py-1.5 group cursor-pointer transition-colors ${
                  isSelected ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-muted/30"
                }`}
              >
              <div className={`line-number font-mono text-xs shrink-0 pt-[2px] ${isSelected ? "text-primary" : task.completed ? "text-muted-foreground/30" : ""}`}>
                  {lineNum}
                </div>
                <div className="flex-1 text-[13px] leading-relaxed min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {(["H", "M", "L"] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={(e) => { e.stopPropagation(); setEditPriority(p); }}
                            className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                              editPriority === p
                                ? p === "H" ? "text-syntax-red bg-syntax-red/20"
                                : p === "M" ? "text-syntax-yellow bg-syntax-yellow/20"
                                : "text-syntax-green bg-syntax-green/20"
                                : "text-muted-foreground"
                            }`}
                          >
                            [{p}]
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="bg-transparent border-none outline-none flex-1 text-foreground text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <VimCursor color="green" />
                    </div>
                  ) : task.completed ? (
                    <span
                      className="text-muted-foreground line-through opacity-40 italic"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.text}
                    </span>
                  ) : (
                    <span onClick={() => toggleTask(task.id)}>
                      <span className={`${priorityColor} font-bold`}>[{task.priority}]</span>{" "}
                      <span className="text-foreground">{task.text}</span>
                      {isSelected && <VimCursor />}
                    </span>
                  )}
                </div>
                {isSelected && !isEditing && !task.completed && (
                  <div className="flex items-center gap-1 pr-3 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(task); }}
                      className="material-symbols-outlined text-muted-foreground hover:text-syntax-yellow transition-colors text-base p-1 rounded hover:bg-muted/50"
                      title="Edit"
                    >
                      edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className="material-symbols-outlined text-muted-foreground hover:text-syntax-red transition-colors text-base p-1 rounded hover:bg-muted/50"
                      title="Delete"
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}

        {!showAddTask &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`empty-${i}`} className="flex items-center py-1.5">
              <div className="line-number font-mono text-xs text-muted-foreground/20">
                {String(allDisplayTasks.length + i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 text-sm text-muted-foreground/30">~</div>
            </div>
          ))}
      </main>
    </AppLayout>
  );
}
