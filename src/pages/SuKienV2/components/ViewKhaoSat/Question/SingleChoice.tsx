import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import rules from '@/utils/rules';
import { Form, Input, Radio, type FormInstance } from 'antd';

const SingleChoice = (props: { question: BieuMau.CauHoi; form: FormInstance; disabled?: boolean }) => {
	const check = Form.useWatch(props.question._id);
	const { disabled } = props;

	return (
		<>
			<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={props.question._id}>
				<Radio.Group>
					{props.question?.luaChon?.map((item) => (
						<div key={item._id}>
							<Radio  disabled={disabled} value={item.noiDung}>{item.noiDung}</Radio>
						</div>
					))}
					{props.question.cauTraLoiKhac ? (
						<Radio disabled={disabled} value='traLoiKhac'>
							Câu trả lời khác
						</Radio>
					) : null}
				</Radio.Group>
			</Form.Item>

			{check === 'traLoiKhac' ? (
				<Form.Item
					name={`${props.question._id}_otherAnswer`}
					rules={props.question.batBuoc ? [...rules.required] : []}
					label='Câu trả lời khác'
				>
					<Input readOnly={disabled} placeholder='Nhập câu trả lời khác' />
				</Form.Item>
			) : null}
		</>
	);
};

export default SingleChoice;
