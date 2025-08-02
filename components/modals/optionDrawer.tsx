import React from 'react';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { Edit, Trash2, X } from 'lucide-react-native';

interface OptionsDrawerProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title?: string;
}

export function OptionsDrawer({
  visible,
  onClose,
  onEdit,
  onDelete,
  title = 'Options',
}: OptionsDrawerProps) {
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <TouchableOpacity
          className="flex-1 bg-black/20"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Content */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-t-xl shadow-lg"
        >
          {/* Header */}
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-inter-semibold text-gray-900">
                {title}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <View className="px-4 py-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-row items-center py-4 px-2 rounded-lg"
            >
              <Edit size={20} color="#6b7280" />
              <Text className="ml-3 text-base font-inter-medium text-gray-700">
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center py-4 px-2 rounded-lg"
            >
              <Trash2 size={20} color="#dc2626" />
              <Text className="ml-3 text-base font-inter-medium text-red-600">
                Delete
              </Text>
            </TouchableOpacity>
          </View>

          {/* Safe area for bottom */}
          <View className="h-8" />
        </Animated.View>
      </View>
    </Modal>
  );
}
