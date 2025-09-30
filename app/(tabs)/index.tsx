import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/cards/EventCard';
import { FloatingActionButton } from '@/components/buttons/FloatingActionButton';
import { AddEventModal } from '@/components/modals/addEventModal';
import { SearchModal } from '@/components/modals/searchModal';
import { InlineLoadingSpinner } from '@/components/loaders/loadingSpinner';
import { Event, Task, Guest, Expense } from '@/types';
import { SearchModalContext } from '@/contexts/searchModalContext';
import { router } from 'expo-router';
import { OptionsDrawer } from '@/components/modals/optionDrawer';
import { ConfirmationModal } from '@/components/modals/confirmationModal';

export default function HomeScreen() {
  const {
    events,
    loading: eventsLoading,
    createEvent,
    deleteEvent,
    refetch: refetchEvents,
  } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [optionsDrawerVisible, setOptionsDrawerVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { OnClose, OnOpen, searchModalVisible, setSearchModalVisible } =
    useContext(SearchModalContext);

  const [eventFilter, setEventFilter] = useState<
    'all' | 'planning' | 'active' | 'completed' | 'cancelled'
  >('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchEvents()]);
    setRefreshing(false);
  };

  const handleCreateEvent = async (
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await createEvent(eventData);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleEventOptions = (event: Event) => {
    setSelectedEvent(event);
    setOptionsDrawerVisible(true);
  };

  const handleEventEdit = () => {
    if (selectedEvent) {
      router.push(`/event-details/${selectedEvent.id}`);
    }
  };

  const handleEventDelete = () => {
    setDeleteConfirmVisible(true);
  };

  const confirmEventDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };
  const handleSearchItemPress = (item: Event | Task | Guest | Expense) => {
    setSearchModalVisible(false);
    // Handle item press based on type
  };

  // Filter events based on selected filter
  const filteredEvents = events.filter((event) => {
    if (eventFilter === 'all') return true;
    return event.status === eventFilter;
  });

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
        paddingTop: Platform.OS === 'ios' ? insets.top : 12,
      }}
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Events Section */}
        <View className="px-4 mb-6 mt-4">
          {/* Event Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-2 mb-4"
          >
            {[
              { key: 'all', label: `All Events (${events.length})` },
              { key: 'planning', label: 'Planning' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setEventFilter(filter.key as any)}
                className={`px-4 py-2 rounded-full ${
                  eventFilter === filter.key
                    ? 'bg-primary-500'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <Text
                  className={`font-inter-medium text-sm ${
                    eventFilter === filter.key ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}   
          </ScrollView>

          {eventsLoading ? (
            <InlineLoadingSpinner message="Loading events..." />
          ) : filteredEvents.length === 0 ? (
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 items-center">
              <Calendar size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-inter text-center mt-2">
                No events found
              </Text>
              <Text className="text-gray-400 font-inter text-sm text-center mt-1">
                Create your first event to get started
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event-details/${event.id}`)}
                onOptionsPress={() => handleEventOptions(event)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => setAddEventModalVisible(true)} />

      {/* Modals */}
      <AddEventModal
        visible={addEventModalVisible}
        onClose={() => setAddEventModalVisible(false)}
        onSubmit={handleCreateEvent}
      />

      <SearchModal
        visible={searchModalVisible}
        onClose={OnClose}
        type={'events'}
        data={events}
        onItemPress={handleSearchItemPress}
      />
      {/* Options Drawer */}
      <OptionsDrawer
        visible={optionsDrawerVisible}
        onClose={() => setOptionsDrawerVisible(false)}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
        title="Event Options"
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirm={confirmEventDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="bg-error-500"
      />
    </View>
  );
}
