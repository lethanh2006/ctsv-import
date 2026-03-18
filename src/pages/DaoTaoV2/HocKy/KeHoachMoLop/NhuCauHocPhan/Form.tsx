import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { ELoaiNhuCauHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhoaNganhDotDangKy = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.hocky.nhucauhocphan');
	const { record: recNhuCau } = useModel('daotaov2.hocky.dangkynhucau');
	const title = props?.title ?? '';

	const getData = () => {
		if (props.getData) props.getData();
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DangKyNhuCau.INhuCauHocPhan) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, banDkNhuCauId: recNhuCau?._id ?? '' };
			postModel(valuesFinal, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='loaiNhuCauHocPhan' label='Loại nhu cầu học phần' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiNhuCauHocPhan).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
								placeholder='Chọn loại nhu cầu học phần'
							/>
						</Form.Item>
					</Col>

					{/* TODO: Hệ thống tự động gợi ý các học phần thuộc loại học phần tương ứng */}
					<Col xs={24}>
						<Form.Item name='hocPhanFk' label='Học phần' rules={[...rules.required]}>
							<SelectHocPhan selectMa />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKhoaNganhDotDangKy;
