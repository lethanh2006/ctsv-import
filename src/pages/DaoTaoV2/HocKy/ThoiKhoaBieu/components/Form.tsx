import MyDatePicker from '@/components/MyDatePicker';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import SelectNhomTietHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/NhomTietHoc/components/SelectNhomTietHoc';
import SelectPhongHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/PhongHoc/components/Select';
import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { ELoaiHinhHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../../HocKy/components/SelectHocKy';
import SelectLopHocPhan from '../../LopHocPhan/components/Select';
import SelectNhanSuLopHocPhan from '../../NhanSuLopHocPhan/components/Select';
import FormGiamSatGiangDuong from './FormGiamSat';

/** Form
 * - Thời khóa biểu
 * - Phân công giảng dạy
 * - Giám sát giảng đường
 * - Thêm mới Thời khóa biểu từ ngoài
 */
const FormThoiKhoaBieu = (props: {
	title?: string;
	fromPhanCong?: boolean;
	isGiamSat?: boolean;
	hasSelectLHP?: boolean;
	getData?: () => void;
	onCancel?: () => void;
	[key: string]: any;
}) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		setFormSubmiting,
		phanCongGiangDayModel,
		visibleForm,
		isView,
	} = useModel('daotaov2.hocky.thoikhoabieu');
	const { record: recLopHp, setRecord: setLopHp } = useModel('daotaov2.hocky.lophocphan');
	const { danhSach: danhSachLopHp } = useModel('daotaov2.hocky.lopthuchanh');
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotaov2.hocky.hocky');
	const tietBatDau = Form.useWatch('tietBatDau', form);
	const { title, fromPhanCong, isGiamSat, hasSelectLHP, onCancel } = props;

	useEffect(() => {
		if (!visibleForm)
			resetFieldsForm(form, {
				maNhomTietHoc: recHocKy?.maNhomTietHoc ?? APP_CONFIG_INIT_MA_NHOM_TIET_HOC,
				loaiHinhHocTap: ELoaiHinhHocTap.LY_THUYET,
			});
		else if (record?._id) form.setFieldsValue(record);
		else
			form.setFieldsValue({
				maNhomTietHoc: recHocKy?.maNhomTietHoc ?? APP_CONFIG_INIT_MA_NHOM_TIET_HOC,
				loaiHinhHocTap: ELoaiHinhHocTap.LY_THUYET,
			});
	}, [record?._id, visibleForm]);

	const getData = () => props.getData && props.getData();

	const onFinish = async (values: ThoiKhoaBieu.IRecord) => {
		if (fromPhanCong) {
			if (record?._id)
				phanCongGiangDayModel({
					updateList: [{ nhanSuSsoId: values.nhanSuSsoId, tkbIds: [record._id] }],
				})
					.then(() => {
						setVisibleForm(false);
						getData();
					})
					.catch((er) => console.log(er));
			return;
		}

		if (!!values.urlBaiHoc && typeof values.urlBaiHoc !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'urlBaiHoc')
				.then((urlBaiHoc) => (values.urlBaiHoc = urlBaiHoc))
				.catch(() => (values.urlBaiHoc = null))
				.finally(() => setFormSubmiting(false));
		}

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, tenLopHocPhan: recLopHp?.ten ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={isGiamSat ? 'Giám sát giảng đường' : `${isView ? 'Chi tiết' : edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical' disabled={isView || isGiamSat}>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					{!hasSelectLHP || edit ? (
						<>
							{!isView && !isGiamSat ? (
								<Descriptions.Item label='Học kỳ' span={2}>{`${recHocKy?.ten}, ${recHocKy?.soTuan ?? 0} tuần, từ ${
									recHocKy?.thoiGianBatDau ? dayjs(recHocKy.thoiGianBatDau).format('DD/MM/YYYY') : ''
								}`}</Descriptions.Item>
							) : null}
							<Descriptions.Item label='Tên học phần'>
								{record?.lopHocPhan?.hocPhan?.ten ?? recLopHp?.hocPhan?.ten}
							</Descriptions.Item>
							<Descriptions.Item label='Tên lớp tín chỉ'>{record?.tenLopHocPhan ?? recLopHp?.ten}</Descriptions.Item>
						</>
					) : null}
				</Descriptions>

				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{hasSelectLHP && !edit ? (
						<>
							<Col span={24} md={12}>
								<Form.Item label='Học kỳ'>
									<SelectHocKy
										value={recHocKy?.ma}
										onChange={(val) => {
											setHocKy(danhSachHocKy.find((item) => item.ma === val));
											form.setFieldsValue({ tenLopHocPhan: undefined });
										}}
										selectMa
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='tenLopHocPhan' label='Lớp tín chỉ' rules={[...rules.required]}>
									<SelectLopHocPhan
										condition={{ maHocKy: recHocKy?.ma }}
										selectMa
										onChange={(val) => setLopHp(danhSachLopHp.find((item) => item.ten === val))}
									/>
								</Form.Item>
							</Col>
						</>
					) : null}

					<Col span={12} md={6}>
						<Form.Item
							name='ngay'
							label='Ngày học'
							rules={[...rules.required, ...rules.sauNgay(recHocKy?.thoiGianBatDau, 'ngày bắt đầu học kỳ')]}
						>
							<MyDatePicker
								disabled={fromPhanCong}
								disabledDate={(cur) => dayjs(cur).isBefore(recHocKy?.thoiGianBatDau, 'd')}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item name='maNhomTietHoc' label='Nhóm tiết học' rules={[...rules.required]}>
							<SelectNhomTietHoc selectMa disabled={fromPhanCong} />
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='tietBatDau'
							label='Tiết bắt đầu'
							rules={[...rules.required, ...rules.number(15, 1, false)]}
						>
							<InputNumber
								min={1}
								max={15}
								step={1}
								style={{ width: '100%' }}
								placeholder='Nhập tiết bắt đầu'
								onChange={(val) => {
									form.validateFields(['tietKetThuc']);
								}}
								disabled={fromPhanCong}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='tietKetThuc'
							label='Tiết kết thúc'
							rules={[...rules.required, ...rules.number(15, tietBatDau, false)]}
						>
							<InputNumber
								min={tietBatDau}
								max={15}
								step={1}
								style={{ width: '100%' }}
								placeholder='Nhập tiết kết thúc'
								disabled={fromPhanCong}
							/>
						</Form.Item>
					</Col>

					<Col span={2} md={6}>
						<Form.Item name='loaiHinhHocTap' label='Loại hình' rules={[...rules.required]}>
							<Select
								placeholder='Chọn loại hình học tập'
								options={Object.values(ELoaiHinhHocTap).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
								disabled={fromPhanCong}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item name='phongHoc' label='Phòng học'>
							<SelectPhongHoc allowClear selectMa disabled={fromPhanCong} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='nhanSuSsoId'
							label='Giảng viên'
							extra={!isView && !isGiamSat && 'Chọn từ danh sách nhân sự lớp tín chỉ'}
						>
							<SelectNhanSuLopHocPhan lopHocPhanId={record?.lopHocPhan?._id ?? recLopHp?._id} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='tieuDeBaiHoc' label='Tiêu đề bài học' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tiêu đề bài học' disabled={fromPhanCong} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='noiDungBaiHoc' label='Nội dung bài học' rules={[...rules.text, ...rules.length(5000)]}>
							<Input.TextArea placeholder='Nhập nội dung bài học' rows={3} disabled={fromPhanCong} />
						</Form.Item>
					</Col>

					{!fromPhanCong ? (
						<Col xs={24}>
							<FormItemUrlOrUpload
								form={form}
								initValue={record?.urlBaiHoc}
								field='urlBaiHoc'
								accept='.docx, .pdf, .xlsx, .xls, .doc'
							/>
						</Col>
					) : null}
				</Row>

				{!isView && !isGiamSat ? (
					<div className='form-footer'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới ' : 'Lưu lại'}
						</Button>
						<Button
							onClick={() => {
								setVisibleForm(false);
								if (onCancel) onCancel();
							}}
						>
							Huỷ
						</Button>
					</div>
				) : null}
			</Form>

			{isGiamSat ? <FormGiamSatGiangDuong {...props} /> : null}
		</Card>
	);
};

export default FormThoiKhoaBieu;
