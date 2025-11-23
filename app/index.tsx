import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const USERS = [
  { username: 'admin', password: '123' },
  { username: 'pepe',  password: '456' },
  { username: 'maria', password: '789' }
];

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = () => {
    const valid = USERS.find(u => u.username === username && u.password === password);
    if (valid) {
      setError('');
      signIn(username);
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        
        
        <View style={styles.header}>
          <View style={styles.iconContainer}>
             <IconButton icon="check-decagram" iconColor="#4F46E5" size={50} style={{ margin: 0 }} />
          </View>
          <Text variant="displaySmall" style={styles.title}>TaskMaster</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Gestión inteligente de tareas</Text>
        </View>

   
        <Surface style={styles.card} elevation={4}>
          <TextInput
            label="Nombre de Usuario"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account-circle-outline" color="#4F46E5" />}
            outlineColor="transparent"
            activeOutlineColor="#4F46E5"
            placeholder="Ej. admin"
            placeholderTextColor="#94A3B8"
          />

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="lock-outline" color="#4F46E5" />}
            right={<TextInput.Icon icon={secureText ? "eye-off" : "eye"} onPress={() => setSecureText(!secureText)} />}
            outlineColor="transparent"
            activeOutlineColor="#4F46E5"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button} 
            contentStyle={{ height: 56 }} 
            labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
          >
            INGRESAR
          </Button>
        </Surface>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  

  header: { alignItems: 'center', marginBottom: 40 }, 
  iconContainer: { backgroundColor: '#EEF2FF', borderRadius: 50, marginBottom: 15, padding: 5 },
  
  title: { 
    fontWeight: '900', 
    color: '#1E293B', 
    letterSpacing: -1,
    textAlign: 'center' 
  },
  subtitle: { 
    color: '#64748B', 
    marginTop: 5, 
    fontSize: 16,
    textAlign: 'center'
  },

  card: { padding: 32, borderRadius: 28, backgroundColor: 'white' },
  input: { marginBottom: 16, backgroundColor: '#EEF2FF' },
  button: { marginTop: 16, borderRadius: 16, elevation: 4, shadowColor: '#4F46E5' },
  errorText: { color: '#EF4444', marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }
});