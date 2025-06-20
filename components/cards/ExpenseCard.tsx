import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Building, DollarSign } from 'lucide-react-native';
import { Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
}

export function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'overdue': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-inter-semibold text-gray-900 flex-1 mr-2">
          {expense.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
          <Text className="text-xs font-inter-medium capitalize">
            {expense.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <DollarSign size={16} color="#059669" />
        <Text className="text-lg font-inter-bold text-success-600 ml-1">
          ${expense.amount.toLocaleString()}
        </Text>
      </View>

      <View className="space-y-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-500 font-inter text-sm">
            {expense.category}
          </Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="#6b7280" />
            <Text className="text-gray-600 font-inter text-sm ml-1">
              {formatDate(expense.date)}
            </Text>
          </View>
        </View>

        {expense.vendor && (
          <View className="flex-row items-center">
            <Building size={14} color="#6b7280" />
            <Text className="text-gray-600 font-inter text-sm ml-2">
              {expense.vendor}
            </Text>
          </View>
        )}

        {expense.notes && (
          <Text className="text-gray-500 font-inter text-sm mt-2" numberOfLines={2}>
            {expense.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}