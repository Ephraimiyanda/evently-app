import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, X } from 'lucide-react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'bg-primary-500',
  icon,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-4">
        <View className="bg-white rounded-xl shadow-lg max-w-sm w-full">
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                {icon || <AlertTriangle size={24} color="#f59e0b" />}
                <Text className="text-xl font-inter-bold text-gray-900 ml-3">
                  {title}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 font-inter leading-6">
              {message}
            </Text>
          </View>

          {/* Actions */}
          <View className="px-6 pb-6">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300"
              >
                <Text className="text-center font-inter-semibold text-gray-700">
                  {cancelText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className={`flex-1 py-3 px-4 rounded-lg ${confirmColor}`}
              >
                <Text className="text-center font-inter-semibold text-white">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
