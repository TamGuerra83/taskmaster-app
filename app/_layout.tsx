
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../context/AuthContext';
import { AppTheme } from '../theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={AppTheme}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}