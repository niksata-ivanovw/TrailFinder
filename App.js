import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import TabLayout from './app/tabs/_layout';

export default function App() {
  return (
    <View style={styles.container}>
      <TabLayout />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
