import React from 'react';
import { View, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, Surface, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskForm } from '../hooks/useTaskForm'; 

export default function CreateTaskScreen() {
  const router = useRouter();
  const { 
    title, setTitle, 
    imageUri, setImageUri, 
    location, getLocation, 
    loading, 
    pickImage, 
    takePhoto, 
    submitTask 
  } = useTaskForm();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineMedium" style={styles.header}>Nueva Tarea</Text>
        
        <Surface style={styles.card}>
          <TextInput
            label="Título de la tarea"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

       
          <Text variant="titleMedium" style={styles.sectionTitle}>Evidencia Fotográfica</Text>
          <View style={styles.imgArea}>
            {imageUri ? (
              <View style={{ width: '100%'}}>
                <Image source={{ uri: imageUri }} style={styles.preview} />
                <IconButton 
                  icon="close-circle" 
                  iconColor="red" 
                  size={30}
                  style={styles.closeBtn}
                  onPress={() => setImageUri(null)}
                />
              </View>
            ) : (
              <View style={styles.buttonRow}>
                <Button mode="outlined" icon="camera" onPress={takePhoto} style={styles.mediaBtn}>
                  Cámara
                </Button>
                <Button mode="outlined" icon="image" onPress={pickImage} style={styles.mediaBtn}>
                  Galería
                </Button>
              </View>
            )}
          </View>


          <Text variant="titleMedium" style={styles.sectionTitle}>Ubicación</Text>
          <View style={styles.gpsArea}>
            {location ? (
              <Chip icon="map-marker" onClose={() => {}} style={styles.chip}>
                Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
              </Chip>
            ) : (
              <Button 
                mode="outlined" 
                icon="crosshairs-gps" 
                onPress={getLocation}
                loading={loading && !location}
              >
                Obtener mi ubicación actual
              </Button>
            )}
          </View>

          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={submitTask} 
              loading={loading} 
              disabled={loading}
              style={styles.saveBtn}
            >
              Guardar Tarea
            </Button>
            
            <Button mode="text" onPress={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { padding: 20 },
  header: { textAlign: 'center', marginBottom: 20, marginTop: 40, fontWeight: 'bold', color: '#1E293B' },
  card: { padding: 20, borderRadius: 16, backgroundColor: 'white', elevation: 4 },
  input: { marginBottom: 20, backgroundColor: 'white' },
  sectionTitle: { marginBottom: 10, fontWeight: 'bold', color: '#64748B' },
  
  imgArea: { marginBottom: 20, alignItems: 'center' },
  preview: { width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover' },
  closeBtn: { position: 'absolute', top: -10, right: -10, backgroundColor: 'white' },
  
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 10 },
  mediaBtn: { flex: 1 },
  
  gpsArea: { marginBottom: 30 },
  chip: { backgroundColor: '#E0F2FE' },
  
  actions: { marginTop: 10 },
  saveBtn: { marginBottom: 10, backgroundColor: '#4F46E5', paddingVertical: 6 },
});