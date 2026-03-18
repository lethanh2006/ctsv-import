import useInitModel from '@/hooks/useInitModel';
import type { HoiDong } from '@/services/QuyTrinhDong/HoiDong/typings';

export default () => {
	const objInit = useInitModel<HoiDong.IRecord>('hoi-dong-quy-trinh');

	return {
		...objInit,
	};
};
