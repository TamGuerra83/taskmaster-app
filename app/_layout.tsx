import { StatusBar, Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    secondary: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2FF',
    error: '#EF4444',
    outline: '#E0E7FF',
  },
  roundness: 16,
};

export default function RootLayout() {
  return (

    <SafeAreaProvider style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
          
         
          <View style={[
            { flex: 1, backgroundColor: '#F8FAFC' },
            Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}
          ] as any}>
            
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
            </Stack>

          </View>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}