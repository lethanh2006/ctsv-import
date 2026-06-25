import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DotNhapHoc.ISinhVienDotNhapHoc>('dot-nhap-hoc-sinh-vien');

	return {
		...objInit,
	};
};
