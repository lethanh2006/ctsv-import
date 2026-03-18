import useInitModel from '@/hooks/useInitModel';
import { getDataThongKeExcel } from '@/services/QuyTrinhDong/ThongKe/thongke';
import type { ThongKeQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/typings';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<ThongKeQuyTrinhDong.IRecord>('thong-ke-quy-trinh-dong');
	const { setLoading } = objInit;

	const getDataThongKeExcelModel = async (
		tenThongKe: string,
		payload?: { thongKeQuyTrinhDongIds?: string[]; start?: string; end?: string },
	) => {
		try {
			setLoading(true);
			const res = await getDataThongKeExcel(payload);
			fileDownload(res.data, `${tenThongKe}.xlsx`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getDataThongKeExcelModel,
	};
};
