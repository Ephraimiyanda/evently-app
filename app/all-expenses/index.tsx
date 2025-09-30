import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Building,
} from 'lucide-react-native';
import { useBudget } from '@/hooks/useBudget';
import { useEvents } from '@/hooks/useEvents';
import { ExpenseCard } from '@/components/cards/ExpenseCard';
import { LoadingSpinner } from '@/components/loaders/loadingSpinner';

export default function AllExpensesScreen() {
  const { expenses, loading, refetch } = useBudget();
  const { events } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getEventName = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  const categories = [
    'All Categories',
    'Venue',
    'Food & Beverage',
    'Technology',
    'Marketing',
    'Entertainment',
    'Transportation',
    'Accommodation',
    'Security',
    'Decorations',
    'Other',
  ];

  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (expense.vendor &&
          expense.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        getEventName(expense.eventId)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === '' ||
        selectedCategory === 'All Categories' ||
        expense.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalAmount = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Loading expenses..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-gray-900">
            All Expenses
          </Text>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Filter size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="relative mb-4">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search expenses, categories, vendors, or events..."
            className="bg-gray-100 rounded-lg px-4 py-3 pr-10 font-inter text-gray-900"
          />
          <Search
            size={20}
            color="#6b7280"
            className="absolute right-3 top-3"
          />
        </View>

        {/* Filters */}
        {showFilters && (
          <View className="space-y-4">
            {/* Category Filter */}
            <View>
              <Text className="text-sm font-inter-semibold text-gray-700 mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() =>
                        setSelectedCategory(
                          category === 'All Categories' ? '' : category
                        )
                      }
                      className={`px-3 py-2 rounded-full border ${
                        selectedCategory === category ||
                        (selectedCategory === '' &&
                          category === 'All Categories')
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-inter-medium text-sm ${
                          selectedCategory === category ||
                          (selectedCategory === '' &&
                            category === 'All Categories')
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Sort Options */}
            <View>
              <Text className="text-sm font-inter-semibold text-gray-700 mb-2">
                Sort By
              </Text>
              <View className="flex-row space-x-2">
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'title', label: 'Title' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => {
                      if (sortBy === option.key) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(option.key as any);
                        setSortOrder('desc');
                      }
                    }}
                    className={`px-3 py-2 rounded-lg border ${
                      sortBy === option.key
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-inter-medium text-sm ${
                        sortBy === option.key ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {option.label}{' '}
                      {sortBy === option.key &&
                        (sortOrder === 'asc' ? '↑' : '↓')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Summary */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-inter-semibold text-gray-900">
              Total: ${totalAmount.toLocaleString()}
            </Text>
            <Text className="text-gray-600 font-inter text-sm">
              {filteredAndSortedExpenses.length} expense
              {filteredAndSortedExpenses.length !== 1 ? 's' : ''}
              {searchQuery || selectedCategory ? ' (filtered)' : ''}
            </Text>
          </View>
          <DollarSign size={32} color="#059669" />
        </View>
      </View>

      {/* Expenses List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredAndSortedExpenses.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 font-inter text-center">
              {searchQuery || selectedCategory
                ? 'No expenses match your filters'
                : 'No expenses recorded yet'}
            </Text>
            {(searchQuery || selectedCategory) && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="mt-2 px-4 py-2 bg-primary-500 rounded-lg"
              >
                <Text className="text-white font-inter-medium">
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAndSortedExpenses.map((expense) => (
            <View key={expense.id} className="mb-2">
              <ExpenseCard
                expense={expense}
                onPress={() => console.log('Expense pressed:', expense.title)}
              />
              {/* Event Name */}
              <View className="bg-gray-50 rounded-b-lg ">
                <Text className="text-gray-500 font-inter text-xs">
                  Event: {getEventName(expense.eventId)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
