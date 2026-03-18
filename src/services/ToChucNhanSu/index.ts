import { ipNhanSu } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getSapXepDonViCanBo(donViId: string, mocXetNangBac?: string) {
  return axios.get(`${ipNhanSu}/don-vi-can-bo-vi-tri/sap-xep-chuc-vu/don-vi/${donViId}`, {
    params: {
      mocXetNangBac: mocXetNangBac,
    },
  });
}
