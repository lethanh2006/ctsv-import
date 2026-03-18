import useInitModel from '@/hooks/useInitModel';
import { ipNhanSu } from '@/utils/ip';
import { getSapXepDonViCanBo } from '@/services/ToChucNhanSu';

export default () => {
  const objInit = useInitModel<ToChucNhanSu.IDonViCanBoViTri>(
    'don-vi-can-bo-vi-tri',
    undefined,
    undefined,
    ipNhanSu,
  );
  const { setDanhSach } = objInit;

  const getNhanSuByDonViModel = async (idDonVi: string) => {
    try {
      const res = await getSapXepDonViCanBo(idDonVi);
      if (res) {
        setDanhSach(res.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return {
    ...objInit,
    getNhanSuByDonViModel
  };
};
