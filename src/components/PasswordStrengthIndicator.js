import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { checkPasswordStrength } from '../utils/passwordStrength';

const PasswordStrengthIndicator = ({ password }) => {
  const strength = checkPasswordStrength(password);
  
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

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              { backgroundColor: strength >= level ? color : '#e0e0e0' }
            ]}
          />
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bar: {
    borderWidth: 0,
    height: 6,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default PasswordStrengthIndicator;