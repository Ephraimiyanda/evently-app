import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  Book,
  Bug,
  Star,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SupportScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@eventmanager.com?subject=Support Request');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleChatPress = () => {
    // In a real app, this would open a chat widget
    // console.log('Opening chat support...');
  };

  const handleFAQPress = () => {
    // In a real app, this would navigate to FAQ page
    // console.log('Opening FAQ...');
  };

  const handleDocumentationPress = () => {
    Linking.openURL('https://evently-sable-two.vercel.app/');
  };

  const handleBugReportPress = () => {
    Linking.openURL('mailto:bugs@eventmanager.com?subject=Bug Report');
  };

  const handleRateAppPress = () => {
    // In a real app, this would open the app store rating
    // console.log('Opening app store rating...');
  };

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      color: 'bg-blue-500',
      onPress: handleEmailPress,
    },
    {
      title: 'Phone Support',
      description: 'Call us during business hours',
      icon: Phone,
      color: 'bg-green-500',
      onPress: handlePhonePress,
    },

    {
      title: 'FAQ',
      description: 'Find answers to common questions',
      icon: HelpCircle,
      color: 'bg-orange-500',
      onPress: handleFAQPress,
    },

    {
      title: 'Report a Bug',
      description: 'Help us improve the app',
      icon: Bug,
      color: 'bg-red-500',
      onPress: handleBugReportPress,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Support Options */}
        <View className="px-4 py-6">
          <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
            How can we help you?
          </Text>

          <View className="space-y-3">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={option.onPress}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-12 h-12 rounded-lg ${option.color} items-center justify-center mr-4`}
                    >
                      <IconComponent size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-inter-semibold text-gray-900 mb-1">
                        {option.title}
                      </Text>
                      <Text className="text-gray-600 font-inter text-sm">
                        {option.description}
                      </Text>
                    </View>
                    <ExternalLink size={16} color="#6b7280" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Information */}
        <View className="px-4 pb-6">
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
              Contact Information
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <Mail size={20} color="#6b7280" />
                <View className="ml-3">
                  <Text className="text-gray-900 font-inter-medium">Email</Text>
                  <Text className="text-gray-600 font-inter text-sm">
                    support@eventmanager.com
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Phone size={20} color="#6b7280" />
                <View className="ml-3">
                  <Text className="text-gray-900 font-inter-medium">Phone</Text>
                  <Text className="text-gray-600 font-inter text-sm">
                    +1 (234) 567-8900
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <HelpCircle size={20} color="#6b7280" className="mt-0.5" />
                <View className="ml-3">
                  <Text className="text-gray-900 font-inter-medium">
                    Business Hours
                  </Text>
                  <Text className="text-gray-600 font-inter text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM EST{'\n'}
                    Saturday: 10:00 AM - 4:00 PM EST{'\n'}
                    Sunday: Closed
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* App Version */}
        <View className="px-4 pb-8">
          <Text className="text-center text-gray-500 font-inter text-sm">
            Evently v1.0.0{'\n'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
