import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getMucThuHocPhiTheoNam(maNamHoc: string) {
	return axios.get(`${ipDaoTao}/muc-thu-hoc-phi/me/nam-hoc/${maNamHoc}`);
}
