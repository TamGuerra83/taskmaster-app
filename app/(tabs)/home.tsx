import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, Chip, IconButton, FAB, Avatar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Task } from '../../types';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const router = useRouter();

  const load = async () => { if (user) setTasks(await StorageService.getTasks(user)); };
  useEffect(() => { if (isFocused) load(); }, [isFocused]);

  const toggle = async (id: string) => { await StorageService.toggleTask(id); load(); };
  
  const remove = async (id: string) => {
    Alert.alert("Eliminar Tarea", "¿Estás seguro de que quieres borrarla?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: 'destructive', onPress: async () => { await StorageService.deleteTask(id); load(); } }
    ]);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={styles.card} mode="elevated" elevation={2}>
      {/* Cabecera con Avatar e Info */}
      <Card.Title 
        title={item.title}
        titleVariant="titleMedium"
        titleStyle={[styles.cardTitle, item.isCompleted && styles.textCompleted]}
        subtitle={`📍 ${item.location.latitude.toFixed(3)}, ${item.location.longitude.toFixed(3)}`}
        left={(props) => (
          <Avatar.Icon 
            {...props} 
            icon={item.isCompleted ? "check-all" : "clock-outline"} 
            style={{ backgroundColor: item.isCompleted ? '#10B981' : '#F59E0B' }} 
            color="white"
          />
        )}
        right={(props) => <IconButton {...props} icon="delete-outline" iconColor="#94A3B8" onPress={() => remove(item.id)} />}
      />
      
   
      <Card.Cover source={{ uri: item.imageUri }} style={styles.image} />

 
      <Card.Actions style={{ padding: 16 }}>
        <Chip 
          mode="flat" 
          style={{ backgroundColor: item.isCompleted ? '#ECFDF5' : '#FFFBEB', flex: 1 }}
          textStyle={{ color: item.isCompleted ? '#059669' : '#D97706', fontWeight: 'bold' }}
        >
          {item.isCompleted ? "¡Completada!" : "Pendiente"}
        </Chip>
        
        <IconButton 
          mode="contained" 
          containerColor={item.isCompleted ? "#E2E8F0" : "#4F46E5"}
          iconColor={item.isCompleted ? "#64748B" : "white"}
          icon={item.isCompleted ? "undo" : "check"}
          onPress={() => toggle(item.id)}
          size={24}
        />
      </Card.Actions>
    </Card>
  );

  return (
  
    <View style={[styles.container, { width: '100%', maxWidth: 800, alignSelf: 'center' }]}>
      <FlatList
        data={tasks} 
        keyExtractor={t => t.id} 
        renderItem={renderTask}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Mis Tareas 📝</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="titleMedium" style={{color: '#94A3B8'}}>Todo limpio por aquí.</Text>
            <Text variant="bodySmall" style={{color: '#CBD5E1'}}>¡Agrega una tarea nueva!</Text>
          </View>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/(tabs)/add')} label="Nueva" color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  card: { marginBottom: 20, backgroundColor: 'white', borderRadius: 20, overflow: 'hidden' },
  cardTitle: { fontWeight: 'bold', color: '#1E293B' },
  textCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },
  image: { height: 160, marginHorizontal: 16, borderRadius: 12 },
  empty: { alignItems: 'center', marginTop: 100 },
  fab: { position: 'absolute', margin: 20, right: 0, bottom: 0, backgroundColor: '#4F46E5', borderRadius: 50 },
});