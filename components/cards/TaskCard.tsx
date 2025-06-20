import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, User, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export function TaskCard({ task, onPress, onStatusChange }: TaskCardProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-warning-100 text-warning-800';
      case 'completed': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-inter-semibold text-gray-900 flex-1 mr-2">
          {task.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
          <Text className="text-xs font-inter-medium">
            {task.status.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <Text className="text-gray-600 font-inter text-sm mb-3" numberOfLines={2}>
        {task.description}
      </Text>

      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <User size={14} color="#6b7280" />
          <Text className="text-gray-600 font-inter text-sm ml-1">
            {task.assignedTo}
          </Text>
        </View>

        <View className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          <Text className="text-xs font-inter-medium">
            {task.priority}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Calendar size={14} color="#6b7280" />
          <Text className={`font-inter text-sm ml-1 ${
            isOverdue() ? 'text-red-600' : 'text-gray-600'
          }`}>
            Due {formatDate(task.dueDate)}
          </Text>
          {isOverdue() && (
            <AlertCircle size={14} color="#dc2626" className="ml-1" />
          )}
        </View>

        <Text className="text-gray-500 font-inter text-xs">
          {task.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
}