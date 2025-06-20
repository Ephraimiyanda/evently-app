import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react-native';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'planning': return 'bg-warning-100 text-warning-800';
      case 'active': return 'bg-success-100 text-success-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
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
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      {event.coverImage && (
        <Image
          source={{ uri: event.coverImage }}
          className="w-full h-32"
          resizeMode="cover"
        />
      )}
      
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-inter-semibold text-gray-900 flex-1 mr-2">
            {event.name}
          </Text>
          <View className={`px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
            <Text className="text-xs font-inter-medium capitalize">
              {event.status}
            </Text>
          </View>
        </View>

        <Text className="text-gray-600 font-inter text-sm mb-3" numberOfLines={2}>
          {event.description}
        </Text>

        <View className="space-y-2">
          <View className="flex-row items-center">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-gray-600 font-inter text-sm ml-2">
              {formatDate(event.date)} at {event.time}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MapPin size={16} color="#6b7280" />
            <Text className="text-gray-600 font-inter text-sm ml-2 flex-1" numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <DollarSign size={16} color="#6b7280" />
              <Text className="text-gray-600 font-inter text-sm ml-1">
                Budget: ${event.budget.toLocaleString()}
              </Text>
            </View>
            
            <View className={`px-2 py-1 rounded-full ${
              event.type === 'physical' ? 'bg-blue-100' :
              event.type === 'virtual' ? 'bg-purple-100' : 'bg-green-100'
            }`}>
              <Text className={`text-xs font-inter-medium ${
                event.type === 'physical' ? 'text-blue-800' :
                event.type === 'virtual' ? 'text-purple-800' : 'text-green-800'
              }`}>
                {event.type}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}