import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import { Input } from 'antd';

const Text = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number; traLoi?: any }) => {
	return props?.question?.loai === ELoaiCauHoiPublic.RENDER_INPUT ||
		props?.question?.loai === ELoaiCauHoiPublic.RENDER_INPUT_RATING ? (
		<Input disabled value={props?.traLoi?.traLoiText} placeholder='Nhập câu trả lời' />
	) : (
		<Input.TextArea disabled value={props?.traLoi?.traLoiText} placeholder='Nhập câu trả lời' rows={2} />
	);
};

export default Text;
