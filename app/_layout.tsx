import { useEffect } from 'react';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { AuthWrapper } from '@/components/auth/authWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { HelpCircle, Home, LogOut, Settings, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SearchModalContextProvider } from '@/contexts/searchModalContext';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  function CustomDrawerContent(props: any) {
    const handleSignOut = async () => {
      await signOut();
    };

    const handleEditProfile = () => {
      // router.push('/edit-profile');
    };

    const handleSettings = () => {
      // router.push('/(tabs)/settings');
    };

    const handleSupport = () => {
      // router.push('/(tabs)/support');
    };
    return (
      <DrawerContentScrollView {...props}>
        <View className="flex-row items-center mt-4 mb-10">
          <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <User size={24} color="#0ea5e9" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-inter-semibold text-gray-900">
              {profile?.fullName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-sm text-gray-600">{user?.email}</Text>
          </View>
        </View>

        <DrawerItem
          labelStyle={{
            fontSize: 16,
          }}
          label="Home"
          onPress={() => props.navigation.navigate('(tabs)')}
          icon={(props) => {
            return <Home {...props} size={20} color="#6b7280" />;
          }}
        />
        <DrawerItem
          labelStyle={{ fontSize: 16 }}
          onPress={handleEditProfile}
          label={'Edit Profile'}
          icon={(props) => {
            return <User {...props} size={20} color="#6b7280" />;
          }}
        />
        <DrawerItem
          labelStyle={{ fontSize: 16 }}
          onPress={handleSettings}
          label={'Settings'}
          icon={(props) => {
            return <Settings {...props} size={20} color="#6b7280" />;
          }}
        />

        <DrawerItem
          labelStyle={{ fontSize: 16 }}
          onPress={handleSupport}
          label={'Contact Support'}
          icon={(props) => {
            return <HelpCircle {...props} size={20} color="#6b7280" />;
          }}
        />
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center py-3 px-4 rounded-lg hover:bg-gray-50"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="ml-3 text-base font-inter-medium text-red-600">
            Log Out
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  }
  return (
    <AuthWrapper>
      <SearchModalContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar backgroundColor={'#ffffff'} />
          <Drawer
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="(tabs)" />
            <Drawer.Screen name="event-details" />
            <Drawer.Screen name="+not-found" />
          </Drawer>
        </GestureHandlerRootView>
      </SearchModalContextProvider>
    </AuthWrapper>
  );
}
