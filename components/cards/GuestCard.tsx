import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Mail,
  Phone,
  User,
  Send,
  Trash2,
  MoreVertical,
} from 'lucide-react-native';
import { Guest } from '@/types';

interface GuestCardProps {
  guest: Guest;
  onDelete?: (guestId: string) => void;
  onSendInvite?: (guestId: string) => void;
}

export function GuestCard({ guest, onDelete, onSendInvite }: GuestCardProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const getRsvpStatusColor = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'accepted':
        return 'bg-success-100 text-success-800';
      case 'declined':
        return 'bg-error-100 text-error-800';
      case 'maybe':
        return 'bg-warning-100 text-warning-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TouchableOpacity className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
      <View className="flex-row flex-1 justify-between">
        <View className="flex-row gap-1 items-center">
          <Text className="text-base font-inter-semibold text-gray-900 mb-1">
            {guest.name}
          </Text>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <View
            className={`px-2 py-1 rounded-full w-fit ${getRsvpStatusColor(
              guest.rsvpStatus
            )}`}
          >
            <Text className="text-xs font-inter-medium capitalize">
              {guest.rsvpStatus}
            </Text>
          </View>
          {(onDelete || onSendInvite) && (
            <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
              <MoreVertical size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex flex-row gap-3 items-center">
        <Text className="text-sm text-gray-600 font-inter">•</Text>
        <Text className="text-xs font-inter-medium uppercase text-gray-600">
          {guest.category}
        </Text>
      </View>

      {/* Options Menu */}
      {showOptions && (onDelete || onSendInvite) && (
        <View className="mb-3 p-2 bg-gray-50 rounded-lg">
          <View className="flex-row space-x-2">
            {onSendInvite && (
              <TouchableOpacity
                onPress={() => {
                  onSendInvite(guest.id);
                  setShowOptions(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-primary-500 flex-row items-center justify-center"
              >
                <Send size={14} color="white" />
                <Text className="ml-1 text-xs font-inter-medium text-white">
                  Send Invite
                </Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => {
                  onDelete(guest.id);
                  setShowOptions(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-error-500 flex-row items-center justify-center"
              >
                <Trash2 size={14} color="white" />
                <Text className="ml-1 text-xs font-inter-medium text-white">
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

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
          <Text
            className="text-gray-500 font-inter text-sm mt-2"
            numberOfLines={2}
          >
            Note : {guest.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
