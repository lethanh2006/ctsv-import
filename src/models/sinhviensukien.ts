import useInitModel from '@/hooks/useInitModel';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SuKienV2.IRecordSinhVienSuKien>('sv-su-kien');
	const [dataTraLoiSinhVien, setDataTraLoiSinhVien] = useState<SuKienV2.IDataTraLoiSinhVien>();

	return {
		...objInit,
		dataTraLoiSinhVien,
		setDataTraLoiSinhVien,
	};
};
