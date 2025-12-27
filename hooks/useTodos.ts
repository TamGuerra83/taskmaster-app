
import { useState, useCallback } from 'react';
import { ApiService } from '../services/api'; 
import { Task } from '../types';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router'; 

export const useTodos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getAllTodos();
     
      const sorted = data.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
      setTasks(sorted);
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  
  const toggleTask = async (task: Task) => {
   
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));

    try {
      await ApiService.toggleTodo(task.id, task.completed);
    } catch (err) {
      setTasks(originalTasks); 
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };


  const removeTask = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar" },
      { 
        text: "Eliminar", 
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiService.deleteTodo(id);
            setTasks(prev => prev.filter(t => t.id !== id));
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        }
      }
    ]);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks, 
    toggleTask,
    removeTask
  };
};