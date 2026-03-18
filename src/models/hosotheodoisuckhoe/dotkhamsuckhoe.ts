import useInitModel from '@/hooks/useInitModel';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';

export default () => {
	const objInit = useInitModel<DotKhamSucKhoe.IRecord>('dot-kham-suc-khoe');

	return {
		...objInit,
	};
};
