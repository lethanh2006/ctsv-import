import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KhoiKienThuc.IRecord>('khoi-kien-thuc', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
