import useInitModel from '@/hooks/useInitModel';
import { duyetYKienKeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import type { ETrangThaiYKienKeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/constant';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<KeHoachNamHoc.YKienKeHoachNamHoc>('y-kien-khnh', undefined, undefined, ipDaoTao);
	const { setLoading } = objInit;

	const duyetYKienKeHoachNamHocModel = async (
		yKienId: string,
		payLoad: {
			trangThai: ETrangThaiYKienKeHoachNamHoc;
		},
	): Promise<KeHoachNamHoc.YKienKeHoachNamHoc> => {
		setLoading(true);

		try {
			const res = await duyetYKienKeHoachNamHoc(yKienId, payLoad);
			message.success('Duyệt thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		duyetYKienKeHoachNamHocModel,
	};
};
