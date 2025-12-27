import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Text, FAB, IconButton, Checkbox, Surface, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTodos } from '../../hooks/useTodos'; 
import { Task } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const { tasks, loading, fetchTasks, toggleTask, removeTask } = useTodos();

  const renderItem = ({ item }: { item: Task }) => (
    <Surface style={styles.card} elevation={2}>
      <View style={[styles.indicator, { backgroundColor: item.completed ? '#10B981' : '#F59E0B' }]} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Checkbox 
            status={item.completed ? 'checked' : 'unchecked'} 
            onPress={() => toggleTask(item)} 
          />
          <Text style={[styles.text, item.completed && styles.strikeText]}>
            {item.title}
          </Text>
        </View>
        
        {item.photoUri && (
             <Image source={{ uri: item.photoUri }} style={styles.tinyLogo} />
        )}
      </View>
      <IconButton icon="delete" iconColor="#EF4444" onPress={() => removeTask(item.id)} />
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Mis Tareas</Text>
        <IconButton icon="logout" onPress={signOut} />
      </View>

      {loading && tasks.length === 0 ? (
        <ActivityIndicator animating={true} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchTasks}
          ListEmptyComponent={<Text style={styles.empty}>Sin tareas pendientes</Text>}
        />
      )}

      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/create-task')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  indicator: { width: 5, height: '100%' },
  content: { flex: 1, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 16, flex: 1 },
  strikeText: { textDecorationLine: 'line-through', color: '#94A3B8' },
  tinyLogo: { width: 40, height: 40, borderRadius: 4, marginTop: 5, marginLeft: 10 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4F46E5' },
});