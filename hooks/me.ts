import useSWR from 'swr';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { Me } from '../types/member';

const getMeFromLocalStorage = (): Me | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const localCacheData = localStorage.getItem('me');
  if (!localCacheData) {
    return null;
  }
  return JSON.parse(localCacheData) ?? null;
};

const useMe = (): { me: Me | null, mutate: () => void } => {
  const localMe = getMeFromLocalStorage();
  const { data, error, mutate } = useSWR('/me', {
    fallbackData: localMe,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  });

  const mutateFunc = useCallback(() => {
    localStorage.removeItem('me');
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem('me');
      return;
    }
    if (!_.isEqual(localMe, data)) {
      localStorage.setItem('me', JSON.stringify(data));
    }
  }, [data, error, localMe, mutateFunc]);

  if (error) {
    return { me: null, mutate: mutateFunc };
  }

  return { me: data ?? null, mutate: mutateFunc };
};

export default useMe;
