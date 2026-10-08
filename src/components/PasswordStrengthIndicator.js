import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { checkPasswordStrength } from '../utils/passwordStrength';

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
      case 0: return { label: 'Very Weak', color: '#e74c3c' };
      case 1: return { label: 'Weak', color: '#e67e22' };
      case 2: return { label: 'Fair', color: '#f1c40f' };
      case 3: return { label: 'Good', color: '#3498db' };
      case 4: return { label: 'Strong', color: '#2ecc71' };
      default: return { label: '', color: 'transparent' };
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
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  barContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default PasswordStrengthIndicator;