import useInitModel from '@/hooks/useInitModel';
import {DotQuyTrinh} from "@/services/QuyTrinh/DotQuyTrinh/typing";

export default () => {
	const objInit = useInitModel<DotQuyTrinh.IRecord>('dot-quy-trinh-dong');

	return {
		...objInit,
	};
};
