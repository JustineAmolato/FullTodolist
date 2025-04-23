// src/components/TaskItem.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../styles';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightTheme : darkTheme;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleToggleComplete = () => onUpdate(task.id, { completed: !task.completed });
  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id, { title });
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={handleToggleComplete}>
        <Ionicons
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
        />
      </TouchableOpacity>
      {isEditing ? (
        <TextInput
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSave}
          onBlur={handleSave}
          autoFocus
          style={styles.taskInput}
        />
      ) : (
        <Text onPress={() => setIsEditing(true)} style={styles.taskTitle}>
          {task.title}
        </Text>
      )}
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}