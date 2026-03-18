import useInitModel from '@/hooks/useInitModel';
import type { BieuMau } from '@/services/DiemRenLuyen/BieuMau/typing';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<BieuMau.IRecordVWA>('drl/mau-drl');
	const [recordTieuChi, setRecordTieuChi] = useState<BieuMau.TieuChiDanhGia>();
	const [recordQuyTacXepLoai, setRecordQuyTacXepLoai] = useState<BieuMau.QuyTacXepLoai>();
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinh.TruongThongTin>();
	const [recordCot, setRecordCot] = useState<LoaiHinh.Cot>();
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

	return {
		...objInit,
		recordTieuChi,
		setRecordTieuChi,
		recordCauHinh,
		setRecordCauHinh,
		visiblePreview,
		setVisiblePreview,
		recordCot,
		setRecordCot,
		recordQuyTacXepLoai,
		setRecordQuyTacXepLoai,
	};
};
