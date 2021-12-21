import { Fetcher, SWRConfig } from 'swr';
import { ProviderProps } from '../types/provider';
import epAPI from '../utils/api';

const fetcher: Fetcher = async (url: string) => {
  const response = await epAPI.get(url);
  return response.data;
};

const APIProvider = ({ children }: ProviderProps) => {
  const shouldRetryOnError = false;
  return (
    <SWRConfig value={{
      fetcher,
      shouldRetryOnError,
    }}
    >
      {children}
    </SWRConfig>
  );
};

export default APIProvider;
