import useInitModel from '@/hooks/useInitModel';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SinhVien.IChuyenTruong>('sinh-vien-chuyen-truong', undefined, undefined, ipDaoTao);
	const [themTuHeThong, setThemTuHeThong] = useState<boolean>(false);

	return {
		...objInit,
		themTuHeThong,
		setThemTuHeThong,
	};
};
