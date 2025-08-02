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
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { useBudget } from '@/hooks/useBudget';
import { useEvents } from '@/hooks/useEvents';
import { ExpenseCard } from '@/components/cards/ExpenseCard';
import { FloatingActionButton } from '@/components/buttons/FloatingActionButton';
import { SearchModal } from '@/components/modals/searchModal';
import { InlineLoadingSpinner } from '@/components/loaders/loadingSpinner';
import { Expense } from '@/types';
import { AddExpenseModal } from '@/components/modals/addExpenseModal';
import { SearchModalContext } from '@/contexts/searchModalContext';

export default function BudgetScreen() {
  const { expenses, loading, createExpense, refetch } = useBudget();
  const { events } = useEvents();
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

  const handleCreateExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      await createExpense(expenseData);
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const handleExpensePress = (expense: Expense) => {
    console.log('Expense pressed:', expense.title);
  };

  const handleSearchItemPress = (item: Expense) => {
    OnClose();
    handleExpensePress(item);
  };

  // Calculate budget overview
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Get recent expenses (limit to 2)
  const recentExpenses = expenses.slice(0, 2);

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
        {/* Budget Overview */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
              Budget Overview
            </Text>

            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-inter">Total Budget</Text>
                <Text className="text-xl font-inter-bold text-gray-900">
                  ${totalBudget.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-inter">Total Spent</Text>
                <Text className="text-xl font-inter-bold text-error-600">
                  ${totalSpent.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-inter">Remaining</Text>
                <Text
                  className={`text-xl font-inter-bold ${
                    remaining >= 0 ? 'text-success-600' : 'text-error-600'
                  }`}
                >
                  ${remaining.toLocaleString()}
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="mt-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-600 font-inter text-sm">
                    Budget Used
                  </Text>
                  <Text className="text-gray-600 font-inter text-sm">
                    {spentPercentage.toFixed(1)}%
                  </Text>
                </View>
                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View
                    className={`h-2 rounded-full ${
                      spentPercentage > 90
                        ? 'bg-error-500'
                        : spentPercentage > 75
                        ? 'bg-warning-500'
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between mb-6">
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 mr-2">
              <DollarSign size={24} color="#22c55e" className="mb-2" />
              <Text className="text-2xl font-inter-bold text-gray-900">
                {expenses.filter((e) => e.status === 'paid').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Paid</Text>
            </View>
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 mx-1">
              <TrendingUp size={24} color="#f59e0b" className="mb-2" />
              <Text className="text-2xl font-inter-bold text-gray-900">
                {expenses.filter((e) => e.status === 'pending').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Pending</Text>
            </View>
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 ml-2">
              <TrendingDown size={24} color="#ef4444" className="mb-2" />
              <Text className="text-2xl font-inter-bold text-gray-900">
                {expenses.filter((e) => e.status === 'overdue').length}
              </Text>
              <Text className="text-gray-600 font-inter text-sm">Overdue</Text>
            </View>
          </View>
        </View>

        {/* Recent Expenses */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-inter-semibold text-gray-900">
              Recent Expenses
            </Text>
            <TouchableOpacity
            // onPress={() => router.push('/(tabs)/all-expenses')}
            >
              <Text className="text-primary-500 font-inter-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {loading && expenses.length === 0 ? (
            <InlineLoadingSpinner message="Loading budget..." />
          ) : recentExpenses.length === 0 ? (
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 items-center">
              <DollarSign size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-inter text-center mt-2">
                No expenses recorded yet
              </Text>
              <Text className="text-gray-400 font-inter text-sm text-center mt-1">
                Tap the + button to add your first expense
              </Text>
            </View>
          ) : (
            recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onPress={() => handleExpensePress(expense)}
              />
            ))
          )}
        </View>
      </ScrollView>
      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => setAddModalVisible(true)} />
      {/* Modals */}
      <AddExpenseModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleCreateExpense}
      />
      <SearchModal
        visible={searchModalVisible}
        onClose={OnClose}
        type="expenses"
        data={expenses}
        onItemPress={handleSearchItemPress}
      />
    </View>
  );
}
