import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Checkbox } from 'antd';
import { useIntl } from 'umi';

const MultipleChoice = (props: {
	luaChon: { _id: string; noiDung: string }[];
	dapAn?: string[];
	question: BieuMau.CauHoi;
}) => {
	const intl = useIntl();

	return (
		<>
			<Checkbox.Group value={props?.dapAn}>
				{props.luaChon?.map((item) => (
					<div key={item._id}>
						<Checkbox value={item._id}>{item.noiDung}</Checkbox>
					</div>
				))}
				{props.question.cauTraLoiKhac ? (
					<Checkbox value='traLoiKhac'>
						{intl.formatMessage({ id: 'questionsmanagement.chitiet.muntiplechoice.cautlkhac' })}
					</Checkbox>
				) : null}
			</Checkbox.Group>
		</>
	);
};

export default MultipleChoice;
