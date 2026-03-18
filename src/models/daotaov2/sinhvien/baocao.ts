
import fileDownload from 'js-file-download';
import { useState } from 'react';
import {exportSoLuongSinhVienLhc} from "@/services/DaoTaoV2/SinhVien";

export default () => {
	const [loading, setLoading] = useState<boolean>(false);




	const reportSoLuongSinhVienLhcModel = async (params: {
		maTrinhDo?: string;
		maHinhThuc?: string;
		maHocKy: number;
	}): Promise<any> => {
		setLoading(true);
		try {
			const res = await exportSoLuongSinhVienLhc(params);
			fileDownload(res.data as ArrayBuffer, 'TK Số lượng sinh viên LHC.xlsx');
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		setLoading,
		reportSoLuongSinhVienLhcModel,
	};
};
