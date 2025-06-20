import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut, HelpCircle, X } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { router } from 'expo-router';

interface DrawerContentProps {
  onClose: () => void;
}

export function DrawerContent({ onClose }: DrawerContentProps) {
  const { signOut, user } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleEditProfile = () => {
    onClose();
    // router.push('/edit-profile');
  };

  const handleSettings = () => {
    onClose();
    // router.push('/(tabs)/settings');
  };

  const handleSupport = () => {
    onClose();
    // router.push('/(tabs)/support');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-inter-bold text-gray-900">Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <User size={24} color="#0ea5e9" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-inter-semibold text-gray-900">
              {profile?.fullName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-sm text-gray-600">{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <ScrollView className="flex-1 px-6 py-4">
        <View className="space-y-2">
          <TouchableOpacity
            onPress={handleEditProfile}
            className="flex-row items-center py-3 px-4 rounded-lg hover:bg-gray-50"
          >
            <User size={20} color="#6b7280" />
            <Text className="ml-3 text-base font-inter-medium text-gray-700">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSettings}
            className="flex-row items-center py-3 px-4 rounded-lg hover:bg-gray-50"
          >
            <Settings size={20} color="#6b7280" />
            <Text className="ml-3 text-base font-inter-medium text-gray-700">
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSupport}
            className="flex-row items-center py-3 px-4 rounded-lg hover:bg-gray-50"
          >
            <HelpCircle size={20} color="#6b7280" />
            <Text className="ml-3 text-base font-inter-medium text-gray-700">
              Contact Support
            </Text>
          </TouchableOpacity>

          <View className="border-t border-gray-100 my-4" />

          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center py-3 px-4 rounded-lg hover:bg-gray-50"
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="ml-3 text-base font-inter-medium text-red-600">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
