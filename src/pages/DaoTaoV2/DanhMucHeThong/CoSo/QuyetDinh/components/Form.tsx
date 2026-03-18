import MyDatePicker from '@/components/MyDatePicker';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { Col, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const FormQuyetDinh = (props: { isSinhVien?: boolean; loaiQuyetDinh?: ELoaiQuyetDinh }) => {
	const { isSinhVien, loaiQuyetDinh } = props;
	const { record, edit } = useModel('daotaov2.quyetdinh.quyetdinh');
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { record: recHocKy, setRecord: setHocKy, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const [form] = Form.useForm();

	return (
		<>
			<Col xs={24} md={12}>
				<Form.Item
					name={isSinhVien ? ['quyetDinh', 'maHocKy'] : 'maHocKy'}
					label='Học kỳ ra quyết định'
					rules={[...rules.required]}
				>
					<SelectHocKy
						selectMa
						condition={
							loaiQuyetDinh === ELoaiQuyetDinh.SONG_NGANH || loaiQuyetDinh === ELoaiQuyetDinh.TOT_NGHIEP
								? { namHocId: recNamHoc?._id }
								: undefined
						}
						onChange={(val) => setHocKy(danhSachHocKy.find((item) => item.ma === val))}
					/>
				</Form.Item>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item
					name={isSinhVien ? ['quyetDinh', 'loai'] : 'loai'}
					label='Loại quyết định'
					rules={[...rules.required]}
				>
					<Select
						disabled={isSinhVien || edit}
						placeholder='Chọn loại quyết định'
						options={Object.values(ELoaiQuyetDinh).map((item) => ({
							key: item,
							label: item,
							value: item,
						}))}
					/>
				</Form.Item>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item
					name={isSinhVien ? ['quyetDinh', 'soQuyetDinh'] : 'soQuyetDinh'}
					label='Số quyết định'
					rules={[...rules.required]}
				>
					<Input placeholder='Nhập số quyết định' />
				</Form.Item>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item
					name={isSinhVien ? ['quyetDinh', 'ngayBanHanh'] : 'ngayBanHanh'}
					label='Ngày ban hành'
					rules={
						recHocKy?.thoiGianBatDau
							? [...rules.sauNgay(recHocKy?.thoiGianBatDau, 'Thời gian bắt đầu năm học')]
							: undefined
					}
				>
					<MyDatePicker
						format='DD/MM/YYYY'
						disabledDate={(cur) => !!recHocKy?.thoiGianBatDau && dayjs(cur).isBefore(recHocKy?.thoiGianBatDau)}
					/>
				</Form.Item>
			</Col>
			<Col xs={24} md={24}>
				<Form.Item name={isSinhVien ? ['quyetDinh', 'noiDung'] : 'noiDung'} label='Nội dung'>
					<Input.TextArea rows={3} placeholder='Nhập nội dung quyết định' />
				</Form.Item>
			</Col>
			<Col xs={24}>
				<FormItemUrlOrUpload
					form={form}
					field={isSinhVien ? 'quyetDinh.url' : 'url'}
					initValue={isSinhVien ? undefined : record?.url}
				/>
			</Col>
		</>
	);
};

export default FormQuyetDinh;
