
export interface LocationData {
    latitude: number;
    longitude: number;
  }
  
  export interface Task {
    id: string;
    title: string;
    imageUri: string; // Ruta local del sistema de archivos
    location: LocationData;
    isCompleted: boolean;
    userId: string; // Para asociar la tarea al usuario
  }
  
 
  export interface User {
    username: string;
    isAuthenticated: boolean;
  }