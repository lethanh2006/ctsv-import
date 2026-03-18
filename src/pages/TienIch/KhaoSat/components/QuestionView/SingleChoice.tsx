import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Radio } from 'antd';
import { useIntl } from 'umi';

const SingleChoice = (props: {
	luaChon: { _id: string; noiDung: string; dung?: boolean }[];
	dapAn?: string[];
	question: BieuMau.CauHoi;
}) => {
	const intl = useIntl();

	return (
		<Radio.Group value={props?.luaChon.find((o) => o.dung)?._id}>
			{props.luaChon?.map((item) => (
				<div key={item._id}>
					<Radio checked={item.dung} value={item._id}>
						{item.noiDung}
					</Radio>
				</div>
			))}
			{props.question.cauTraLoiKhac ? (
				<Radio value='traLoiKhac'>
					{intl.formatMessage({ id: 'questionsmanagement.chitiet.singlechoice.cautlkhac' })}
				</Radio>
			) : null}
		</Radio.Group>
	);
};

export default SingleChoice;
