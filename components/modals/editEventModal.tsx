import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { X, Calendar, MapPin, DollarSign, Clock } from 'lucide-react-native';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types';

interface EditEventModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event;
}

export function EditEventModal({
  visible,
  onClose,
  event,
}: EditEventModalProps) {
  const { updateEvent } = useEvents();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  //area insets for styling
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        theme: event.theme,
        budget: event.budget.toString(),
        status: event.status,
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.theme.trim()) newErrors.theme = 'Theme is required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (formData.date && !dateRegex.test(formData.date)) {
      newErrors.date = 'Date must be in YYYY-MM-DD format';
    }

    // Basic time validation (HH:MM format)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (formData.time && !timeRegex.test(formData.time)) {
      newErrors.time = 'Time must be in HH:MM format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await updateEvent(event.id, {
          ...formData,
          budget: Number(formData.budget),
        });
        Alert.alert('Success', 'Event updated successfully');
        onClose();
      } catch (error) {
        Alert.alert('Error', 'Failed to update event');
      } finally {
        setIsSubmitting(false);
      }
    }
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

  //  Don’t render modal if no event
  if (!event) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
                Edit Event
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-4 py-6"
            showsVerticalScrollIndicator={false}
            style={{
              paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
              paddingTop: Platform.OS === 'ios' ? insets.top : 12,
            }}
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
                  // style={{ textAlignVertical: 'top' }}
                />
                {errors.description && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* Date and Time */}
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                    Date *
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={formData.date}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, date: text }))
                      }
                      placeholder="YYYY-MM-DD"
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
                      value={formData.time}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, time: text }))
                      }
                      placeholder="HH:MM"
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
                    value={formData.budget}
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
              <View>
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
                onPress={onClose}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300"
              >
                <Text className="text-center font-inter-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  isSubmitting ? 'bg-gray-300' : 'bg-primary-500'
                }`}
              >
                <Text
                  className={`text-center font-inter-semibold ${
                    isSubmitting ? 'text-gray-500' : 'text-white'
                  }`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
