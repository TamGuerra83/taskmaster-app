import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Surface, Divider, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const isFocused = useIsFocused();

  const loadStats = async () => {
    if (user) {
      const tasks = await StorageService.getTasks(user);
      const completed = tasks.filter(t => t.isCompleted).length;
      setStats({
        total: tasks.length,
        completed: completed,
        pending: tasks.length - completed
      });
    }
  };

  useEffect(() => { if (isFocused) loadStats(); }, [isFocused]);

  const initial = user ? user.charAt(0).toUpperCase() : '?';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.header}>
        <Surface style={styles.avatarContainer} elevation={4}>
          <Avatar.Text size={100} label={initial} style={{ backgroundColor: '#4F46E5' }} />
        </Surface>
        <Text variant="headlineMedium" style={styles.username}>Hola, {user}</Text>
        <Text variant="bodyMedium" style={{ color: '#64748B' }}>Usuario Activo</Text>
      </View>

      <Surface style={styles.statsCard} elevation={2}>
        <Text variant="titleMedium" style={styles.statsTitle}>Tu Progreso 📊</Text>
        <Divider style={{ marginVertical: 10 }} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="displaySmall" style={{ color: '#4F46E5', fontWeight: 'bold' }}>{stats.total}</Text>
            <Text variant="bodySmall">Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="displaySmall" style={{ color: '#10B981', fontWeight: 'bold' }}>{stats.completed}</Text>
            <Text variant="bodySmall">Listas</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="displaySmall" style={{ color: '#F59E0B', fontWeight: 'bold' }}>{stats.pending}</Text>
            <Text variant="bodySmall">Pendientes</Text>
          </View>
        </View>
      </Surface>

      <Card style={styles.infoCard} mode="outlined">
        <Card.Title 
          title="Información de la Cuenta" 
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="account-details" 
              color="#64748B" 
              style={{ backgroundColor: 'transparent' }} 
            />
          )} 
        />
        <Card.Content>
           <Text style={{color: '#64748B'}}>Esta cuenta es local. Tus datos están guardados de forma segura en este dispositivo.</Text>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={signOut} 
        icon="logout"
        style={styles.logoutBtn}
        buttonColor="#EF4444"
        contentStyle={{ height: 50 }}
      >
        Cerrar Sesión
      </Button>
      
      <Text style={styles.version}>TaskMaster v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F8FAFC', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarContainer: { borderRadius: 50, padding: 4, backgroundColor: 'white', marginBottom: 15 },
  username: { fontWeight: 'bold', color: '#1E293B' },
  
  statsCard: { width: '100%', padding: 20, borderRadius: 20, backgroundColor: 'white', marginBottom: 20 },
  statsTitle: { fontWeight: 'bold', color: '#1E293B' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  statItem: { alignItems: 'center' },

  infoCard: { width: '100%', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', marginBottom: 30 },
  
  logoutBtn: { width: '100%', borderRadius: 12 },
  version: { marginTop: 20, color: '#CBD5E1', fontSize: 12 }
});