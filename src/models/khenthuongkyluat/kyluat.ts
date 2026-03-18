import useInitModel from '@/hooks/useInitModel';
import { type KyLuat } from '@/services/KhenThuongKyLuat/KyLuat/typing';

export default () => {
	const objInit = useInitModel<KyLuat.IRecord>('ky-luat');

	return {
		...objInit,
	};
};
