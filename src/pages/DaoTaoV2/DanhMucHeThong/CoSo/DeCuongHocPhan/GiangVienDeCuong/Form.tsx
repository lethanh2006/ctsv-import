import SelectNhanSuDebounce from '@/pages/DaoTaoV2/ToChucNhanSu/NhanSu/Select';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormGiangVienDeCuong = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.hocphan.giangviendecuong',
	);
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');
	const { danhSach: danhSachNhanSu } = useModel('daotaov2.tochucnhansu.nhansu');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	// const [isNhanSu, setIsNhanSu] = useState(true);
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		// setIsNhanSu(!record?._id || !!record?.nhanSuSsoId);
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ deCuongId: recDeCuong?._id });

	const onFinish = async (values: HocPhan.IGiangVienDeCuong) => {
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
					{/* <Col span={24}>
            <Radio.Group
              value={isNhanSu}
              onChange={(e) => setIsNhanSu(e.target.value)}
              style={{ marginBottom: 12 }}
            >
              <Radio value={true}>Giảng viên trong trường</Radio>
              <Radio value={false}>Giảng viên tự do</Radio>
            </Radio.Group>
          </Col> */}

					<Col span={24}>
						<Form.Item name='nhanSuSsoId' label='Giảng viên trong đơn vị' rules={[...rules.required]}>
							{/* <SelectNhanSuTheoDonVi
									maDonVi={recHocPhan?.donVi ?? ''}
									onChange={(val, opt) => setHoTenNhanSu(opt?.hoten)}
								/> */}
							<SelectNhanSuDebounce
								onChange={(val) => {
									const nhanSu = danhSachNhanSu.find((item) => item.ssoId === val);
									form.setFieldsValue({
										hoTen: `${nhanSu?.hoDem ?? ''} ${nhanSu?.ten ?? ''}`,
										chucDanh: nhanSu?.donViViTri?.tenChucVu,
										soDienThoai: nhanSu?.sdtCaNhan,
									});
								}}
								maDonVi={recHocPhan?.maDonVi}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập họ tên giảng viên' disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='chucDanh' label='Chức danh' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập chức danh' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='hocHam' label='Học hàm' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập học hàm' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='hocVi' label='Học vị' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập học vị' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='soDienThoai'
							label='Số điện thoại'
							rules={[...rules.text, ...rules.length(20), ...rules.soDienThoai]}
						>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='diaChi' label='Địa chỉ' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập địa chỉ' />
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

export default FormGiangVienDeCuong;
