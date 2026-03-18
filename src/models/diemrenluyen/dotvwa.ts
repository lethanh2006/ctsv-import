import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DotChamDiemRenLuyen.IRecordVWA>('drl/dot-drl');

	return {
		...objInit,
	};
};
