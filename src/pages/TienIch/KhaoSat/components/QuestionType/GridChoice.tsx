import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import { useIntl } from 'umi';
import SingleChoice from './SingleChoice';

const GridChoice = (props: { name: number }) => {
	const intl = useIntl();

	return (
		<Row gutter={[12, 0]}>
			<Col span={12}>
				<Form.List
					name={[props.name, 'luaChonHang']}
					rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.gridchoice.vali' })),
									);
								}
								return '';
							},
						},
					]}
				>
					{(fields, { add, remove }, { errors }) => {
						return (
							<>
								{fields.map((field, index) => (
									<SingleChoice key={field.key} type='grid' index={index} remove={remove} fieldName={field.name} />
								))}
								<Form.ErrorList errors={errors} />
								<Button size='small' type='primary' onClick={() => add()} icon={<PlusOutlined />}>
									{intl.formatMessage({ id: 'questionsmanagement.cauhinh.gridchoice.themhang' })}
								</Button>
							</>
						);
					}}
				</Form.List>
			</Col>

			<Col span={12}>
				<Form.List
					name={[props.name, 'luaChonCot']}
					rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.gridchoice.valicot' })),
									);
								}
								return '';
							},
						},
					]}
				>
					{(fields, { add, remove }, { errors }) => {
						return (
							<>
								{fields.map((field, index) => (
									<SingleChoice key={field.key} type='grid' index={index} remove={remove} fieldName={field.name} />
								))}
								<Form.ErrorList errors={errors} />
								<Button size='small' type='primary' onClick={() => add()} icon={<PlusOutlined />}>
									{intl.formatMessage({ id: 'questionsmanagement.cauhinh.gridchoice.themcot' })}
								</Button>
							</>
						);
					}}
				</Form.List>
			</Col>
		</Row>
	);
};

export default GridChoice;
