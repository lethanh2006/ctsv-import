import useInitModel from '@/hooks/useInitModel';
import {
	getHocTapHienTaiKhoaNganh,
	getTienTrinhKhungSinhVien,
} from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IRecord>('chuong-trinh-dao-tao', undefined, undefined, ipDaoTao, {
		namBanHanh: -1,
	});
	const { setLoading, setRecord } = objInit;

	const getTienTrinhKhungSinhVienModel = async (
		sinhVienSsoId: string,
		maKhoaNganh: string,
		personal: boolean,
		isDaChonPathway?: boolean,
		isDaChonChuyenNganh?: boolean,
	): Promise<ChuongTrinhDaoTao.THocPhanTienTrinhKhung[]> => {
		setLoading(true);
		try {
			const response = await getTienTrinhKhungSinhVien(
				sinhVienSsoId,
				maKhoaNganh,
				personal,
				isDaChonPathway,
				isDaChonChuyenNganh,
			);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getHocTapHienTaiModel = async (
		sinhVienSsoId: string,
		maKhoaNganh: string,
	): Promise<ChuongTrinhDaoTao.IRecord> => {
		setLoading(true);
		try {
			const response = await getHocTapHienTaiKhoaNganh(sinhVienSsoId, maKhoaNganh);
			const data = response?.data?.data;
			setRecord(data);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getTienTrinhKhungSinhVienModel,
		getHocTapHienTaiModel,
	};
};
