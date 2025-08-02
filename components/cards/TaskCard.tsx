import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Calendar,
  User,
  CircleAlert as AlertCircle,
  MoreVertical,
  Check,
  Clock,
  X,
  Trash2,
} from 'lucide-react-native';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({
  task,
  onPress,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [showStatusOptions, setShowStatusOptions] = React.useState(false);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800';
      case 'completed':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleStatusChange = (newStatus: Task['status']) => {
    onStatusChange(task.id, newStatus);
    setShowStatusOptions(false);
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: Clock, color: 'text-gray-600' },
    {
      value: 'in-progress',
      label: 'In Progress',
      icon: Clock,
      color: 'text-warning-600',
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: Check,
      color: 'text-success-600',
    },
  ];

  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <TouchableOpacity onPress={onPress} className="flex-1 mr-2">
          <Text className="text-base font-inter-semibold text-gray-900">
            {task.title}
          </Text>
        </TouchableOpacity>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={() => setShowStatusOptions(!showStatusOptions)}
            className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
          >
            <Text className="text-xs font-inter-medium">
              {task.status.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(task.id)}>
              <Trash2 size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status Change Options */}
      {showStatusOptions && (
        <View className="mb-3 p-2 bg-gray-50 rounded-lg">
          <Text className="text-sm font-inter-medium text-gray-700 mb-2">
            Change Status:
          </Text>
          <View className="flex-row space-x-2">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() =>
                    handleStatusChange(option.value as Task['status'])
                  }
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    task.status === option.value
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <IconComponent
                      size={14}
                      color={task.status === option.value ? 'white' : '#6b7280'}
                    />
                    <Text
                      className={`ml-1 text-xs font-inter-medium ${
                        task.status === option.value
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

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

        <View
          className={`px-2 py-1 rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          <Text className="text-xs font-inter-medium">{task.priority}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Calendar size={14} color="#6b7280" />
          <Text
            className={`font-inter text-sm ml-1 ${
              isOverdue() ? 'text-red-600' : 'text-gray-600'
            }`}
          >
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
    </View>
  );
}
