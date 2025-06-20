import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Plus, Search, Filter } from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/cards/TaskCard';
import { FloatingActionButton } from '@/components/buttons/FloatingActionButton';
import { AddTaskModal } from '@/components/modals/addTaskModal';
import { SearchModal } from '@/components/modals/searchModal';
import {
  LoadingSpinner,
  InlineLoadingSpinner,
} from '@/components/loaders/loadingSpinner';
import { Task } from '@/types';
import { SearchModalContext } from '@/contexts/searchModalContext';

export default function TasksScreen() {
  const { tasks, loading, createTask, updateTask, refetch } = useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { OnClose, searchModalVisible, setSearchModalVisible } =
    useContext(SearchModalContext);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await createTask(taskData);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTaskStatusChange = async (
    taskId: string,
    status: Task['status']
  ) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleTaskPress = (task: Task) => {
    console.log('Task pressed:', task.title);
  };

  const handleSearchItemPress = (item: Task) => {
    OnClose();
    handleTaskPress(item);
  };
  return (
    <View
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        paddingTop: Platform.OS === 'ios' ? insets.top : 12,
      }}
      className="flex-1 bg-gray-50"
    >
      <View className="bg-gray-50 flex-1">
        {/* Task Stats */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-gray-900">
                {tasks.filter((t) => t.status === 'todo').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">To Do</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-warning-600">
                {tasks.filter((t) => t.status === 'in-progress').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">
                In Progress
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-success-600">
                {tasks.filter((t) => t.status === 'completed').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Tasks List */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading && tasks.length === 0 ? (
            <InlineLoadingSpinner message="Loading tasks..." />
          ) : tasks.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 font-inter text-center">
                No tasks created yet
              </Text>
              <Text className="text-gray-400 font-inter text-sm text-center mt-2">
                Tap the + button to create your first task
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task)}
                onStatusChange={handleTaskStatusChange}
              />
            ))
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton onPress={() => setAddModalVisible(true)} />

        {/* Modals */}
        <AddTaskModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSubmit={handleCreateTask}
        />

        <SearchModal
          visible={searchModalVisible}
          onClose={OnClose}
          type="tasks"
          data={tasks}
          onItemPress={handleSearchItemPress}
        />
      </View>
    </View>
  );
}
