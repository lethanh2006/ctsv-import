import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DanhSachMienKTX.IRecord>('danh-sach-mien-ky-tuc-xa', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
