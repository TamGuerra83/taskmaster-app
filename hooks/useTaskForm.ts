import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { ApiService } from '../services/api';
import { LocationCoords } from '../types';

export const useTaskForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);

  
  const processImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permiso", "Se requiere acceso a la galería");
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    processImageResult(result);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permiso", "Se requiere acceso a la cámara");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    processImageResult(result);
  };


const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert("Permiso denegado", "Se necesita permiso para guardar la ubicación.");
    return;
  }
  
  setLoading(true);
  try {

    const locationResult = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, 
      timeout: 5000; 
    });

    setLocation({
      latitude: locationResult.coords.latitude,
      longitude: locationResult.coords.longitude,
    });
    
  } catch (error) {
    console.log("⚠️ GPS lento o no disponible, intentando última posición...");

   
    try {
      const lastKnown = await Location.getLastKnownPositionAsync();
      
      if (lastKnown) {
        setLocation({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        Alert.alert("Aviso", "Usando tu última ubicación conocida (señal GPS débil).");
      } else {
      
        throw new Error("No pudimos detectar tu ubicación. Activa el GPS.");
      }
    } catch (fallbackError) {
      console.error("Error GPS Fatal:", fallbackError);
      Alert.alert("Error GPS", "Por favor verifica que la ubicación esté activa en tu celular/emulador.");
    }
  } finally {
    setLoading(false);
  }
};


  const submitTask = async () => {
    if (!title.trim()) return Alert.alert("Validación", "El título es obligatorio");

    setLoading(true);
    try {
      let uploadedPhotoData = undefined;
      
      if (imageUri) {
        uploadedPhotoData = await ApiService.uploadImage(imageUri);
      }

      await ApiService.createTodo(
        title, 
        uploadedPhotoData, 
        location || undefined
      );
      
      Alert.alert("¡Éxito!", "Tarea creada correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return {
    title, setTitle,
    imageUri, setImageUri,
    location, getLocation,
    loading,
    pickImage,
    takePhoto,
    submitTask
  };
};