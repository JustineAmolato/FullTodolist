// src/components/FilterButtons.js
import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../styles';

export default function FilterButtons({ filter, setFilter }) {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
      >
        <Text style={styles.filterText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
        onPress={() => setFilter('completed')}
      >
        <Text style={styles.filterText}>Completed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
        onPress={() => setFilter('pending')}
      >
        <Text style={styles.filterText}>Pending</Text>
      </TouchableOpacity>
    </View>
  );
}