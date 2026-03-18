import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<LoaiKhenThuong.IRecord>('nguon-kinh-phi');

	return {
		...objInit,
	};
};
