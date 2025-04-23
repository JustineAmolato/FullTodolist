// src/components/ThemeToggle.js
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Ionicons
        name={theme === 'light' ? 'sunny' : 'moon'}
        size={24}
        color={theme === 'light' ? 'black' : 'white'}
      />
    </TouchableOpacity>
  );
}