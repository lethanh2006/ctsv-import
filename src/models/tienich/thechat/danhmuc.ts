import useInitModel from '@/hooks/useInitModel';
import type { TheChat } from '@/services/TienIch/TheChat/typing';

export default () => {
	const objInit = useInitModel<TheChat.IDanhMucTheChat>('danh-muc-the-chat', undefined, undefined, undefined, {
		ma: 1,
	});

	return {
		...objInit,
	};
};
