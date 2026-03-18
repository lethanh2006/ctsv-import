import useInitModel from '@/hooks/useInitModel';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HoaDon.IBillItem>('bill-item', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
