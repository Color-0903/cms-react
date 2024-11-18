import { useQuery } from '@tanstack/react-query';
import { storeApi } from '../apis';
import { QUERY_LIST_STORE } from '../util/contanst';

const UseStore = (userId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_STORE, userId],
    queryFn: () => storeApi.storeControllerGetAll(1, undefined, undefined, userId).then((res) => res?.data),
    staleTime: 1000,
  });

  return { data, isLoading };
};

export { UseStore };
