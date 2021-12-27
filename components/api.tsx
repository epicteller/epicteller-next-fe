import { Fetcher, SWRConfig } from 'swr';
import { ProviderProps } from '../types/provider';
import epAPI from '../lib/api';

const fetcher: Fetcher = async <T, >(url: string): Promise<T> => {
  const response = await epAPI.get<T>(url);
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
