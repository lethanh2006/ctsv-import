import useInitModel from '@/hooks/useInitModel';
import { getQuyTrinhChuyenVien } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/donquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KhaiBaoQuyTrinh.IRecord>('don-quy-trinh-dong');
	const { setDanhSach, setLoading, setTotal, page, limit, condition } = objInit;
	const [current, setCurrent] = useState<KhaiBaoQuyTrinh.IBuocXuLy>();
	const [currentFormKhaiBao, setCurrentFormKhaiBao] = useState<KhaiBaoQuyTrinh.IDanhSachForm>();
	const [visibleFormQuyTrinh, setVisibleFormQuyTrinh] = useState<boolean>(false);
	const [visibleFormKhaiBaoQuyTrinh, setVisibleFormKhaiBaoQuyTrinh] = useState<boolean>(false);
	const [dataQuyTrinh, setDataQuyTrinh] = useState<KhaiBaoQuyTrinh.IChiTietKhaiBao>();
	const getQuyTrinhChuyenVienModel = async (loaiXuLyDon: string) => {
		try {
			setLoading(true);
			const res = await getQuyTrinhChuyenVien(loaiXuLyDon, { page, limit, condition });
			if (res) {
				setDanhSach(res?.data?.data?.result ?? []);
				setTotal(res?.data?.data?.total ?? 0);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	return {
		...objInit,
		getQuyTrinhChuyenVienModel,
		current,
		setCurrent,
		dataQuyTrinh,
		setDataQuyTrinh,
		visibleFormQuyTrinh,
		setVisibleFormQuyTrinh,
		visibleFormKhaiBaoQuyTrinh,
		setVisibleFormKhaiBaoQuyTrinh,
		currentFormKhaiBao,
		setCurrentFormKhaiBao,
	};
};
