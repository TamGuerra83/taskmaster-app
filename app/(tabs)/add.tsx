import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet, ScrollView, Platform } from 'react-native'; 
import { Text, TextInput, Button, Surface, Divider, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Task } from '../../types';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({ 
        quality: 0.2,
        base64: true, 
      });

      if (!result.canceled) {
       
        if (Platform.OS === 'web' && result.assets[0].base64) {
          setImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
        } else {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
    }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
       
        setLocation({ latitude: -33.4569, longitude: -70.6483 });
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (e) {
      
      setLocation({ latitude: -33.4569, longitude: -70.6483 });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !imageUri || !location) return Alert.alert("Faltan datos", "Completa todo.");
    
    setLoading(true);
    try {
      
      const permanentUri = await StorageService.saveImage(imageUri);
      
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        imageUri: permanentUri,
        location,
        isCompleted: false,
        userId: user!
      };
      
      await StorageService.addTask(newTask);
      Alert.alert("¡Éxito!", "Tarea guardada.");
      
      setTitle(''); setImageUri(null); setLocation(null);
      router.push('/(tabs)/home');
      
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.formCard} elevation={2}>
        <TextInput
          label="Título de la tarea"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          outlineColor="transparent"
          activeOutlineColor="#4F46E5"
        />

        <View style={styles.stepContainer}>
          <Text style={styles.label}>1. Evidencia Fotográfica</Text>
          {imageUri ? (
            <View>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Button mode="text" onPress={() => setImageUri(null)} textColor="#EF4444">Eliminar foto</Button>
            </View>
          ) : (
            <Button mode="outlined" onPress={takePhoto} icon="camera" style={styles.dashedBtn} textColor="#4F46E5">
              Tocar para tomar foto
            </Button>
          )}
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.label}>2. Ubicación Actual</Text>
          {location ? (
             <Surface style={styles.gpsBadge} elevation={0}>
                <IconButton icon="map-marker-check" iconColor="#10B981" size={20} />
                <Text style={{color: '#065F46', fontWeight: 'bold'}}>Ubicación guardada</Text>
             </Surface>
          ) : (
            <Button mode="outlined" onPress={getLocation} loading={loading} icon="crosshairs-gps" style={styles.dashedBtn} textColor="#4F46E5">
              {loading ? "Obteniendo..." : "Obtener GPS"}
            </Button>
          )}
        </View>

        <Divider style={{ marginVertical: 24 }} />

        <Button mode="contained" onPress={handleSave} style={styles.saveBtn} contentStyle={{ height: 56 }} labelStyle={{ fontSize: 18 }} icon="content-save-outline">
          Guardar Tarea
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 25, backgroundColor: '#F8FAFC', flexGrow: 1 },
  formCard: { padding: 24, borderRadius: 24, backgroundColor: 'white' },
  input: { marginBottom: 24, backgroundColor: '#EEF2FF' },
  stepContainer: { marginBottom: 20 },
  label: { marginBottom: 8, color: '#64748B', fontWeight: 'bold', fontSize: 14 },
  preview: { width: '100%', height: 200, borderRadius: 16, marginBottom: 5 },
  dashedBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#C7D2FE', borderRadius: 12, paddingVertical: 15 },
  gpsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', borderRadius: 12, paddingRight: 16 },
  saveBtn: { borderRadius: 16, backgroundColor: '#4F46E5' }
});