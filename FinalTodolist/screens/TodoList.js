"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// API URL - can be overridden with environment variables
const API_URL = "https://fastapitbackend.onrender.com/"

const TodoList = () => {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [filter, setFilter] = useState("all")
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user preferences and tasks on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedFilter = await AsyncStorage.getItem("filter")
        const storedTheme = await AsyncStorage.getItem("theme")

        if (storedFilter) setFilter(storedFilter)
        if (storedTheme) setDarkMode(storedTheme === "dark")

        fetchTasks()
      } catch (error) {
        console.error("Error loading preferences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  // Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem("filter", filter)
        await AsyncStorage.setItem("theme", darkMode ? "dark" : "light")
      } catch (error) {
        console.error("Error saving preferences:", error)
      }
    }

    savePreferences()
  }, [filter, darkMode])

  const fetchTasks = () => {
    setIsLoading(true)
    axios
      .get(API_URL)
      .then((response) => {
        console.log("Fetched tasks:", response.data)
        setTasks(response.data)
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        Alert.alert("Error", "There was an issue fetching the tasks.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const addTask = () => {
    if (task.trim() === "") return

    axios
      .post(API_URL, { title: task, completed: false })
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response.data])
        setTask("") // Clear input after adding task
      })
      .catch((error) => {
        console.error("Add task error:", error)
        Alert.alert("Error", "There was an issue adding the task.")
      })
  }

  const toggleTaskCompletion = (todo) => {
    axios
      .put(`${API_URL}${todo.id}/`, { ...todo, completed: !todo.completed })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === response.data.id ? response.data : t)))
      })
      .catch((error) => {
        console.error("Toggle error:", error)
        Alert.alert("Error", "There was an issue updating the task.")
      })
  }

  const startEditing = (id, title) => {
    setEditingId(id)
    setEditingText(title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText("")
  }

  const saveEditing = (todo) => {
    if (editingText.trim() === "") return

    axios
      .put(`${API_URL}${todo.id}/`, { ...todo, title: editingText })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === response.data.id ? response.data : t)))
        cancelEditing()
      })
      .catch((error) => {
        console.error("Save edit error:", error)
        Alert.alert("Error", "There was an issue saving the task.")
      })
  }

  const deleteTask = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          axios
            .delete(`${API_URL}${id}/`)
            .then(() => setTasks(tasks.filter((t) => t.id !== id)))
            .catch((error) => {
              console.error("Delete error:", error)
              Alert.alert("Error", "There was an issue deleting the task.")
            })
        },
      },
    ])
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed
    if (filter === "pending") return !t.completed
    return true
  })

  // Get dynamic styles based on dark mode
  const dynamicStyles = getDynamicStyles(darkMode)

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.background]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.container}>
          <Text style={[styles.heading, dynamicStyles.text]}>To-Do List</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Add a new task..."
              placeholderTextColor={darkMode ? "#777" : "#999"}
              value={task}
              onChangeText={setTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <View style={styles.darkModeContainer}>
              <Ionicons name={darkMode ? "moon" : "sunny"} size={20} color={darkMode ? "#fff" : "#000"} />
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
                thumbColor={darkMode ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            {["all", "completed", "pending"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filter === type && styles.activeFilterButton,
                  darkMode && filter === type && styles.activeFilterButtonDark,
                ]}
                onPress={() => setFilter(type)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === type && styles.activeFilterText,
                    darkMode && styles.darkModeText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.taskCard, dynamicStyles.taskCard, item.completed && styles.completedTaskCard]}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleTaskCompletion(item)}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxChecked, dynamicStyles.checkbox]}>
                    {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>

                  {editingId === item.id ? (
                    <TextInput
                      style={[styles.editInput, dynamicStyles.input]}
                      value={editingText}
                      onChangeText={setEditingText}
                      autoFocus
                    />
                  ) : (
                    <Text style={[styles.taskText, dynamicStyles.text, item.completed && styles.completedTaskText]}>
                      {item.title}
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.taskActions}>
                  {editingId === item.id ? (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={() => saveEditing(item)}
                      >
                        <Text style={styles.actionButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={cancelEditing}>
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => startEditing(item.id, item.title)}
                      >
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.removeButton]}
                        onPress={() => deleteTask(item.id)}
                      >
                        <Text style={styles.actionButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, dynamicStyles.text]}>
                  {isLoading ? "Loading tasks..." : "No tasks found"}
                </Text>
              </View>
            }
          />

          <Text style={[styles.footer, dynamicStyles.footerText]}>Task Manager App © 2023</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// Dynamic styles based on dark mode
const getDynamicStyles = (darkMode) => {
  return StyleSheet.create({
    background: {
      backgroundColor: darkMode ? "#121212" : "#f8f9fa",
    },
    text: {
      color: darkMode ? "#ffffff" : "#000000",
    },
    footerText: {
      color: darkMode ? "#777" : "#888",
    },
    input: {
      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      borderColor: darkMode ? "#444" : "#ced4da",
    },
    taskCard: {
      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
      borderColor: darkMode ? "#333" : "#dee2e6",
    },
    checkbox: {
      borderColor: darkMode ? "#555" : "#ced4da",
    },
  })
}

// Base styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop:50
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    minWidth: 150,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  darkModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginTop: Platform.OS === "ios" ? 0 : 8,
  },
  switch: {
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#6c757d",
    marginHorizontal: 4,
    borderRadius: 4,
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: "#007bff",
  },
  activeFilterButtonDark: {
    backgroundColor: "#0056b3",
  },
  filterButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  activeFilterText: {
    fontWeight: "bold",
  },
  darkModeText: {
    color: "#ffffff",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  editInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  taskActions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 6,
  },
  editButton: {
    backgroundColor: "#ffc107",
  },
  removeButton: {
    backgroundColor: "#dc3545",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
  },
})

export default TodoList