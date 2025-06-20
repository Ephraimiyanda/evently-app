import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, MapPin, DollarSign, Clock } from 'lucide-react-native';
import { Event } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormatAmount } from '@/hooks/useFormatAmount';
interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddEventModal({
  visible,
  onClose,
  onSubmit,
}: AddEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'physical' as Event['type'],
    theme: '',
    budget: '',
    status: 'planning' as Event['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const bugdetAmount = useFormatAmount(formData.budget);
  const unformatbugdetAmount = Number(bugdetAmount.split(',').join(''));

  //format time to give onky hours and minutes
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Set to true for AM/PM format
    });
  };

  //update form on change of date or time
  const onDateAndTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    if (mode === 'date') {
      const date = currentDate.toDateString();
      setFormData((prev) => ({ ...prev, date: date }));
    } else {
      const time = formatTime(currentDate);
      setFormData((prev) => ({ ...prev, time: time }));
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  //check if form has correct parameters
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.theme.trim()) newErrors.theme = 'Theme is required';
    if (!unformatbugdetAmount.toLocaleString().trim())
      newErrors.budget = 'Budget is required';
    else if (
      isNaN(Number(unformatbugdetAmount)) ||
      Number(unformatbugdetAmount) <= 0
    ) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        budget: unformatbugdetAmount,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'physical',
      theme: '',
      budget: '',
      status: 'planning',
    });
    setErrors({});
    onClose();
  };

  const eventTypes = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const eventStatuses = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
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
                Create New Event
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
              {/* Event Name */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Event Name *
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Enter event name"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-inter text-gray-900"
                />
                {errors.name && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.name}
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
                  placeholder="Enter event description"
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

              {/* Date and Time */}
              <View className="flex-row space-x-4">
                <View className="flex-2">
                  <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                    Date *
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={formData.date}
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

                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                    Time *
                  </Text>
                  <View className="relative">
                    <TextInput
                      onPressIn={showTimepicker}
                      value={formData.time}
                      placeholder={formatTime(new Date())}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                    />
                    <Clock
                      size={20}
                      color="#6b7280"
                      className="absolute right-3 top-3"
                    />
                  </View>
                  {errors.time && (
                    <Text className="text-error-600 font-inter text-sm mt-1">
                      {errors.time}
                    </Text>
                  )}
                </View>
              </View>

              {show && (
                <DateTimePicker
                  value={new Date()}
                  mode={mode}
                  is24Hour={false}
                  onChange={onDateAndTimeChange}
                />
              )}
              {/* Location */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Location *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.location}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, location: text }))
                    }
                    placeholder="Enter event location"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <MapPin
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.location && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.location}
                  </Text>
                )}
              </View>

              {/* Event Type */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Event Type
                </Text>
                <View className="flex-row space-x-2">
                  {eventTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          type: type.value as Event['type'],
                        }))
                      }
                      className={`flex-1 py-3 px-4 rounded-lg border ${
                        formData.type === type.value
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-inter-medium ${
                          formData.type === type.value
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Theme */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Theme *
                </Text>
                <TextInput
                  value={formData.theme}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, theme: text }))
                  }
                  placeholder="Enter event theme"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-inter text-gray-900"
                />
                {errors.theme && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.theme}
                  </Text>
                )}
              </View>

              {/* Budget */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Budget *
                </Text>
                <View className="relative">
                  <TextInput
                    inputMode="numeric"
                    value={bugdetAmount}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, budget: text }))
                    }
                    placeholder="Enter budget amount"
                    keyboardType="numeric"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <DollarSign
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.budget && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.budget}
                  </Text>
                )}
              </View>

              {/* Status */}
              <View className="mb-10">
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {eventStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: status.value as Event['status'],
                        }))
                      }
                      className={`py-2 px-4 rounded-lg border ${
                        formData.status === status.value
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium ${
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
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
