import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { tinhDiemSinhVien } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy';
import { KetQuaHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KetQuaHocKy.IRecord>('kqht-hoc-ky', undefined, undefined, ipDaoTao);
	const [danhSachTongQuan, setDanhSachTongQuan] = useState<KetQuaHocKy.IRecord[]>([]);
	const { getAllModel, setRecord, formSubmiting, setFormSubmiting } = objInit;

	const getKetQuaHkSvModel = async (sinhVienSsoId: string, maKhoaNganh: string, hocKyList?: string[]) => {
		if (!sinhVienSsoId || !maKhoaNganh) return Promise.reject('Invalid sinhvien');
		return await getAllModel(
			undefined,
			{ maHocKy: 1 },
			{ sinhVienSsoId, maKhoaNganh },
			hocKyList?.length ? [{ field: 'maHocKy', values: hocKyList, operator: EOperatorType.INCLUDE }] : undefined,
		).then((res) => {
			setRecord(res.at(-1));
			return res;
		});
	};

	const tinhDiemSinhVienModel = async (sinhVienSsoId: string) => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await tinhDiemSinhVien(sinhVienSsoId);
			message.success('Thao tác thành công');
			return res.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};
	return {
		...objInit,
		danhSachTongQuan,
		setDanhSachTongQuan,
		getKetQuaHkSvModel,
		tinhDiemSinhVienModel,
	};
};
