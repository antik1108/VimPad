import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBar from "@/components/StatusBar";
import { useStore } from "@/lib/store";

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, config, updateNote, deleteNote, addImageToNote, removeImageFromNote } = useStore();
  const note = notes.find((n) => n.id === id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [draftContent, setDraftContent] = useState("");

  useEffect(() => {
    setDraftContent(note?.content ?? "");
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [note?.id]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!note) {
    return (
      <AppLayout statusBar={<StatusBar mode="NORMAL" fileName="notes/" extra="404" />}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-mono">-- FILE NOT FOUND --</p>
        </div>
      </AppLayout>
    );
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !id) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        addImageToNote(id, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (urlValue.trim() && id) {
      addImageToNote(id, urlValue.trim());
      setUrlValue("");
      setShowUrlInput(false);
    }
  };

  const queueSave = (content: string) => {
    if (!note || !config.autoSave) return;

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      void updateNote(note.id, content);
      saveTimeoutRef.current = null;
    }, 600);
  };

  const flushSave = () => {
    if (!note) return;

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (draftContent !== note.content) {
      void updateNote(note.id, draftContent);
    }
  };

  return (
    <AppLayout statusBar={<StatusBar mode="INSERT" fileName={`notes/${note.title}`} extra="modified" />}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/notes")} className="material-symbols-outlined text-muted-foreground hover:text-foreground transition-colors text-lg">
            arrow_back
          </button>
          <span className="material-symbols-outlined text-syntax-yellow text-base">
            {note.title.endsWith(".md") ? "markdown" : "description"}
          </span>
          <h1 className="font-display font-bold text-sm tracking-tight text-syntax-yellow">{note.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="material-symbols-outlined text-muted-foreground hover:text-primary transition-colors text-xl"
          >
            add_photo_alternate
          </button>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="material-symbols-outlined text-muted-foreground hover:text-primary transition-colors text-xl"
          >
            add_link
          </button>
          <button
            onClick={() => { deleteNote(note.id); navigate("/notes"); }}
            className="material-symbols-outlined text-muted-foreground hover:text-destructive transition-colors text-xl"
          >
            delete
          </button>
        </div>
      </header>

      {showUrlInput && (
        <div className="px-5 py-3 border-b border-border bg-surface flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">URL:</span>
          <input
            type="text"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            className="flex-1 bg-transparent border border-border rounded px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary font-mono"
            placeholder="https://example.com/image.png"
            autoFocus
          />
          <button onClick={handleAddUrl} className="text-xs text-syntax-green font-bold font-mono">:w</button>
          <button onClick={() => { setShowUrlInput(false); setUrlValue(""); }} className="text-xs text-syntax-red font-bold font-mono">:q</button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-36 scrollbar-hide space-y-4">
        <textarea
          value={draftContent}
          onChange={(e) => {
            const nextContent = e.target.value;
            setDraftContent(nextContent);
            queueSave(nextContent);
          }}
          onBlur={flushSave}
          className="bg-transparent border-none outline-none w-full text-[13px] text-foreground resize-none font-mono leading-loose min-h-[240px]"
          placeholder="Start writing..."
        />

        {note.images.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">attachments ({note.images.length})</span>
            <div className="grid grid-cols-3 gap-2.5">
              {note.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`attachment ${i + 1}`}
                    className="w-full aspect-square object-cover rounded border border-border"
                  />
                  <button
                    onClick={() => removeImageFromNote(note.id, i)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
