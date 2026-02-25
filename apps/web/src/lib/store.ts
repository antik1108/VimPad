import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export type Priority = "H" | "M" | "L";
export type VimMode = "NORMAL" | "INSERT" | "VISUAL";

export interface Task {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: Date;
}

export interface HistoryEntry {
  id: string;
  hash: string;
  message: string;
  date: Date;
}

export interface AppConfig {
  theme: "dark" | "light" | "system";
  showLineNumbers: boolean;
  sortOrder: "priority" | "date" | "alpha";
  confirmDelete: boolean;
  reminderTime: string;
  highPriorityColor: string;
  defaultPriority: Priority;
  autoSave: boolean;
}

const DEFAULT_CONFIG: AppConfig = {
  theme: "dark",
  showLineNumbers: true,
  sortOrder: "priority",
  confirmDelete: true,
  reminderTime: "0800",
  highPriorityColor: "#ff5555",
  defaultPriority: "M",
  autoSave: true,
};

const toTask = (row: {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}): Task => ({
  id: row.id,
  text: row.text,
  priority: row.priority,
  completed: row.completed,
  createdAt: new Date(row.created_at),
  completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
});

const toNote = (row: {
  id: string;
  title: string;
  content: string;
  images: string[] | null;
  created_at: string;
}): Note => ({
  id: row.id,
  title: row.title,
  content: row.content,
  images: row.images ?? [],
  createdAt: new Date(row.created_at),
});

const toHistoryEntry = (row: {
  id: string;
  hash: string;
  message: string;
  date: string;
}): HistoryEntry => ({
  id: row.id,
  hash: row.hash,
  message: row.message,
  date: new Date(row.date),
});

const toConfig = (row: {
  theme: "dark" | "light" | "system";
  show_line_numbers: boolean;
  sort_order: "priority" | "date" | "alpha";
  confirm_delete: boolean;
  reminder_time: string;
  high_priority_color: string;
  default_priority: Priority;
  auto_save: boolean;
}): AppConfig => ({
  theme: row.theme,
  showLineNumbers: row.show_line_numbers,
  sortOrder: row.sort_order,
  confirmDelete: row.confirm_delete,
  reminderTime: row.reminder_time,
  highPriorityColor: row.high_priority_color,
  defaultPriority: row.default_priority,
  autoSave: row.auto_save,
});

const randomHash = () => Math.random().toString(16).substring(2, 9);

export function useStore() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  const ensureConfig = useCallback(async (userId: string) => {
    const { data: existing } = await supabase.from("app_configs").select("*").eq("user_id", userId).maybeSingle();

    if (!existing) {
      const { data: inserted } = await supabase
        .from("app_configs")
        .insert({
          user_id: userId,
          theme: DEFAULT_CONFIG.theme,
          show_line_numbers: DEFAULT_CONFIG.showLineNumbers,
          sort_order: DEFAULT_CONFIG.sortOrder,
          confirm_delete: DEFAULT_CONFIG.confirmDelete,
          reminder_time: DEFAULT_CONFIG.reminderTime,
          high_priority_color: DEFAULT_CONFIG.highPriorityColor,
          default_priority: DEFAULT_CONFIG.defaultPriority,
          auto_save: DEFAULT_CONFIG.autoSave,
        })
        .select("*")
        .single();

      if (inserted) {
        setConfig(toConfig(inserted));
      }
      return;
    }

    setConfig(toConfig(existing));
  }, []);

  const reload = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setNotes([]);
      setHistory([]);
      setConfig(DEFAULT_CONFIG);
      return;
    }

    await ensureConfig(user.id);

    const [{ data: taskRows }, { data: noteRows }, { data: historyRows }] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("notes").select("*").order("created_at", { ascending: false }),
      supabase.from("history_entries").select("*").order("date", { ascending: false }),
    ]);

    setTasks((taskRows ?? []).map(toTask));
    setNotes((noteRows ?? []).map(toNote));
    setHistory((historyRows ?? []).map(toHistoryEntry));
  }, [user, ensureConfig]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(
    async (text: string, priority: Priority) => {
      if (!user) return;

      const { data } = await supabase
        .from("tasks")
        .insert({ user_id: user.id, text, priority, completed: false })
        .select("*")
        .single();

      if (data) {
        setTasks((prev) => [toTask(data), ...prev]);
      }
    },
    [user],
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (!user) return;

      const current = tasks.find((task) => task.id === id);
      if (!current) return;

      const completed = !current.completed;
      const completedAt = completed ? new Date().toISOString() : null;

      const { data } = await supabase
        .from("tasks")
        .update({ completed, completed_at: completedAt })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (!data) return;

      const mapped = toTask(data);
      setTasks((prev) => prev.map((task) => (task.id === id ? mapped : task)));

      if (completed) {
        const { data: historyData } = await supabase
          .from("history_entries")
          .insert({
            user_id: user.id,
            hash: randomHash(),
            message: `Completed: ${current.text}`,
            date: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (historyData) {
          setHistory((prev) => [toHistoryEntry(historyData), ...prev]);
        }
      }
    },
    [tasks, user],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return;

      await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [user],
  );

  const updateTask = useCallback(
    async (id: string, text: string, priority: Priority) => {
      if (!user) return;

      const { data } = await supabase
        .from("tasks")
        .update({ text, priority })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (data) {
        const mapped = toTask(data);
        setTasks((prev) => prev.map((task) => (task.id === id ? mapped : task)));
      }
    },
    [user],
  );

  const addNote = useCallback(
    async (title: string, content: string, images: string[] = []) => {
      if (!user) return;

      const { data } = await supabase
        .from("notes")
        .insert({ user_id: user.id, title, content, images })
        .select("*")
        .single();

      if (data) {
        setNotes((prev) => [toNote(data), ...prev]);
      }
    },
    [user],
  );

  const updateNote = useCallback(
    async (id: string, content: string) => {
      if (!user) return;

      setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, content } : note)));

      await supabase
        .from("notes")
        .update({ content })
        .eq("id", id)
        .eq("user_id", user.id);
    },
    [user],
  );

  const addImageToNote = useCallback(
    async (id: string, imageUrl: string) => {
      if (!user) return;

      const current = notes.find((note) => note.id === id);
      if (!current) return;

      const images = [...current.images, imageUrl];
      const { data } = await supabase
        .from("notes")
        .update({ images })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (data) {
        const mapped = toNote(data);
        setNotes((prev) => prev.map((note) => (note.id === id ? mapped : note)));
      }
    },
    [notes, user],
  );

  const removeImageFromNote = useCallback(
    async (noteId: string, imageIndex: number) => {
      if (!user) return;

      const current = notes.find((note) => note.id === noteId);
      if (!current) return;

      const images = [...current.images];
      images.splice(imageIndex, 1);

      const { data } = await supabase
        .from("notes")
        .update({ images })
        .eq("id", noteId)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (data) {
        const mapped = toNote(data);
        setNotes((prev) => prev.map((note) => (note.id === noteId ? mapped : note)));
      }
    },
    [notes, user],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!user) return;

      await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [user],
  );

  const updateConfig = useCallback(
    async (updates: Partial<AppConfig>) => {
      if (!user) return;

      const nextConfig = { ...config, ...updates };
      setConfig(nextConfig);

      await supabase.from("app_configs").upsert(
        {
          user_id: user.id,
          theme: nextConfig.theme,
          show_line_numbers: nextConfig.showLineNumbers,
          sort_order: nextConfig.sortOrder,
          confirm_delete: nextConfig.confirmDelete,
          reminder_time: nextConfig.reminderTime,
          high_priority_color: nextConfig.highPriorityColor,
          default_priority: nextConfig.defaultPriority,
          auto_save: nextConfig.autoSave,
        },
        { onConflict: "user_id" },
      );
    },
    [config, user],
  );

  return useMemo(
    () => ({
      tasks,
      notes,
      history,
      config,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      addNote,
      updateNote,
      deleteNote,
      addImageToNote,
      removeImageFromNote,
      updateConfig,
      reload,
    }),
    [
      tasks,
      notes,
      history,
      config,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      addNote,
      updateNote,
      deleteNote,
      addImageToNote,
      removeImageFromNote,
      updateConfig,
      reload,
    ],
  );
}
