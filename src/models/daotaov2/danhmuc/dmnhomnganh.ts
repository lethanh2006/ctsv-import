import useInitModel from '@/hooks/useInitModel';
import { getTheoLinhVuc } from '@/services/DaoTaoV2/DanhMucHeThong/NhomNganh';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<NhomNganhDaoTao.IRecordBo>('dm-nhom-nganh', undefined, undefined, ipDaoTao, { ma: 1 });
	const [danhSachTheoLichVuc, setDanhSachTheoLichVuc] = useState<NhomNganhDaoTao.IRecordByLinhVuc[]>();
	const { limit, page, setLoading, setTotal } = objInit;

	const getModelTheoLinhVuc = async () => {
		setLoading(true);
		try {
			const response = await getTheoLinhVuc({ page, limit, sort: { ma: 1 } });
			setDanhSachTheoLichVuc(response?.data?.data?.result ?? []);
			setTotal(response?.data?.data?.total ?? 0);
			return response?.data?.data?.result;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		danhSachTheoLichVuc,
		setDanhSachTheoLichVuc,
		getModelTheoLinhVuc,
	};
};
