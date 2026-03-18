import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KhoiNganhDaoTao.IRecordBo>('dm-khoi-nganh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
