import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#4F46E5',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 10 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      headerTitleStyle: { fontWeight: 'bold', color: '#1E293B' },
      headerStyle: { backgroundColor: '#F8FAFC', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }
    }}>
      
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Mis Tareas',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="checkbox-multiple-marked" size={26} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="add" 
        options={{ 
          title: 'Nueva Tarea',
          tabBarLabel: 'Crear',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-circle" size={28} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Mi Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" size={26} color={color} />
        }} 
      />
    </Tabs>
  );
}