import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBar from "@/components/StatusBar";
import { useStore } from "@/lib/store";

export default function NotesPage() {
  const { notes, addNote } = useStore();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSaveNew = () => {
    if (newTitle.trim()) {
      addNote(newTitle.trim(), newContent);
      setNewTitle("");
      setNewContent("");
      setShowNew(false);
    }
  };

  return (
    <AppLayout statusBar={<StatusBar mode="NORMAL" fileName="notes/" extra="dir" />}>
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-syntax-yellow text-xl">description</span>
          <h1 className="font-display font-bold text-base tracking-tight">notes/</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowNew(true)} className="material-symbols-outlined text-primary hover:text-syntax-green transition-colors text-xl">
            note_add
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-4 pb-36 px-4 scrollbar-hide space-y-4">
        {showNew && (
          <div className="border border-primary/30 p-4 rounded space-y-3 bg-surface">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-bold text-syntax-yellow"
              placeholder="filename.md"
              autoFocus
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[13px] text-muted-foreground resize-none h-24 leading-relaxed"
              placeholder="Write your note..."
            />
            <div className="flex gap-4 pt-1">
              <button onClick={handleSaveNew} className="text-xs text-syntax-green font-bold uppercase tracking-wider hover:underline">
                :w (save)
              </button>
              <button
                onClick={() => { setShowNew(false); setNewTitle(""); setNewContent(""); }}
                className="text-xs text-syntax-red font-bold uppercase tracking-wider hover:underline"
              >
                :q (cancel)
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="bg-surface border border-border/50 p-3.5 rounded hover:border-primary/60 cursor-pointer transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-2 text-syntax-yellow text-xs font-bold">
                <span className="material-symbols-outlined text-base">
                  {note.title.endsWith(".md") ? "markdown" : "description"}
                </span>
                <span className="truncate">{note.title}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 font-mono leading-relaxed group-hover:text-foreground/60 transition-colors">
                {note.content}
              </p>
              {note.images.length > 0 && (
                <div className="flex gap-1.5 mt-2.5">
                  {note.images.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-9 h-9 object-cover rounded border border-border opacity-50 group-hover:opacity-100 transition-opacity" />
                  ))}
                  {note.images.length > 3 && (
                    <span className="text-[11px] text-muted-foreground self-center ml-1">+{note.images.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
