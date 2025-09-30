import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  CheckSquare,
  Receipt,
  Plus,
} from 'lucide-react-native';
import { useEvents } from '@/hooks/useEvents';
import { useTasks } from '@/hooks/useTasks';
import { useGuests } from '@/hooks/useGuests';
import { useBudget } from '@/hooks/useBudget';
import { LoadingSpinner } from '@/components/loaders/loadingSpinner';
import { EditEventModal } from '@/components/modals/editEventModal';
import { ConfirmationModal } from '@/components/modals/confirmationModal';
import { AddItemModal } from '@/components/modals/addItemModal';
import { TaskCard } from '@/components/cards/TaskCard';
import { GuestCard } from '@/components/cards/GuestCard';
import { ExpenseCard } from '@/components/cards/ExpenseCard';
import { Event } from '@/types';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent, loading } = useEvents();
  const { getTasksByEvent, updateTask, deleteTask } = useTasks();
  const { getGuestsByEvent } = useGuests();
  const { getExpensesByEvent, getTotalSpent } = useBudget();

  const [event, setEvent] = useState<Event | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tasks' | 'guests' | 'expenses'
  >('overview');

  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find((e) => e.id === id);
      setEvent(foundEvent || null);
    }
  }, [id, events]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data would be handled by parent hooks
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.id);
      Alert.alert('Success', 'Event deleted successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: any) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-warning-100 text-warning-800';
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading || !event) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  const eventTasks = getTasksByEvent(event.id);
  const eventGuests = getGuestsByEvent(event.id);
  const eventExpenses = getExpensesByEvent(event.id);
  const totalSpent = getTotalSpent(event.id);
  const remainingBudget = event.budget - totalSpent;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Calendar },
    {
      key: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      count: eventTasks.length,
    },
    { key: 'guests', label: 'Guests', icon: Users, count: eventGuests.length },
    {
      key: 'expenses',
      label: 'Expenses',
      icon: Receipt,
      count: eventExpenses.length,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View className="space-y-6">
            {/* Event Information */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <View>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-inter-bold text-gray-900 flex-1 ">
                    {event.name}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  >
                    <Text className="text-sm font-inter-medium capitalize">
                      {event.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-gray-600 font-inter text-base py-2">
                {event.description}
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Calendar size={20} color="#6b7280" />
                  <Text className="text-gray-700 font-inter ml-3">
                    {formatDate(event.date)} at {event.time}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MapPin size={20} color="#6b7280" />
                  <Text className="text-gray-700 font-inter ml-3 flex-1">
                    {event.location}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <DollarSign size={20} color="#6b7280" />
                    <Text className="text-gray-700 font-inter ml-3">
                      Budget: ${event.budget.toLocaleString()}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-1 rounded-full ${
                      event.type === 'physical'
                        ? 'bg-blue-100'
                        : event.type === 'virtual'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-inter-medium ${
                        event.type === 'physical'
                          ? 'text-blue-800'
                          : event.type === 'virtual'
                          ? 'text-purple-800'
                          : 'text-green-800'
                      }`}
                    >
                      {event.type}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-gray-500 font-inter">Theme: </Text>
                  <Text className="text-gray-700 font-inter font-medium">
                    {event.theme}
                  </Text>
                </View>
              </View>
            </View>

            {/* Budget Overview */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
                Budget Overview
              </Text>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 font-inter">Total Budget</Text>
                  <Text className="text-gray-900 font-inter-semibold">
                    ${event.budget.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 font-inter">Total Spent</Text>
                  <Text className="text-error-600 font-inter-semibold">
                    ${totalSpent.toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 font-inter">Remaining</Text>
                  <Text
                    className={`font-inter-semibold ${
                      remainingBudget >= 0
                        ? 'text-success-600'
                        : 'text-error-600'
                    }`}
                  >
                    ${remainingBudget.toLocaleString()}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="mt-2">
                  <View className="w-full bg-gray-200 rounded-full h-2">
                    <View
                      className={`h-2 rounded-full ${
                        totalSpent > event.budget
                          ? 'bg-error-500'
                          : 'bg-success-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          (totalSpent / event.budget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-between">
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 mr-2">
                <CheckSquare size={24} color="#22c55e" className="mb-2" />
                <Text className="text-2xl font-inter-bold text-gray-900">
                  {eventTasks.length}
                </Text>
                <Text className="text-gray-600 font-inter text-sm">Tasks</Text>
              </View>

              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 mx-1">
                <Users size={24} color="#8b5cf6" className="mb-2" />
                <Text className="text-2xl font-inter-bold text-gray-900">
                  {eventGuests.length}
                </Text>
                <Text className="text-gray-600 font-inter text-sm">Guests</Text>
              </View>

              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 ml-2">
                <Receipt size={24} color="#f59e0b" className="mb-2" />
                <Text className="text-2xl font-inter-bold text-gray-900">
                  {eventExpenses.length}
                </Text>
                <Text className="text-gray-600 font-inter text-sm">
                  Expenses
                </Text>
              </View>
            </View>
          </View>
        );

      case 'tasks':
        return (
          <View>
            {eventTasks.length === 0 ? (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 items-center">
                <CheckSquare size={48} color="#d1d5db" />
                <Text className="text-gray-500 font-inter text-center mt-2">
                  No tasks for this event
                </Text>
                <Text className="text-gray-400 font-inter text-sm text-center mt-1">
                  Tap the + button to add your first task
                </Text>
              </View>
            ) : (
              eventTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => console.log('Task pressed:', task.title)}
                  onStatusChange={handleTaskStatusChange}
                  onDelete={handleTaskDelete}
                />
              ))
            )}
          </View>
        );

      case 'guests':
        return (
          <View>
            {eventGuests.length === 0 ? (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 items-center">
                <Users size={48} color="#d1d5db" />
                <Text className="text-gray-500 font-inter text-center mt-2">
                  No guests for this event
                </Text>
                <Text className="text-gray-400 font-inter text-sm text-center mt-1">
                  Tap the + button to add your first guest
                </Text>
              </View>
            ) : (
              eventGuests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onPress={() => console.log('Guest pressed:', guest.name)}
                />
              ))
            )}
          </View>
        );

      case 'expenses':
        return (
          <View>
            {eventExpenses.length === 0 ? (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 items-center">
                <Receipt size={48} color="#d1d5db" />
                <Text className="text-gray-500 font-inter text-center mt-2">
                  No expenses for this event
                </Text>
                <Text className="text-gray-400 font-inter text-sm text-center mt-1">
                  Tap the + button to add your first expense
                </Text>
              </View>
            ) : (
              eventExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onPress={() => console.log('Expense pressed:', expense.title)}
                />
              ))
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-gray-900">
            Event Details
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={handleEdit}>
              <Edit size={24} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={24} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cover Image */}
      {event.coverImage && (
        <Image
          source={{ uri: event.coverImage }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}

      {/* Tabs */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          <View className="flex-row gap-2 px-4 py-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key as any)}
                  className={`flex-row items-center px-4 py-2 rounded-lg ${
                    isActive ? 'bg-primary-500' : 'bg-gray-100'
                  }`}
                >
                  <IconComponent
                    size={16}
                    color={isActive ? 'white' : '#6b7280'}
                  />
                  <Text
                    className={`ml-2 font-inter-medium text-sm ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </Text>
                  {tab.count !== undefined && (
                    <View
                      className={`ml-2 px-2 py-1 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-inter-bold ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        className="flex-1 px-4 pt-3 pb-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setAddItemModalVisible(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-full shadow-lg items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      {/* Modals */}
      <EditEventModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        event={event}
      />

      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone and will also delete all associated tasks, guests, and expenses.`}
        confirmText="Delete"
        confirmColor="bg-error-500"
      />

      <AddItemModal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        _id={event.id}
      />
    </SafeAreaView>
  );
}
