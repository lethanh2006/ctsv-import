import useInitModel from '@/hooks/useInitModel';
import { checkPhanQuyen } from '@/services/DiemRenLuyen';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotChamDiemRenLuyen.IRecord>('dot-cham-diem-ren-luyen');
	const [dataPhanQuyen, setDataPhanQuyen] = useState<DotChamDiemRenLuyen.IPhanQuyen>();

	const handleCheckPhanQuyen = async (idDuyet: any, isKhoa: any) => {
		try {
			const res = await checkPhanQuyen();
			if (res) {
				setDataPhanQuyen({ ...res?.data?.data, isPhongCTSV: idDuyet, isKhoa: isKhoa });
			}
		} catch (e) {
			console.log(e);
		}
	};

	return {
		...objInit,
		handleCheckPhanQuyen,
		dataPhanQuyen,
	};
};
