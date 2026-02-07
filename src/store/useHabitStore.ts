import { create } from 'zustand';
import { db, auth } from '../services/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Habit } from '../types/habit';

interface HabitState {
  habits: Habit[];
  loading: boolean;
  fetchHabits: () => void;
  addHabit: (title: string, emoji: string) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: true,

  fetchHabits: () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid, "data", "habitList");

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ habits: docSnap.data().habits || [], loading: false });
      } else {
        set({ habits: [], loading: false });
      }
    });
  },

  addHabit: async (title, emoji) => {
    const user = auth.currentUser;
    if (!user) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      emoji,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    const updatedHabits = [...get().habits, newHabit];
    const docRef = doc(db, "users", user.uid, "data", "habitList");
    await setDoc(docRef, { habits: updatedHabits });
  },

  toggleHabit: async (id, date) => {
    const user = auth.currentUser;
    if (!user) return;

    const updatedHabits = get().habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(date);
        const newDates = isCompleted
          ? habit.completedDates.filter((d) => d !== date)
          : [...habit.completedDates, date];
        return { ...habit, completedDates: newDates };
      }
      return habit;
    });

    const docRef = doc(db, "users", user.uid, "data", "habitList");
    await setDoc(docRef, { habits: updatedHabits });
  },

  removeHabit: async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    const updatedHabits = get().habits.filter((habit) => habit.id !== id);
    const docRef = doc(db, "users", user.uid, "data", "habitList");
    await setDoc(docRef, { habits: updatedHabits });
  },
}));