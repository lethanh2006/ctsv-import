import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<TietHoc.IRecordCoSo>('tiet-hoc', undefined, undefined, ipDaoTao, { tietHoc: 1 });
	// const [danhSachTietHoc, setDanhSachTietHoc] = useState<TietHoc.IRecordCoSo[]>([]);
	// const [editTietHoc, setEditTietHoc] = useState<boolean>(false);
	// const [visibleFormTietHoc, setVisibleFormTietHoc] = useState<boolean>(false);
	// const [recordTietHoc, setRecordTietHoc] = useState<TietHoc.IRecordCoSo>();
	// const [indexTietHoc, setIndexTietHoc] = useState<number>();

	return {
		...objInit,
		// danhSachTietHoc,
		// setDanhSachTietHoc,
		// editTietHoc,
		// setEditTietHoc,
		// visibleFormTietHoc,
		// setVisibleFormTietHoc,
		// recordTietHoc,
		// setRecordTietHoc,
		// indexTietHoc,
		// setIndexTietHoc,
	};
};
