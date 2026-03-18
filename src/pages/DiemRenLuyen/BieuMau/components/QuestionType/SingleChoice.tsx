import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useIntl } from 'umi';

const SingleChoice = (props: {
	index: number;
	type?: string;
	remove: (index: number | number[]) => void;
	fieldName: number;
}) => {
	const intl = useIntl();
	return (
		<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<div className='width-select-custom'>
				<Form.Item
					name={[props.index, 'noiDung']}
					rules={[...rules.required]}
					label={props.type !== 'grid' ? `${intl.formatMessage({ id: 'bieumau.luachon' })} ${props.index + 1}` : false}
				>
					<Input
						placeholder={
							props.type !== 'grid'
								? `${intl.formatMessage({ id: 'bieumau.noidungcautraloi' })} ${props.index + 1}`
								: intl.formatMessage({ id: 'bieumau.nhapnoidung' })
						}
					/>
				</Form.Item>
			</div>
			<Button
				danger
				type='link'
				title={intl.formatMessage({ id: 'bieumau.action.xoadapan' })}
				icon={<DeleteOutlined />}
				onClick={() => props.remove(props.fieldName)}
				style={{ marginBottom: 10 }}
			/>
		</div>
	);
};

export default SingleChoice;
