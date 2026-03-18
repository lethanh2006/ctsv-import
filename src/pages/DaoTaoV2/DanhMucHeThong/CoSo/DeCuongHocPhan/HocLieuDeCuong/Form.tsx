import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { ELoaiHocLieu } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Segmented, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocLieuThuVien from '../../HocLieu/components/SelectThuVien';

const FormHocLieuDeCuong = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.hocphan.hoclieudecuong',
	);
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');
	const [selectThuVien, setSelectThuVien] = useState<HocLieu.IRecordThuVien>();
	const { title } = props;
	const loaiHocLieu: ELoaiHocLieu = Form.useWatch('loaiHocLieu', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form, { loaiHocLieu: ELoaiHocLieu.VAN_BAN });
		else if (record?._id) form.setFieldsValue({ ...record, idThuVien: record.tieuDe });
		else form.setFieldsValue({ loaiHocLieu: ELoaiHocLieu.VAN_BAN });
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ deCuongId: recDeCuong?._id });

	const onChangeThuVien = (item?: HocLieu.IRecordThuVien) => {
		setSelectThuVien(item);
		form.setFieldsValue({
			tieuDe: item?.product_title,
			moTa: item?.product_description,
			tacGia: item?.author,
			namXuatBan: item?.publish_year ? +item.publish_year : null,
			tenNhaXuatBan: item?.publish_name,
		});
	};

	const onFinish = async (values: HocPhan.IHocLieuDeCuong & { idThuVien?: any }) => {
		delete values.idThuVien;
		if (selectThuVien?.ID) {
			values.idTaiLieuThuVien = selectThuVien.ID;
			values.loaiTaiLieuThuVien = selectThuVien.type_of_book;
			values.maTaiLieuThuVien = selectThuVien.product_code;
			values.url = selectThuVien.link_opac;
		}

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel({ ...values, deCuongId: recDeCuong?._id ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='loaiHocLieu' label='Loại học liệu'>
							<Segmented options={Object.values(ELoaiHocLieu)} />
						</Form.Item>
					</Col>

					{loaiHocLieu === ELoaiHocLieu.VAN_BAN ? (
						<Col span={24}>
							<Form.Item name='idThuVien' label='Học liệu thư viện'>
								<SelectHocLieuThuVien onChange={onChangeThuVien} />
							</Form.Item>
						</Col>
					) : null}

					{/* <Col xs={24}>
						<Form.Item name='hocLieuId' label='Học liệu' rules={[...rules.required]}>
							<SelectHocLieu />
						</Form.Item>
					</Col> */}
					<Col span={24}>
						<Form.Item name='tieuDe' label='Tiêu đề' rules={[...rules.required, ...rules.text, ...rules.length(500)]}>
							<Input.TextArea rows={2} placeholder='Nhập tiêu đề' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(2000)]}>
							<Input.TextArea rows={3} placeholder='Nhập mô tả' />
						</Form.Item>
					</Col>

					{loaiHocLieu === ELoaiHocLieu.VAN_BAN ? (
						<>
							<Col span={24} md={12}>
								<Form.Item
									name='tacGia'
									label='Tác giả'
									rules={[...rules.required, ...rules.text, ...rules.length(200)]}
								>
									<Input placeholder='Nhập tên tác giả' />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='tenNhaXuatBan' label='Nhà xuất bản' rules={[...rules.text, ...rules.length(200)]}>
									<Input placeholder='Nhập tên nhà xuất bản' />
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item name='namXuatBan' label='Năm xuất bản' rules={[...rules.number(3000, 1900, false)]}>
									<InputNumber placeholder='Nhập năm xuất bản' style={{ width: '100%' }} min={1900} max={3000} />
								</Form.Item>
							</Col>
						</>
					) : (
						<Col span={24} md={12}>
							<Form.Item name='url' label='Đường dẫn' rules={[...rules.httpLink, ...rules.required]}>
								<Input placeholder='Nhập đường dẫn' />
							</Form.Item>
						</Col>
					)}

					<Col span={24} md={12}>
						<Form.Item name='batBuoc' label='Là học liệu bắt buộc' valuePropName='checked'>
							<Switch />
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

export default FormHocLieuDeCuong;
