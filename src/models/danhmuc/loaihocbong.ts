import useInitModel from '@/hooks/useInitModel';

export default () => {
	// FIXME: Fix endpoint
	const objInit = useInitModel<LoaiHocBong.IRecord>('');

	return {
		...objInit,
	};
};
