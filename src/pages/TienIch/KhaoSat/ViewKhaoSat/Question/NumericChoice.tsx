import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Radio } from 'antd';

const NumericChoice = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number; traLoi?: any }) => {
	const arrValue: number[] = [];
	for (let i = props.question?.gioiHanDuoiTuyenTinh; i <= props.question?.gioiHanTrenTuyenTinh; i++) arrValue.push(i);

	return (
		<Radio.Group value={props?.traLoi?.luaChonTuyenTinh} disabled>
			{arrValue.map((item) => (
				<Radio key={item} value={item}>
					{item}
				</Radio>
			))}
		</Radio.Group>
	);
};

export default NumericChoice;
