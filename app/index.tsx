
import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) return Alert.alert("Error", "Completa los campos");
    setLoading(true);
    try {
      if (isRegistering) {
        await ApiService.register(email, password);
        Alert.alert("¡Éxito!", "Cuenta creada. Ingresa ahora.");
        setIsRegistering(false);
      } else {
        await signIn(email, password);
       
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.backgroundCircle} />
      
      <Surface style={styles.card} elevation={4}>
        <View style={styles.logoContainer}>
          <Text style={{fontSize: 40}}>🚀</Text>
        </View>
        <Text variant="headlineMedium" style={styles.title}>TaskMaster</Text>
        <Text style={styles.subtitle}>{isRegistering ? "Únete a nosotros" : "Bienvenido de nuevo"}</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          outlineStyle={{borderRadius: 12}}
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          outlineStyle={{borderRadius: 12}}
        />

        <Button 
          mode="contained" 
          onPress={handleAuth} 
          loading={loading} 
          style={styles.btnMain}
          contentStyle={{height: 50}}
        >
          {isRegistering ? "Registrarse" : "Ingresar"}
        </Button>

        <Button mode="text" onPress={() => setIsRegistering(!isRegistering)} style={styles.btnSecondary}>
          {isRegistering ? "Volver al Login" : "¿No tienes cuenta? Regístrate"}
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5', justifyContent: 'center', padding: 20 },
  backgroundCircle: {
    position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  card: { padding: 30, borderRadius: 24, backgroundColor: 'white', alignItems: 'center' },
  logoContainer: {
    width: 80, height: 80, backgroundColor: '#EEF2FF', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  title: { fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
  subtitle: { color: '#64748B', marginBottom: 20 },
  input: { width: '100%', marginBottom: 15, backgroundColor: 'white' },
  btnMain: { width: '100%', marginTop: 10, borderRadius: 12, backgroundColor: '#4F46E5' },
  btnSecondary: { marginTop: 15 },
});