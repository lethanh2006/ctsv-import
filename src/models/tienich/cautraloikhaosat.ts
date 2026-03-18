import useInitModel from '@/hooks/useInitModel';
import { BieuMau } from '@/services/TienIch/BieuMau/typings';

export default () => {
	const objInit = useInitModel<BieuMau.ICauTraLoiKhaoSat>('cau-tra-loi-khao-sat');

	return {
		...objInit,
	};
};
