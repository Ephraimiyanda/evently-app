import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User } from 'lucide-react-native';
import { styled } from 'nativewind';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const StyledTextInput = styled(TextInput);

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    const handleAuth = async () => {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setAuthLoading(true);
      try {
        const { error } = isSignUp
          ? await signUp(email, password)
          : await signIn(email, password);

        if (error) {
          Alert.alert('Error', error.message);
        }
      } catch (err) {
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center px-6">
            <View className="items-center mb-12">
              <User size={48} color="#0ea5e9" />
              <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                Evently
              </Text>
              <Text className="text-base text-gray-500">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

            <View className="gap-4">
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                <Mail size={20} color="#6b7280" className="mr-3" />
                <StyledTextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                <Lock size={20} color="#6b7280" className="mr-3" />
                <StyledTextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity
                className={`bg-sky-500 rounded-xl py-4 items-center mt-2 ${
                  authLoading ? 'opacity-60' : ''
                }`}
                onPress={handleAuth}
                disabled={authLoading}
              >
                <Text className="text-white text-base font-semibold">
                  {authLoading
                    ? 'Loading...'
                    : isSignUp
                    ? 'Sign Up'
                    : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center mt-4"
                onPress={() => setIsSignUp(!isSignUp)}
              >
                <Text className="text-sky-500 text-sm">
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return <>{children}</>;
}
