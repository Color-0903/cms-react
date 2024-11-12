import { useQuery } from '@tanstack/react-query';
import { cadastralApi } from '../apis';
import { QUERY_DISTRICT, QUERY_PROVINCE } from '../util/contanst';

const UseProvince = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_PROVINCE],
    queryFn: () => cadastralApi.cadastralControllerGetProvince().then((res) => res?.data),
    staleTime: 1000,
  });

  return { data, isLoading };
};

const UseDistrict = (cityCode = '1') => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_DISTRICT, cityCode],
    queryFn: () => cadastralApi.cadastralControllerGetDistrict(cityCode).then((res) => res?.data),
    staleTime: 1000,
  });

  return { data, isLoading };
};

const UseWard = (districtCode = '3') => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_DISTRICT, districtCode],
    queryFn: () => cadastralApi.cadastralControllerGetWard(districtCode).then((res) => res?.data),
    staleTime: 1000,
  });

  return { data, isLoading };
};

export { UseProvince, UseDistrict, UseWard };
