import { useCurrentUser } from './useCurrentUser';
import { User } from '@/types';

export const useFollowers = () => {
  const { currentUser, isLoading, error } = useCurrentUser();

  const followers = (currentUser?.followers || []) as User[];
  const following = (currentUser?.following || []) as User[];

  const isPopulated = followers.length > 0 && typeof followers[0] === 'object';

  const followersCount = Array.isArray(followers) ? followers.length : 0;
  const followingCount = Array.isArray(following) ? following.length : 0;

  return {
    followers,        
    following,        
    followersCount,
    followingCount,
    isPopulated,      
    isLoading,
    error,
  };
};
