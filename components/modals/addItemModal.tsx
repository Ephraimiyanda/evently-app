import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, CheckSquare, Users, Receipt } from 'lucide-react-native';
import { AddExpenseModal } from './addExpenseModal';
import { AddGuestModal } from './addGuestModal';
import { AddTaskModal } from './addTaskModal';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  _id: string;
}

type ItemType = 'task' | 'guest' | 'expense' | null;

export function AddItemModal({ visible, onClose, _id }: AddItemModalProps) {
  const [selectedType, setSelectedType] = useState<ItemType>(null);

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleItemTypeSelect = (type: ItemType) => {
    setSelectedType(type);
  };

  const handleItemCreated = () => {
    setSelectedType(null);
    onClose();
  };

  const itemTypes = [
    {
      type: 'task' as const,
      title: 'Add Task',
      description: 'Create a new task for this event',
      icon: CheckSquare,
      color: 'bg-success-500',
    },
    {
      type: 'guest' as const,
      title: 'Add Guest',
      description: 'Invite a new guest to this event',
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      type: 'expense' as const,
      title: 'Add Expense',
      description: 'Record a new expense for this event',
      icon: Receipt,
      color: 'bg-warning-500',
    },
  ];

  return (
    <>
      <Modal
        visible={visible && !selectedType}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-inter-bold text-gray-900">
                Add to Event
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 px-4 py-6">
            <Text className="text-gray-600 font-inter text-center mb-8">
              What would you like to add to this event?
            </Text>

            <View className="space-y-4">
              {itemTypes.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.type}
                    onPress={() => handleItemTypeSelect(item.type)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-12 h-12 rounded-lg ${item.color} items-center justify-center mr-4`}
                      >
                        <IconComponent size={24} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-inter-semibold text-gray-900 mb-1">
                          {item.title}
                        </Text>
                        <Text className="text-gray-600 font-inter text-sm">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Individual Modals */}
      <AddTaskModal
        visible={selectedType === 'task'}
        onClose={() => setSelectedType(null)}
        onSubmit={handleItemCreated}
        _id={_id}
      />

      <AddGuestModal
        visible={selectedType === 'guest'}
        onClose={() => setSelectedType(null)}
        onSubmit={handleItemCreated}
        _id={_id}
      />

      <AddExpenseModal
        visible={selectedType === 'expense'}
        onClose={() => setSelectedType(null)}
        onSubmit={handleItemCreated}
        _id={_id}
      />
    </>
  );
}
