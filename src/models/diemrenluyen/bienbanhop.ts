import useInitModel from '@/hooks/useInitModel';
import { exportBienBanHop } from '@/services/DiemRenLuyen/BienBanHop';
import type { BienBanHopDiemRenLuyen } from '@/services/DiemRenLuyen/BienBanHop/typings';
import fileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<BienBanHopDiemRenLuyen.IRecord>('bien-ban-phieu-diem-ren-luyen');
	const { setLoading } = objInit;
	const [visibleFormYeuCauChinhSua, setVisibleFormYeuCauChinhSua] = useState(false);

	const exportBienBanHopModel = async (idBienBan: string, tenLopHc: string, tenDotChamDiem: string) => {
		setLoading(true);
		const res = await exportBienBanHop(idBienBan);
		fileDownload(res.data, `BienBanHop_${tenLopHc}_${tenDotChamDiem}.docx`);
		setLoading(false);
	};

	return {
		...objInit,
		exportBienBanHopModel,
		visibleFormYeuCauChinhSua,
		setVisibleFormYeuCauChinhSua,
	};
};
