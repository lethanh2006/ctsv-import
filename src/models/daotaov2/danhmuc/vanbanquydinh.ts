import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<VanBanQuyDinh.IRecord>('can-cu-phap-ly', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
