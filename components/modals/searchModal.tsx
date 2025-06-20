import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, Calendar, Filter } from 'lucide-react-native';
import { Event, Task, Guest, Expense } from '@/types';

type SearchableItem = Event | Task | Guest | Expense;
type SearchType = 'events' | 'tasks' | 'guests' | 'expenses';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  type: SearchType;
  data: SearchableItem[];
  onItemPress: (item: any) => void;
}

export function SearchModal({
  visible,
  onClose,
  type,
  data,
  onItemPress,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<SearchableItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedFilters, data]);

  const filterData = () => {
    let filtered = data;

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) => {
        const searchableText = getSearchableText(item).toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedFilters.some((filter) =>
          itemMatchesFilter(item, filter)
        );
      });
    }

    setFilteredData(filtered);
  };

  const getSearchableText = (item: SearchableItem): string => {
    switch (type) {
      case 'events':
        const event = item as Event;
        return `${event.name} ${event.description} ${event.location} ${event.theme}`;
      case 'tasks':
        const task = item as Task;
        return `${task.title} ${task.description} ${task.assignedTo} ${task.category}`;
      case 'guests':
        const guest = item as Guest;
        return `${guest.name} ${guest.email} ${guest.phone || ''}`;
      case 'expenses':
        const expense = item as Expense;
        return `${expense.title} ${expense.category} ${expense.vendor || ''}`;
      default:
        return '';
    }
  };

  const itemMatchesFilter = (item: SearchableItem, filter: string): boolean => {
    switch (type) {
      case 'events':
        const event = item as Event;
        return event.status === filter || event.type === filter;
      case 'tasks':
        const task = item as Task;
        return (
          task.status === filter ||
          task.priority === filter ||
          task.category === filter
        );
      case 'guests':
        const guest = item as Guest;
        return guest.rsvpStatus === filter || guest.category === filter;
      case 'expenses':
        const expense = item as Expense;
        return expense.status === filter || expense.category === filter;
      default:
        return false;
    }
  };

  const getFilters = (): string[] => {
    switch (type) {
      case 'events':
        return [
          'planning',
          'active',
          'completed',
          'cancelled',
          'physical',
          'virtual',
          'hybrid',
        ];
      case 'tasks':
        return [
          'todo',
          'in-progress',
          'completed',
          'low',
          'medium',
          'high',
          'urgent',
        ];
      case 'guests':
        return [
          'pending',
          'accepted',
          'declined',
          'maybe',
          'general',
          'vip',
          'speaker',
          'volunteer',
          'staff',
        ];
      case 'expenses':
        return [
          'pending',
          'paid',
          'overdue',
          'Venue',
          'Food & Beverage',
          'Technology',
          'Marketing',
        ];
      default:
        return [];
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const renderItem = ({ item }: { item: SearchableItem }) => {
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3"
      >
        {type === 'events' && <EventSearchItem event={item as Event} />}
        {type === 'tasks' && <TaskSearchItem task={item as Task} />}
        {type === 'guests' && <GuestSearchItem guest={item as Guest} />}
        {type === 'expenses' && <ExpenseSearchItem expense={item as Expense} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-inter-bold text-gray-900">
              Search {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="relative mb-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${type}...`}
              className="bg-gray-100 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
            />
            <Search
              size={20}
              color="#6b7280"
              className="absolute right-3 top-3"
            />
          </View>

          {/* Filter Toggle */}
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center justify-center py-2"
          >
            <Filter size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-600 font-inter-medium">
              Filters{' '}
              {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </Text>
          </TouchableOpacity>

          {/* Filters */}
          {showFilters && (
            <View className="mt-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {getFilters().map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => toggleFilter(filter)}
                      className={`px-3 py-2 rounded-full border ${
                        selectedFilters.includes(filter)
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium text-sm ${
                          selectedFilters.includes(filter)
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Results */}
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 font-inter text-center">
                No {type} found matching your search
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

// Search result item components
function EventSearchItem({ event }: { event: Event }) {
  return (
    <View>
      <Text className="text-base font-inter-semibold text-gray-900 mb-1">
        {event.name}
      </Text>
      <Text className="text-gray-600 font-inter text-sm mb-2" numberOfLines={2}>
        {event.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500 font-inter text-xs">
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            event.status === 'planning'
              ? 'bg-warning-100'
              : event.status === 'active'
              ? 'bg-success-100'
              : event.status === 'completed'
              ? 'bg-gray-100'
              : 'bg-error-100'
          }`}
        >
          <Text
            className={`text-xs font-inter-medium ${
              event.status === 'planning'
                ? 'text-warning-800'
                : event.status === 'active'
                ? 'text-success-800'
                : event.status === 'completed'
                ? 'text-gray-800'
                : 'text-error-800'
            }`}
          >
            {event.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TaskSearchItem({ task }: { task: Task }) {
  return (
    <View>
      <Text className="text-base font-inter-semibold text-gray-900 mb-1">
        {task.title}
      </Text>
      <Text className="text-gray-600 font-inter text-sm mb-2" numberOfLines={2}>
        {task.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500 font-inter text-xs">
          Assigned to {task.assignedTo}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            task.priority === 'low'
              ? 'bg-blue-100'
              : task.priority === 'medium'
              ? 'bg-yellow-100'
              : task.priority === 'high'
              ? 'bg-orange-100'
              : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-inter-medium ${
              task.priority === 'low'
                ? 'text-blue-800'
                : task.priority === 'medium'
                ? 'text-yellow-800'
                : task.priority === 'high'
                ? 'text-orange-800'
                : 'text-red-800'
            }`}
          >
            {task.priority}
          </Text>
        </View>
      </View>
    </View>
  );
}

function GuestSearchItem({ guest }: { guest: Guest }) {
  return (
    <View>
      <Text className="text-base font-inter-semibold text-gray-900 mb-1">
        {guest.name}
      </Text>
      <Text className="text-gray-600 font-inter text-sm mb-2">
        {guest.email}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500 font-inter text-xs">
          {guest.category}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            guest.rsvpStatus === 'accepted'
              ? 'bg-success-100'
              : guest.rsvpStatus === 'declined'
              ? 'bg-error-100'
              : guest.rsvpStatus === 'maybe'
              ? 'bg-warning-100'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-xs font-inter-medium ${
              guest.rsvpStatus === 'accepted'
                ? 'text-success-800'
                : guest.rsvpStatus === 'declined'
                ? 'text-error-800'
                : guest.rsvpStatus === 'maybe'
                ? 'text-warning-800'
                : 'text-gray-800'
            }`}
          >
            {guest.rsvpStatus}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ExpenseSearchItem({ expense }: { expense: Expense }) {
  return (
    <View>
      <Text className="text-base font-inter-semibold text-gray-900 mb-1">
        {expense.title}
      </Text>
      <Text className="text-success-600 font-inter-bold text-lg mb-2">
        ${expense.amount.toLocaleString()}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500 font-inter text-xs">
          {expense.category}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            expense.status === 'paid'
              ? 'bg-success-100'
              : expense.status === 'pending'
              ? 'bg-warning-100'
              : 'bg-error-100'
          }`}
        >
          <Text
            className={`text-xs font-inter-medium ${
              expense.status === 'paid'
                ? 'text-success-800'
                : expense.status === 'pending'
                ? 'text-warning-800'
                : 'text-error-800'
            }`}
          >
            {expense.status}
          </Text>
        </View>
      </View>
    </View>
  );
}
