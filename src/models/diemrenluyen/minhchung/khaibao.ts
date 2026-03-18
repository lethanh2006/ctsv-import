import useInitModel from '@/hooks/useInitModel';
import { getTemplateImportMinhChung, importMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KhaiBaoDRL.IRecord>('khai-bao-minh-chung');
	const { setLoading } = objInit;
	const [visibleFormImport, setVisibleFormImport] = useState(false);
	const getTemplateImportMinhChungModel = async (idCauHinhMinhChung: string, tenCauHinhMinhChung: string) => {
		setLoading(true);
		const res = await getTemplateImportMinhChung(idCauHinhMinhChung);
		fileDownload(res.data, `${tenCauHinhMinhChung}.xlsx`);
		setLoading(false);
	};

	const importMinhChungModel = async (
		idDot: string,
		idCauHinh: string,
		payload: { file: any },
		callback?: () => void,
	) => {
		setLoading(true);
		const res = await importMinhChung(idDot, idCauHinh, payload);
		message.success('Import thành công');
		setLoading(false);
		setVisibleFormImport(false);
		if (callback) {
			callback();
		}
		return res;
	};

	return {
		...objInit,
		getTemplateImportMinhChungModel,
		importMinhChungModel,
		visibleFormImport,
		setVisibleFormImport,
	};
};
