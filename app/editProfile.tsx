import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  FileText,
} from 'lucide-react-native';
import { useProfile } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/loaders/loadingSpinner';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    avatarUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant camera roll permissions to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({ ...prev, avatarUrl: result.assets[0].uri }));
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-xl font-inter-bold text-gray-900">
              Edit Profile
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg ${
                isSubmitting ? 'bg-gray-300' : 'bg-primary-500'
              }`}
            >
              <Text
                className={`font-inter-semibold ${
                  isSubmitting ? 'text-gray-500' : 'text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="space-y-6">
            {/* Profile Picture */}
            <View className="items-center">
              <TouchableOpacity onPress={pickImage} className="relative">
                <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center">
                  {formData.avatarUrl ? (
                    <Image
                      source={{ uri: formData.avatarUrl }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <User size={32} color="#0ea5e9" />
                  )}
                </View>
                <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full items-center justify-center">
                  <Camera size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text className="mt-2 text-sm text-gray-600 font-inter">
                Tap to change photo
              </Text>
            </View>

            {/* Full Name */}
            <View>
              <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                Full Name
              </Text>
              <View className="relative">
                <TextInput
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, fullName: text }))
                  }
                  placeholder="Enter your full name"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                />
                <User
                  size={20}
                  color="#6b7280"
                  className="absolute right-3 top-3"
                />
              </View>
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
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
                />
                <Phone
                  size={20}
                  color="#6b7280"
                  className="absolute right-3 top-3"
                />
              </View>
            </View>

            {/* Bio */}
            <View>
              <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                Bio
              </Text>
              <View className="relative">
                <TextInput
                  value={formData.bio}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, bio: text }))
                  }
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
