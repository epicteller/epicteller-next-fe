import useSWRImmutable from 'swr/immutable';
import _ from 'lodash';
import { Me } from '../types/member';

const getMeFromLocalStorage = (): Me | null => {
  const localCacheData = localStorage.getItem('me');
  if (!localCacheData) {
    return null;
  }
  return JSON.parse(localCacheData) ?? null;
};

const useMe = (): { me: Me | null, mutate: () => void } => {
  const localMe = getMeFromLocalStorage();
  const { data, error, mutate } = useSWRImmutable('/me', { fallbackData: localMe });

  const mutateFunc = () => {
    localStorage.removeItem('me');
    mutate();
  };

  if (error) {
    localStorage.removeItem('me');
    return { me: null, mutate: mutateFunc };
  }
  if (!_.isEqual(localMe, data)) {
    localStorage.setItem('me', JSON.stringify(data));
  }
  return { me: data ?? null, mutate: mutateFunc };
};

export default useMe;
