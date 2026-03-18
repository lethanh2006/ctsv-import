import type { PhongHoc } from '@/services/DaoTaoV2/DanhMucHeThong/PhongHoc/typing';
import { ELoaiPhongHoc, ETrangThaiPhong } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectToaNha from '../../ToaNha/components/Select';

const FormPhongHoc = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.phonghoc');
	const { record: recToaNha, setRecord: setToaNha, danhSach: danhSachToaNha } = useModel('daotaov2.danhmuc.toanha');
	const { title } = props;
	const maToaNha: string = Form.useWatch('maToaNha', form);
	const soTang: number = Form.useWatch('soTang', form);
	const soPhong: number = Form.useWatch('soPhong', form);
	const sucChuaHoc: number = Form.useWatch('sucChuaHoc', form);
	const loaiPhong: ELoaiPhongHoc = Form.useWatch('loaiPhong', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else form.setFieldsValue({ loaiPhong: ELoaiPhongHoc.LY_THUYET, trangThai: ETrangThaiPhong.HOAT_DONG });
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (maToaNha && soPhong && !edit) form.setFieldsValue({ ma: `${maToaNha}_${soPhong}` });
	}, [maToaNha, soPhong]);

	useEffect(() => {
		if (!edit && sucChuaHoc) form.setFieldsValue({ sucChuaThi: Math.round(sucChuaHoc / 2) });
	}, [sucChuaHoc]);

	useEffect(() => {
		if (!edit && soPhong && maToaNha && soTang)
			form.setFieldsValue({ ten: `Phòng ${soPhong ?? ''} - Tầng ${soTang ?? ''} - ${maToaNha ?? ''}` });
	}, [soPhong, maToaNha, soTang]);

	const onFinish = async (values: PhongHoc.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={8}>
						<Form.Item name='maToaNha' label='Tòa nhà'>
							<SelectToaNha selectMa onChange={(val) => setToaNha(danhSachToaNha.find((item) => item.ma === val))} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='soTang' label='Tầng thứ' rules={[...rules.number(recToaNha?.soTang ?? 50, 0, false)]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập tầng thứ' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='soPhong' label='Số phòng' rules={[...rules.text, ...rules.length(10)]}>
							<Input placeholder='Nhập số phòng' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='ma' label='Mã phòng' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã phòng' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='ten' label='Tên phòng' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên phòng' />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name='loaiPhong' label='Loại phòng' rules={[...rules.required]}>
							<Select
								placeholder='Chọn loại phòng'
								options={Object.values(ELoaiPhongHoc).map((item) => ({ key: item, value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]}>
							<Select
								placeholder='Chọn trạng thái'
								options={Object.values(ETrangThaiPhong).map((item) => ({ key: item, value: item, label: item }))}
							/>
						</Form.Item>
					</Col>

					{loaiPhong === ELoaiPhongHoc.PHONG_HOP ? (
						<Col span={12}>
							<Form.Item name='sucChua' label='Sức chứa' rules={[...rules.required, ...rules.number(500, 1, false)]}>
								<InputNumber placeholder='Nhập sức chứa' style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					) : (
						<>
							<Col span={12}>
								<Form.Item name='sucChuaHoc' label='Sức chứa học' rules={[...rules.number(500, 1, false)]}>
									<InputNumber placeholder='Nhập sức chứa học' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='sucChuaThi' label='Sức chứa thi' rules={[...rules.number(500, 1, false)]}>
									<InputNumber placeholder='Nhập sức chứa thi' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</>
					)}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormPhongHoc;
