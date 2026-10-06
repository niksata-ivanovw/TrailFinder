import { View, Text, StyleSheet } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Saved View (Integration in Phase 4)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA', // Light outdoor background
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  }
});