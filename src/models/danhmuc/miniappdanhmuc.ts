import useInitModel from '@/hooks/useInitModel';
import type { MiniAppDanhMuc } from '@/services/CauHinh/MiniApp/typing';

export default () => {
	const objInit = useInitModel<MiniAppDanhMuc.IRecord>('miniapp-danh-muc');

	return {
		...objInit,
	};
};
