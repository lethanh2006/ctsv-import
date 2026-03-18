import useInitModel from '@/hooks/useInitModel';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';

export default () => {
	const objInit = useInitModel<HoatDongChung.IRecord>('hoat-dong-ctsv');

	return {
		...objInit,
	};
};
