import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'large',
  overlay = false,
}: LoadingSpinnerProps) {
  const containerStyle = overlay
    ? 'absolute inset-0 bg-black/20 items-center justify-center z-50'
    : 'flex-1 items-center justify-center';

  return (
    <View className={containerStyle}>
      <View className="bg-white rounded-lg p-6 items-center shadow-lg">
        <ActivityIndicator size={size} color="#0ea5e9" />
        {message && (
          <Text className="mt-3 text-gray-600 font-inter text-center">
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}

export function InlineLoadingSpinner({ message }: { message?: string }) {
  return (
    <View className="flex-row items-center justify-center py-4">
      <ActivityIndicator size="small" color="#0ea5e9" />
      {message && (
        <Text className="ml-2 text-gray-600 font-inter text-sm">{message}</Text>
      )}
    </View>
  );
}
