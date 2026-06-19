import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';

const POPULATION = [{ path: 'dangKyKyTucXaRule' }];

export default () => {
	const objInit = useInitModel<KyTucXa.IPhong>('phong/ktx', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
