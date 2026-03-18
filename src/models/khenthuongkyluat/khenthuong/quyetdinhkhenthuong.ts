import useInitModel from '@/hooks/useInitModel';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';

export default () => {
	const objInit = useInitModel<QuyetDinhKhenThuong.IRecord>('quyet-dinh-khen-thuong');

	const { handleEdit, handleView } = objInit;

	const handleView_: typeof handleView = (record) => {
		handleView(record);
		// if (record) {
		// 	getByIdModel(record?._id);
		// }
	};
	const handleEdit_: typeof handleEdit = (record) => {
		handleEdit(record);
		// if (record) {
		// 	getByIdModel(record?._id);
		// }
	};

	return {
		...objInit,
		handleView: handleView_,
		handleEdit: handleEdit_,
	};
};
