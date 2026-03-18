import useInitModel from '@/hooks/useInitModel';
import { LichThi } from '@/services/KhaoThi/LichThi/typings';
import { ipKhaoThi } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LichThi.IRecord>('lich-thi', undefined, undefined, ipKhaoThi);

	return {
		...objInit,
	};
};
