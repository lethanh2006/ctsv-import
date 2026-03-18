import useInitModel from '@/hooks/useInitModel';
import {
	chotDanhSachCanhBao,
	duyetAllCanhBao,
	guiThongBaoHocVu,
	khoiTaoCanhBaoSinhVien,
	tinhLaiCanhBaoSinhVien,
} from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu';
import { type XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import type { ETrangThaiDuyetCanhBao } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<XetHocVu.IRecord>('canh-bao-ket-qua-hoc-tap', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting } = objInit;

	const khoiTaoCanhBaoSinhVienModel = async (hocKyId: string): Promise<XetHocVu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await khoiTaoCanhBaoSinhVien('canh-bao-ket-qua-hoc-tap', hocKyId);
			message.success('Đã khởi tạo thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const tinhLaiCanhBaoSinhVienModel = async (canhBaoId: string): Promise<XetHocVu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await tinhLaiCanhBaoSinhVien('canh-bao-ket-qua-hoc-tap', canhBaoId);
			message.success('Lưu thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const duyetAllCanhBaoSinhVienModel = async (
		maHocKy: string,
		payLoad: {
			trangThai: ETrangThaiDuyetCanhBao;
		},
	): Promise<XetHocVu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await duyetAllCanhBao('canh-bao-ket-qua-hoc-tap', maHocKy, payLoad);
			message.success('Duyệt thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const chotDanhSachCanhBaoSinhVienModel = async (maHocKy: string): Promise<XetHocVu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await chotDanhSachCanhBao('canh-bao-ket-qua-hoc-tap', maHocKy);
			message.success('Chốt danh sách thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const guiThongBaoHocVuModel = async (maHocKy: string): Promise<XetHocVu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await guiThongBaoHocVu('canh-bao-ket-qua-hoc-tap', maHocKy);
			message.success('Gửi thông báo thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		khoiTaoCanhBaoSinhVienModel,
		tinhLaiCanhBaoSinhVienModel,
		duyetAllCanhBaoSinhVienModel,
		chotDanhSachCanhBaoSinhVienModel,
		guiThongBaoHocVuModel,
	};
};
