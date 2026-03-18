import useInitModel from '@/hooks/useInitModel';
import { type KetQuaHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KetQuaHocKy.IRecord>('kqht-hoc-ky', undefined, undefined, ipDaoTao);
	const [danhSachTongQuan, setDanhSachTongQuan] = useState<KetQuaHocKy.IRecord[]>([]);

	return {
		...objInit,
		danhSachTongQuan,
		setDanhSachTongQuan,
	};
};
