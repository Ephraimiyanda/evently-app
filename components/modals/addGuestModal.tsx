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
import { X, Mail, Phone, User, FileText } from 'lucide-react-native';
import { Guest } from '@/types';
import { useEvents } from '@/hooks/useEvents';
import { Picker } from '@react-native-picker/picker';

interface AddGuestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (guestData: Omit<Guest, 'id' | 'invitedAt'>) => void;
  _id?: string;
}

export function AddGuestModal({
  visible,
  onClose,
  onSubmit,
  _id,
}: AddGuestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general' as Guest['category'],
    rsvpStatus: 'pending' as Guest['rsvpStatus'],
    notes: '',
    eventId: _id ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { events } = useEvents();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        phone: formData.phone || undefined,
        notes: formData.notes || undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'general',
      rsvpStatus: 'pending',
      notes: '',
      eventId: '',
    });
    setErrors({});
    onClose();
  };

  const guestCategories = [
    { value: 'general', label: 'General', color: 'bg-gray-500' },
    { value: 'vip', label: 'VIP', color: 'bg-purple-500' },
    { value: 'speaker', label: 'Speaker', color: 'bg-blue-500' },
    { value: 'volunteer', label: 'Volunteer', color: 'bg-green-500' },
    { value: 'staff', label: 'Staff', color: 'bg-orange-500' },
  ];

  const rsvpStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'maybe', label: 'Maybe' },
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
                Add New Guest
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
              {!_id && (
                <View>
                  <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                    Select Event *
                  </Text>

                  <View className="bg-white border border-gray-200 rounded-lg h-[48px]">
                    <Picker
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
              )}
              {errors.eventId && (
                <Text className="text-error-600 font-inter text-sm mt-1">
                  {errors.eventId}
                </Text>
              )}

              {/* Guest Name */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Full Name *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter guest's full name"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <User
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.name && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Email */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Email Address *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, email: text }))
                    }
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <Mail
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.email && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Phone */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Phone Number
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, phone: text }))
                    }
                    placeholder="Enter phone number (optional)"
                    keyboardType="phone-pad"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <Phone
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.phone && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.phone}
                  </Text>
                )}
              </View>

              {/* Category */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Guest Category
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {guestCategories.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: category.value as Guest['category'],
                        }))
                      }
                      className={`py-2 px-3 rounded-lg border ${
                        formData.category === category.value
                          ? `${category.color} border-transparent`
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium text-sm ${
                          formData.category === category.value
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* RSVP Status */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  RSVP Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {rsvpStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          rsvpStatus: status.value as Guest['rsvpStatus'],
                        }))
                      }
                      className={`py-2 px-4 rounded-lg border ${
                        formData.rsvpStatus === status.value
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium text-sm ${
                          formData.rsvpStatus === status.value
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

              {/* Notes */}
              <View className="mb-10">
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Notes
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.notes}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, notes: text }))
                    }
                    placeholder="Enter additional notes about the guest (optional)"
                    multiline
                    numberOfLines={3}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                    style={{ textAlignVertical: 'top' }}
                  />
                  <FileText
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
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
                  Add Guest
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
