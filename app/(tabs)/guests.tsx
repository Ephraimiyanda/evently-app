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
import { Search, Filter, Mail, MessageSquare } from 'lucide-react-native';
import { useGuests } from '@/hooks/useGuests';
import { GuestCard } from '@/components/cards/GuestCard';
import { FloatingActionButton } from '@/components/buttons/FloatingActionButton';
import { SearchModal } from '@/components/modals/searchModal';
import { InlineLoadingSpinner } from '@/components/loaders/loadingSpinner';
import { Guest } from '@/types';
import { AddGuestModal } from '@/components/modals/addGuestModal';
import { SearchModalContext } from '@/contexts/searchModalContext';

export default function GuestsScreen() {
  const { guests, loading, createGuest, sendInvitation, refetch } = useGuests();
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { OnClose, searchModalVisible, setSearchModalVisible } =
    useContext(SearchModalContext);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateGuest = async (
    guestData: Omit<Guest, 'id' | 'invitedAt'>
  ) => {
    try {
      await createGuest(guestData);
    } catch (error) {
      console.error('Failed to create guest:', error);
    }
  };

  const handleGuestPress = (guest: Guest) => {
    console.log('Guest pressed:', guest.name);
  };

  const handleSearchItemPress = (item: Guest) => {
    OnClose();
    handleGuestPress(item);
  };

  const getRsvpStats = () => {
    const accepted = guests.filter((g) => g.rsvpStatus === 'accepted').length;
    const declined = guests.filter((g) => g.rsvpStatus === 'declined').length;
    const pending = guests.filter((g) => g.rsvpStatus === 'pending').length;
    const maybe = guests.filter((g) => g.rsvpStatus === 'maybe').length;

    return { accepted, declined, pending, maybe };
  };

  const stats = getRsvpStats();
  return (
    <View
      className="flex-1 bg-gray-50"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        paddingTop: Platform.OS === 'ios' ? insets.top : 12,
      }}
    >
      <View className="bg-gray-50 flex-1">
        {/* RSVP Stats */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          <Text className="text-lg font-inter-semibold text-gray-900 mb-3">
            RSVP Status
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-success-600">
                {stats.accepted}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Accepted</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-warning-600">
                {stats.maybe}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Maybe</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-gray-600">
                {stats.pending}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Pending</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-inter-bold text-error-600">
                {stats.declined}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Declined</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row mx-4 mt-4 space-x-2">
          <TouchableOpacity className="flex-1 bg-primary-500 rounded-lg py-3 flex-row items-center justify-center">
            <Mail size={16} color="white" />
            <Text className="text-white font-inter-semibold ml-2">
              Send Invites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-secondary-500 rounded-lg py-3 flex-row items-center justify-center">
            <MessageSquare size={16} color="white" />
            <Text className="text-white font-inter-semibold ml-2">
              Send SMS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guests List */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading && guests.length === 0 ? (
            <InlineLoadingSpinner message="Loading guests..." />
          ) : guests.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 font-inter text-center">
                No guests added yet
              </Text>
              <Text className="text-gray-400 font-inter text-sm text-center mt-2">
                Tap the + button to add your first guest
              </Text>
            </View>
          ) : (
            guests.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                onPress={() => handleGuestPress(guest)}
              />
            ))
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton onPress={() => setAddModalVisible(true)} />

        {/* Modals */}
        <AddGuestModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSubmit={handleCreateGuest}
        />

        <SearchModal
          visible={searchModalVisible}
          onClose={OnClose}
          type="guests"
          data={guests}
          onItemPress={handleSearchItemPress}
        />
      </View>
    </View>
  );
}
