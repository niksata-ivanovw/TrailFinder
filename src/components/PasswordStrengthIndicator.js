import React, { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { checkPasswordStrength } from '../utils/passwordStrength';
import { colors } from '@/theme';
import styles from '@/styles/PasswordStrengthIndicator.styles';

const PasswordStrengthIndicator = ({ password }) => {
  const strength = checkPasswordStrength(password);
  const animatedStrength = useRef(new Animated.Value(strength)).current;

  useEffect(() => {
    Animated.timing(animatedStrength, {
      toValue: strength,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedStrength, strength]);
  
  const getStrengthDetails = () => {
    switch (strength) {
      case 0: return { label: 'Very Weak', color: colors.error };
      case 1: return { label: 'Weak', color: colors.warning };
      case 2: return { label: 'Fair', color: colors.caution };
      case 3: return { label: 'Good', color: colors.info };
      case 4: return { label: 'Strong', color: colors.success };
      default: return { label: '', color: colors.strengthTransparent };
    }
  };

  const { label, color } = getStrengthDetails();
  const fillWidth = animatedStrength.interpolate({
    inputRange: [0, 4],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.barFill,
            { width: fillWidth, backgroundColor: color }
          ]}
        />
      </View>
      {password.length > 0 && (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
    </View>
  );
}

export default PasswordStrengthIndicator;