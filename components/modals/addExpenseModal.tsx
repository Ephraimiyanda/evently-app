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
import {
  X,
  DollarSign,
  Calendar,
  Building,
  FileText,
} from 'lucide-react-native';
import { Expense } from '@/types';
import { useFormatAmount } from '@/hooks/useFormatAmount';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEvents } from '@/hooks/useEvents';
import { Picker } from '@react-native-picker/picker';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  eventId: string;
}

export function AddExpenseModal({
  visible,
  onClose,
  onSubmit,
  eventId,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    vendor: '',
    date: '',
    status: 'pending' as Expense['status'],
    notes: '',
    eventId: '',
  });
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const amount = useFormatAmount(formData.amount);
  const unformatAmount = Number(amount.split(',').join(''));
  const { events } = useEvents();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Expense title is required';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    else if (isNaN(unformatAmount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        eventId,
        amount: unformatAmount,
        vendor: formData.vendor || undefined,
        notes: formData.notes || undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      vendor: '',
      date: '',
      status: 'pending',
      notes: '',
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
      setFormData((prev) => ({ ...prev, date: date }));
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };

  const expenseCategories = [
    'Venue',
    'Food & Beverage',
    'Technology',
    'Marketing',
    'Entertainment',
    'Transportation',
    'Accommodation',
    'Security',
    'Decorations',
    'Other',
  ];

  const expenseStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
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
                Add New Expense
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
              {errors.eventId && (
                <Text className="text-error-600 font-inter text-sm mt-1">
                  {errors.eventId}
                </Text>
              )}
              {/* Expense Title */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Expense Title *
                </Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, title: text }))
                  }
                  placeholder="Enter expense title"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-inter text-gray-900"
                />
                {errors.title && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* Amount */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Amount *
                </Text>
                <View className="relative">
                  <TextInput
                    value={amount}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, amount: text }))
                    }
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <DollarSign
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
                {errors.amount && (
                  <Text className="text-error-600 font-inter text-sm mt-1">
                    {errors.amount}
                  </Text>
                )}
              </View>

              {/* Category */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Category *
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {expenseCategories.map((category) => (
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

              {/* Vendor */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Vendor
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.vendor}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, vendor: text }))
                    }
                    placeholder="Enter vendor name (optional)"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                  />
                  <Building
                    size={20}
                    color="#6b7280"
                    className="absolute right-3 top-3"
                  />
                </View>
              </View>

              {/* Date */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Date *
                </Text>
                <View className="relative">
                  <TextInput
                    value={formData.date}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, date: text }))
                    }
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
              {/* Status */}
              <View>
                <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                  Status
                </Text>
                <View className="flex-row space-x-2">
                  {expenseStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: status.value as Expense['status'],
                        }))
                      }
                      className={`flex-1 py-3 px-4 rounded-lg border ${
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
                    placeholder="Enter additional notes (optional)"
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
                  Add Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
