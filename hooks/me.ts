import useSWR, { KeyedMutator } from 'swr';
import { Me } from '../types/member';

const getMeFromLocalStorage = (): Me | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const localCacheData = localStorage.getItem('me');
  if (!localCacheData) {
    return undefined;
  }
  return JSON.parse(localCacheData) || undefined;
};

const setMeToLocalStorage = (me: Me): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('me', JSON.stringify(me));
};

const useMe = (): { me: Me | null, mutate: KeyedMutator<Me>, isValidating: boolean } => {
  const { data, error, mutate, isValidating } = useSWR('/me', {
    fallbackData: getMeFromLocalStorage(),
    onSuccess: (me: Me) => {
      setMeToLocalStorage(me);
    },
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });

  if (error) {
    return { me: null, mutate, isValidating };
  }

  return { me: data ?? null, mutate, isValidating };
};

export default useMe;
