import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { Text, View } from 'react-native';
import styles from '@/styles/tabs-layout.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyHikesScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
            <Text style={{fontColor: colors.text}}>My Hikes View (Integration in Phase 4)</Text>
            </View>
        </SafeAreaView>
    );
}