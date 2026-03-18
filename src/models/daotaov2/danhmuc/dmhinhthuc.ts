import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HinhThucDaoTao.IRecordBo>('dm-hinh-thuc-dao-tao', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
