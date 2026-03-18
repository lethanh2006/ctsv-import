import { ENguonDot, EPhanHe, MapKeyPhanHe } from '@/services/QuyTrinh/constant';
import rules from '@/utils/rules';
import { useModel } from 'umi';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect } from 'react';
interface IProps {
	form: FormInstance;
}
const DotQuyTrinh = (props: IProps) => {
	const { form } = props;
	const { editBoPhan, record } = useModel('quytrinh.quanlyquytrinh');

	useEffect(() => {
		if (record?.cauHinhDotQuyTrinh) {
			form.setFieldsValue({ cauHinhDotQuyTrinh: { ...record?.cauHinhDotQuyTrinh } });
		} else {
		}
	}, [editBoPhan, record]);

	return (
		// <Card title={`${editBoPhan ? 'Chỉnh sửa' : 'Thêm mới'} đơn vị xử lý`}>
		<Form layout={'vertical'} form={form}>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label={'Nguồn đợt'} name={['cauHinhDotQuyTrinh', 'nguonDot']} rules={[...rules.required]}>
						<Select
							placeholder={'Chọn nguồn đợt'}
							style={{ width: '100%' }}
							options={Object.values(ENguonDot).map((val) => {
								return {
									value: val,
									label: val,
								};
							})}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={['cauHinhDotQuyTrinh', 'phanHeNguon']} label={'Phân hệ nguồn'}>
						<Select
							placeholder={'Chọn nguồn đợt'}
							style={{ width: '100%' }}
							options={Object.values(EPhanHe).map((val) => {
								return {
									value: val,
									label: MapKeyPhanHe?.[val],
								};
							})}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={['cauHinhDotQuyTrinh', 'internalPath']} label={'Internal path'}>
						<Input placeholder={'Nhập internal path'} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
		// </Card>
	);
};
export default DotQuyTrinh;
