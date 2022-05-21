import useSWR from 'swr';
import _ from 'lodash';
import { useLocalStorage } from 'react-use';
import { Me } from '../types/member';

const useMe = (): { me: Me | null, mutate: () => void } => {
  const [localMe, setLocalMe] = useLocalStorage<Me | undefined>('me');
  const { data, error, mutate } = useSWR<Me>('/me', {
    fallbackData: localMe,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  });

  const mutateFunc = () => {
    setLocalMe(undefined);
    mutate();
  };

  if (error) {
    setLocalMe(undefined);
    return { me: null, mutate: mutateFunc };
  }
  if (!_.isEqual(localMe, data)) {
    setLocalMe(data);
  }
  return { me: data ?? null, mutate: mutateFunc };
};

export default useMe;
