import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormLichTrinhChung = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.hocphan.noidunghp');
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ deCuongHpId: recDeCuong?._id });

	const onFinish = async (values: HocPhan.ILichTrinhChung) => {
		const payload = { ...values, deCuongHpId: recDeCuong?._id ?? '' };
		if (edit) {
			putModel(record?._id ?? '', payload, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='ten' label='Nội dung' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập nội dung' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<div className='fw500'>Hình thức tổ chức dạy học</div>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='gioLyThuyet'
							label='Lý thuyết (tiêt)'
							rules={[...rules.required, ...rules.number(100, 0, false)]}
						>
							<InputNumber min={0} max={100} placeholder='Số tiết lý thuyết' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='gioBaiTapTL'
							label='Bài tập / Thảo luận (tiết)'
							rules={[...rules.required, ...rules.number(100, 0, false)]}
						>
							<InputNumber min={0} max={100} placeholder='Số tiết bài tập, thảo luận' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='gioThucHanh'
							label='Thực hành (tiết)'
							rules={[...rules.required, ...rules.number(100, 0, false)]}
						>
							<InputNumber min={0} max={100} placeholder='Số tiết thực hành' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='gioTuHoc'
							label='Tự học (tiết)'
							rules={[...rules.required, ...rules.number(100, 0, false)]}
						>
							<InputNumber min={0} max={100} placeholder='Số tiết tự học' style={{ width: '100%' }} />
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

export default FormLichTrinhChung;
