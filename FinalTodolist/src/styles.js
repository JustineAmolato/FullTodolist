import { StyleSheet } from 'react-native';

const sharedStyles = {
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 1,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addTaskInput: {
    flex: 1,
    borderWidth: 0,
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: '#ccc',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  taskInput: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
  },
};

export const lightTheme = StyleSheet.create({
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    backgroundColor: '#F5F7FA',
  },
  title: {
    ...sharedStyles.title,
    color: '#1E1E1E',
  },
  addTaskInput: {
    ...sharedStyles.addTaskInput,
    backgroundColor: '#fff',
    color: '#000',
  },
  filterText: {
    ...sharedStyles.filterText,
    color: '#fff',
  },
  taskItem: {
    ...sharedStyles.taskItem,
    backgroundColor: '#fff',
  },
  taskTitle: {
    ...sharedStyles.taskTitle,
    color: '#333',
  },
  taskInput: {
    ...sharedStyles.taskInput,
    backgroundColor: '#fff',
    color: '#000',
  },
});

export const darkTheme = StyleSheet.create({
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    backgroundColor: '#1C1C1E',
  },
  title: {
    ...sharedStyles.title,
    color: '#fff',
  },
  addTaskInput: {
    ...sharedStyles.addTaskInput,
    backgroundColor: '#2C2C2E',
    color: '#fff',
  },
  filterText: {
    ...sharedStyles.filterText,
    color: '#fff',
  },
  taskItem: {
    ...sharedStyles.taskItem,
    backgroundColor: '#2C2C2E',
  },
  taskTitle: {
    ...sharedStyles.taskTitle,
    color: '#fff',
  },
  taskInput: {
    ...sharedStyles.taskInput,
    backgroundColor: '#2C2C2E',
    color: '#fff',
  },
});
