import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Mail, Phone, User } from 'lucide-react-native';
import { Guest } from '@/types';

interface GuestCardProps {
  guest: Guest;
  onPress: () => void;
}

export function GuestCard({ guest, onPress }: GuestCardProps) {
  const getRsvpStatusColor = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'accepted': return 'bg-success-100 text-success-800';
      case 'declined': return 'bg-error-100 text-error-800';
      case 'maybe': return 'bg-warning-100 text-warning-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Guest['category']) => {
    switch (category) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'speaker': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-inter-semibold text-gray-900 mb-1">
            {guest.name}
          </Text>
          <View className={`self-start px-2 py-1 rounded-full ${getCategoryColor(guest.category)}`}>
            <Text className="text-xs font-inter-medium capitalize">
              {guest.category}
            </Text>
          </View>
        </View>
        
        <View className={`px-2 py-1 rounded-full ${getRsvpStatusColor(guest.rsvpStatus)}`}>
          <Text className="text-xs font-inter-medium capitalize">
            {guest.rsvpStatus}
          </Text>
        </View>
      </View>

      <View className="space-y-1">
        <View className="flex-row items-center">
          <Mail size={14} color="#6b7280" />
          <Text className="text-gray-600 font-inter text-sm ml-2">
            {guest.email}
          </Text>
        </View>

        {guest.phone && (
          <View className="flex-row items-center">
            <Phone size={14} color="#6b7280" />
            <Text className="text-gray-600 font-inter text-sm ml-2">
              {guest.phone}
            </Text>
          </View>
        )}

        {guest.notes && (
          <Text className="text-gray-500 font-inter text-sm mt-2" numberOfLines={2}>
            {guest.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}