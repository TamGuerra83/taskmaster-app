import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Task } from '../types';

const TASKS_KEY = 'TASKS_DATA_FINAL_WEB_FIX';

export const StorageService = {
  
  saveImage: async (tempUri: string): Promise<string> => {
   
    if (Platform.OS === 'web' || tempUri.startsWith('data:')) {
      return tempUri; 
    }

  
    try {
      const fileName = tempUri.split('/').pop();
      // @ts-ignore
      const baseDir = FileSystem.documentDirectory;
      
      
      if (!baseDir) return tempUri;

      const newPath = baseDir + (fileName ?? 'temp_img.jpg');

      await FileSystem.moveAsync({
        from: tempUri,
        to: newPath,
      });

      return newPath;
    } catch (error) {
      console.error('Error guardando imagen en móvil:', error);
      return tempUri;
    }
  },

  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      if (!jsonValue) return [];
      const allTasks: Task[] = JSON.parse(jsonValue);
      return allTasks.filter(task => task.userId === userId);
    } catch (error) {
      console.error("Error leyendo tareas", error);
      return [];
    }
  },

  addTask: async (task: Task): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      const allTasks: Task[] = jsonValue ? JSON.parse(jsonValue) : [];
      allTasks.push(task);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
    } catch (error) {
      console.error("Error guardando tarea", error);
    }
  },

  toggleTask: async (taskId: string): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      if (!jsonValue) return;
      let allTasks: Task[] = JSON.parse(jsonValue);
      allTasks = allTasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
    } catch (error) { console.error(error); }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      if (!jsonValue) return;

      let allTasks: Task[] = JSON.parse(jsonValue);
      const taskToDelete = allTasks.find(t => t.id === taskId);
      
    
      if (Platform.OS !== 'web' && taskToDelete?.imageUri && !taskToDelete.imageUri.startsWith('data:')) {
        try {
            await FileSystem.deleteAsync(taskToDelete.imageUri, { idempotent: true });
        } catch (e) { /* Ignorar si no existe */ }
      }

      allTasks = allTasks.filter(t => t.id !== taskId);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
    } catch (error) { console.error(error); }
  }
};