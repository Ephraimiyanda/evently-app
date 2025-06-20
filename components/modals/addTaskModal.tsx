import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, User, AlertCircle } from 'lucide-react-native';
import { Task } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEvents } from '@/hooks/useEvents';
import { Picker } from '@react-native-picker/picker';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddTaskModal({
  visible,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    category: '',
    eventId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const { events } = useEvents();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.assignedTo.trim())
      newErrors.assignedTo = 'Assigned person is required';
    if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'todo',
      priority: 'medium',
      category: '',
      eventId: '',
    });
    setErrors({});
    onClose();
  };

  //update form on change of date
  const onDateAndTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    if (mode === 'date') {
      const date = currentDate.toDateString();
      setFormData((prev) => ({ ...prev, dueDate: date }));
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };

  const taskStatuses = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const taskPriorities = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
  ];

  const taskCategories = [
    'Venue',
    'Catering',
    'Marketing',
    'Technology',
    'Logistics',
    'Entertainment',
    'Security',
    'Other',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="bg-white px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-inter-bold text-gray-900">
                Create New Task
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            <View className="space-y-6">
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Select Event *
                </Text>
                <View className="space-y-2">
                  <View className="bg-white border border-gray-200 rounded-lg h-[48px]">
                    <Picker
                      // @ts-ignore
                      selectedValue={formData.eventId}
                      onValueChange={(itemValue, itemIndex) => {
                        setFormData((prev) => ({
                          ...prev,
                          eventId: itemValue,
                        }));
                      }}
                      mode="dropdown"
                      itemStyle={{
                        color: '#111827',
                      }}
                    >
                      {events.map((event) => (
                        <Picker.Item
                          key={event.id}
                          value={event.id}
                          label={event.name}
                          style={{
                            color: '#111827',
                          }}
                        ></Picker.Item>
                      ))}
                    </Picker>
                  </View>
                </View>
                {errors.eventId && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.eventId}
                  </Text>
                )}
              </View>

              {/* Task Title */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Task Title *
                </Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, title: text }))
                  }
                  placeholder="Enter task title"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-inter text-gray-900"
                />
                {errors.title && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Description *
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, description: text }))
                  }
                  placeholder="Enter task description"
                  multiline
                  numberOfLines={3}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-inter text-gray-900"
                  style={{ textAlignVertical: 'top' }}
                />
                {errors.description && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* Assigned To */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Assigned To *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.assignedTo}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, assignedTo: text }))
                    }
                    placeholder="Enter person's name"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <User
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.assignedTo && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.assignedTo}
                  </Text>
                )}
              </View>

              {/* Due Date */}

              <View className="flex-2">
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Due Date *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.dueDate}
                    onPressIn={showDatepicker}
                    placeholder={new Date().toDateString()}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <Calendar
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.date && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.date}
                  </Text>
                )}
              </View>
              {show && (
                <DateTimePicker
                  value={new Date()}
                  mode={mode}
                  is24Hour={false}
                  onChange={onDateAndTimeChange}
                />
              )}

              {/* Category */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Category *
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {taskCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, category }))
                      }
                      className={`py-2 px-3 rounded-lg border ${
                        formData.category === category
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium text-sm ${
                          formData.category === category
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.category && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.category}
                  </Text>
                )}
              </View>

              {/* Priority */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Priority
                </Text>
                <View className="flex-row flex-wrap space-x-2">
                  {taskPriorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: priority.value as Task['priority'],
                        }))
                      }
                      className={` py-3 px-4 rounded-lg border ${
                        formData.priority === priority.value
                          ? `${priority.color} border-transparent`
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-inter-medium ${
                          formData.priority === priority.value
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status */}
              <View className="mb-10">
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Status
                </Text>
                <View className="flex-row space-x-2">
                  {taskStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: status.value as Task['status'],
                        }))
                      }
                      className={` py-3 px-4 rounded-lg border ${
                        formData.status === status.value
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-inter-medium ${
                          formData.status === status.value
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="bg-white px-4 py-4 border-t border-gray-100">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300"
              >
                <Text className="text-center font-inter-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 py-3 px-4 rounded-lg bg-primary-500"
              >
                <Text className="text-center font-inter-semibold text-white">
                  Create Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
