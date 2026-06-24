import useInitModel from '@/hooks/useInitModel';
import type { MiniApp } from '@/services/CauHinh/MiniApp/typing';

export default () => {
	const objInit = useInitModel<MiniApp.IRecord>('miniapp');

	return {
		...objInit,
	};
};
