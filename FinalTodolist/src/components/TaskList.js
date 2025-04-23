// src/components/TaskList.js
import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onUpdate={onUpdate} onDelete={onDelete} />
      )}
    />
  );
}