import useInitModel from '@/hooks/useInitModel';
import { getThongTinSinhVienBySsoId } from '@/services/SinhVien';
import { type SinhVien } from '@/services/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<SinhVien.IRecord>('sinh-vien', undefined, undefined, ipDaoTao);

  const { setLoading, setRecord } = objInit;

  const getThongTinSinhVienBySsoIdModel = async (
    ssoId: string,
  ): Promise<SinhVien.IRecord | undefined> => {
    if (!ssoId) return;
    setLoading(true);
    try {
      const response = await getThongTinSinhVienBySsoId(ssoId);
      setRecord(response?.data?.data ?? null);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    getThongTinSinhVienBySsoIdModel,
  };
};
