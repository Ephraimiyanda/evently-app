import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEvents } from '@/hooks/useEvents';
import { useGuests } from '@/hooks/useGuests';
import { useTasks } from '@/hooks/useTasks';
import { useBudget } from '@/hooks/useBudget';
import {
  ChartBar as BarChart3,
  TrendingUp,
  Users,
  SquareCheck as CheckSquare,
  DollarSign,
  Calendar,
  Download,
  Share,
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { events } = useEvents();
  const { guests } = useGuests();
  const { tasks } = useTasks();
  const { expenses, getTotalSpent } = useBudget();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'year'
  >('month');
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter events based on selected time period
  const getFilteredEvents = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeek = getWeekNumber(now);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      const eventWeek = getWeekNumber(eventDate);

      switch (selectedPeriod) {
        case 'week':
          return eventYear === currentYear && eventWeek === currentWeek;
        case 'month':
          return eventYear === currentYear && eventMonth === currentMonth;
        case 'year':
          return eventYear === currentYear;
        default:
          return true;
      }
    });
  };

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Get filtered data based on selected period
  const filteredEvents = getFilteredEvents();
  const filteredEventIds = filteredEvents.map((e) => e.id);
  const filteredTasks = tasks.filter((task) =>
    filteredEventIds.includes(task.eventId)
  );
  const filteredGuests = guests.filter((guest) =>
    filteredEventIds.includes(guest.eventId)
  );
  const filteredExpenses = expenses.filter((expense) =>
    filteredEventIds.includes(expense.eventId)
  );

  // Calculate analytics data
  const getAnalytics = () => {
    const totalEvents = filteredEvents.length;
    const activeEvents = filteredEvents.filter(
      (e) => e.status === 'active'
    ).length;
    const completedEvents = filteredEvents.filter(
      (e) => e.status === 'completed'
    ).length;

    const totalGuests = filteredGuests.length;
    const acceptedGuests = filteredGuests.filter(
      (g) => g.rsvpStatus === 'accepted'
    ).length;
    const rsvpRate = totalGuests > 0 ? (acceptedGuests / totalGuests) * 100 : 0;

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(
      (t) => t.status === 'completed'
    ).length;
    const taskCompletionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalBudget = filteredEvents.reduce(
      (sum, event) => sum + event.budget,
      0
    );
    const totalSpentAmount = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const budgetUtilization =
      totalBudget > 0 ? (totalSpentAmount / totalBudget) * 100 : 0;

    return {
      totalEvents,
      activeEvents,
      completedEvents,
      totalGuests,
      acceptedGuests,
      rsvpRate,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      totalBudget,
      totalSpentAmount,
      budgetUtilization,
    };
  };

  const analytics = getAnalytics();

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
  }) => (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 mx-1">
      <View className="flex-row items-center justify-between mb-2">
        <View
          className={`w-10 h-10 rounded-lg items-center justify-center ${color}`}
        >
          <Icon size={20} color="white" />
        </View>
        <TrendingUp size={16} color="#10b981" />
      </View>
      <Text className="text-2xl font-inter-bold text-gray-900 mb-1">
        {typeof value === 'number' && value % 1 !== 0
          ? value.toFixed(1)
          : value}
      </Text>
      <Text className="text-gray-600 font-inter text-sm mb-1">{title}</Text>
      <Text className="text-gray-500 font-inter text-xs">{subtitle}</Text>
    </View>
  );

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
        paddingTop: Platform.OS === 'ios' ? insets.top : 12,
      }}
    >
      {/* Header */}
      <View className="px-4 py-4 ">
        {/* Period Selector */}
        <View className="flex-row space-x-2">
          {[
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'year', label: 'This Year' },
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key as any)}
              className={`px-4 py-2 rounded-full  border border-gray-200 ${
                selectedPeriod === period.key ? 'bg-primary-500' : 'bg-white'
              }`}
            >
              <Text
                className={`font-inter-medium text-sm ${
                  selectedPeriod === period.key ? 'text-white' : 'text-gray-600'
                }`}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4 space-y-6">
          {/* Key Metrics */}
          <View>
            <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
              Key Metrics
            </Text>
            <View className="flex-row mb-4">
              <StatCard
                title="Total Events"
                value={analytics.totalEvents}
                subtitle={`${analytics.activeEvents} active`}
                icon={Calendar}
                color="bg-primary-500"
              />
              <StatCard
                title="RSVP Rate"
                value={`${analytics.rsvpRate.toFixed(0)}%`}
                subtitle={`${analytics.acceptedGuests}/${analytics.totalGuests} accepted`}
                icon={Users}
                color="bg-success-500"
              />
            </View>
            <View className="flex-row">
              <StatCard
                title="Task Completion"
                value={`${analytics.taskCompletionRate.toFixed(0)}%`}
                subtitle={`${analytics.completedTasks}/${analytics.totalTasks} completed`}
                icon={CheckSquare}
                color="bg-warning-500"
              />
              <StatCard
                title="Budget Used"
                value={`${analytics.budgetUtilization.toFixed(0)}%`}
                subtitle={`$${analytics.totalSpentAmount.toLocaleString()} spent`}
                icon={DollarSign}
                color="bg-error-500"
              />
            </View>
          </View>

          {/* Event Status Breakdown */}
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
              Event Status Breakdown
            </Text>
            <View className="space-y-3">
              {[
                {
                  status: 'Planning',
                  count: filteredEvents.filter((e) => e.status === 'planning')
                    .length,
                  color: 'bg-warning-500',
                },
                {
                  status: 'Active',
                  count: filteredEvents.filter((e) => e.status === 'active')
                    .length,
                  color: 'bg-success-500',
                },
                {
                  status: 'Completed',
                  count: filteredEvents.filter((e) => e.status === 'completed')
                    .length,
                  color: 'bg-gray-500',
                },
                {
                  status: 'Cancelled',
                  count: filteredEvents.filter((e) => e.status === 'cancelled')
                    .length,
                  color: 'bg-error-500',
                },
              ].map((item) => (
                <View
                  key={item.status}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-3 h-3 rounded-full ${item.color} mr-3`}
                    />
                    <Text className="text-gray-700 font-inter text-sm">
                      {item.status}
                    </Text>
                  </View>
                  <Text className="text-gray-900 font-inter-semibold text-sm">
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Guest Categories */}
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-inter-semibold text-gray-900 mb-4">
              Guest Categories
            </Text>
            <View className="space-y-3">
              {[
                {
                  category: 'General',
                  count: filteredGuests.filter((g) => g.category === 'general')
                    .length,
                  color: 'bg-gray-500',
                },
                {
                  category: 'VIP',
                  count: filteredGuests.filter((g) => g.category === 'vip')
                    .length,
                  color: 'bg-purple-500',
                },
                {
                  category: 'Speakers',
                  count: filteredGuests.filter((g) => g.category === 'speaker')
                    .length,
                  color: 'bg-blue-500',
                },
                {
                  category: 'Volunteers',
                  count: filteredGuests.filter(
                    (g) => g.category === 'volunteer'
                  ).length,
                  color: 'bg-green-500',
                },
                {
                  category: 'Staff',
                  count: filteredGuests.filter((g) => g.category === 'staff')
                    .length,
                  color: 'bg-orange-500',
                },
              ].map((item) => (
                <View
                  key={item.category}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-3 h-3 rounded-full ${item.color} mr-3`}
                    />
                    <Text className="text-gray-700 font-inter text-sm">
                      {item.category}
                    </Text>
                  </View>
                  <Text className="text-gray-900 font-inter-semibold text-sm">
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
