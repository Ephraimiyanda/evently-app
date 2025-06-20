import { useProfile } from '@/hooks/useProfile';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Download, Filter, Search, Share, User } from 'lucide-react-native';
import { TouchableOpacity, View, Image } from 'react-native';

interface headerButton {
  onPress?: () => void;
  size?: number | string;
  color?: string;
}

export const SearchButton = ({ onPress, size, color }: headerButton) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Search size={size ? size : 24} color={color ? color : '#6b7280'} />
    </TouchableOpacity>
  );
};

export const FilterButton = ({ onPress, size, color }: headerButton) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Filter size={size ? size : 24} color={color ? color : '#6b7280'} />
    </TouchableOpacity>
  );
};
export const DownLoadButton = ({ onPress, size, color }: headerButton) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Download size={size ? size : 24} color={color ? color : '#6b7280'} />
    </TouchableOpacity>
  );
};

export const ShareButton = ({ onPress, size, color }: headerButton) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Share size={size ? size : 24} color={color ? color : '#6b7280'} />
    </TouchableOpacity>
  );
};

export const ProfileButton = ({ onPress, size, color }: headerButton) => {
  const { profile } = useProfile();
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
  return (
    <TouchableOpacity
      onPress={openDrawer}
      className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3"
    >
      {profile?.avatarUrl ? (
        <Image
          source={{ uri: profile.avatarUrl }}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <User size={size ? size : 24} color={color ? color : '#0ea5e9'} />
      )}
    </TouchableOpacity>
  );
};
