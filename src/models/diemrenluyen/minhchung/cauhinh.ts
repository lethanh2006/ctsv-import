import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';
import type { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';

export default () => {
	const objInit = useInitModel<MinhChungDrl.IBieuMau>('cau-hinh-minh-chung');
	const [formValues, setFormValues] = useState<any>();

	return {
		...objInit,
		formValues,
		setFormValues,
	};
};
