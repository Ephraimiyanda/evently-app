import { Tabs, useNavigation } from 'expo-router';
import {
  Calendar,
  SquareCheck as CheckSquare,
  Users,
  DollarSign,
  ChartBar as BarChart3,
  User,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SearchModalContext } from '@/contexts/searchModalContext';
import { useContext } from 'react';
import {
  FilterButton,
  ProfileButton,
  SearchButton,
} from '@/components/buttons/headerButtons';
import React from 'react';
export default function TabLayout() {
  const nav = useNavigation();
  const { OnOpen } = useContext(SearchModalContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyles,

        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        //@ts-ignore
        tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
          headerLeft: () => <ProfileButton />,
          headerRight: () => <SearchButton onPress={OnOpen} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          headerRightContainerStyle: { paddingRight: 16 },
          headerBackTitleStyle: { fontSize: 12 },
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ size, color }) => (
            <CheckSquare size={size} color={color} />
          ),
          headerLeft: () => <ProfileButton />,
          headerRight: () => (
            <View
              style={{ gap: 18 }}
              className="flex flex-row  justify-around items-center "
            >
              <SearchButton onPress={OnOpen} />
            </View>
          ),
          headerLeftContainerStyle: { paddingLeft: 16 },
          headerRightContainerStyle: { paddingRight: 16 },
          headerBackTitleStyle: { fontSize: 12 },
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="guests"
        options={{
          title: 'Guests',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
          headerLeft: () => <ProfileButton />,
          headerRight: () => (
            <View
              style={{ gap: 18 }}
              className="flex flex-row  justify-around items-center "
            >
              <SearchButton onPress={OnOpen} />
            </View>
          ),
          headerLeftContainerStyle: { paddingLeft: 16 },
          headerRightContainerStyle: { paddingRight: 16 },
          headerBackTitleStyle: { fontSize: 12 },
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ size, color }) => (
            <DollarSign size={size} color={color} />
          ),
          headerLeft: () => <ProfileButton />,
          headerRight: () => (
            <View
              style={{ gap: 18 }}
              className="flex flex-row  justify-around items-center "
            >
              <SearchButton onPress={OnOpen} />
            </View>
          ),
          headerLeftContainerStyle: { paddingLeft: 16 },
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerBackTitleStyle: { fontSize: 12 },
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
          headerLeft: () => <ProfileButton />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          headerRightContainerStyle: { paddingRight: 16 },
          headerBackTitleStyle: { fontSize: 12 },
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  headerStyles: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
});
