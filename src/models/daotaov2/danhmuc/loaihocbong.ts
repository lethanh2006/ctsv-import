import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LoaiHocBong.IRecord>('loai-hoc-bong', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
