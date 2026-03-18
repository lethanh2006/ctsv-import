import SelectNhomTietHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/NhomTietHoc/components/SelectNhomTietHoc';
import SelectPhongHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/PhongHoc/components/Select';
import { ELoaiHinhHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row, Select, Input } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectNhanSuLopHocPhan from '../../NhanSuLopHocPhan/components/Select';
import GroupTagTuanHoc from './GroupTagTuanHoc';

/** Form Lịch học tuần dùng cho Thời khóa biểu, Phân công giảng dạy & Xếp lịch */
const FormLichHocTuan = (props: { thu?: string; fromPhanCong?: boolean; maPhong?: string }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recLopHp } = useModel('daotaov2.hocky.lophocphan');
	const [dayOfWeek, setDayOfWeek] = useState<number>();
	const { fromPhanCong, maPhong } = props;

	useEffect(() => {
		setDayOfWeek(props?.thu ? +props?.thu - 1 : undefined);
	}, [props?.thu]);

	return (
		<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
			<Col span={24}>
				<Form.Item name='danhSachTuanHoc' label='Danh sách tuần học' rules={[...rules.required]}>
					<GroupTagTuanHoc
						soTuan={recHocKy?.soTuan ?? 0}
						thoiGianBatDau={recHocKy?.thoiGianBatDau}
						dayOfWeek={dayOfWeek}
						fromPhanCong={fromPhanCong}
					/>
				</Form.Item>
			</Col>

			<Col span={12} md={6}>
				<Form.Item name='thu' label='Thứ' rules={[...rules.required]}>
					<Select
						options={_.range(1, 8).map((day) => ({
							key: day,
							value: day.toString(),
							label: day === 7 ? 'Chủ nhật' : `Thứ ${day + 1}`,
						}))}
						onChange={(val) => setDayOfWeek(val ? +val - 1 : undefined)}
						optionFilterProp='label'
						showSearch
						placeholder='Chọn thứ'
						disabled={fromPhanCong}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={6}>
				<Form.Item name='maNhomTietHoc' label='Nhóm tiết học' rules={[...rules.required]}>
					<SelectNhomTietHoc selectMa disabled={fromPhanCong} />
				</Form.Item>
			</Col>
			<Col span={12} md={6}>
				<Form.Item name='tietBatDau' label='Tiết bắt đầu' rules={[...rules.required, ...rules.number(15, 1, false)]}>
					<InputNumber
						min={1}
						max={15}
						step={1}
						style={{ width: '100%' }}
						placeholder='Nhập tiết bắt đầu'
						disabled={fromPhanCong}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={6}>
				<Form.Item name='soTiet' label='Số tiết' rules={[...rules.required, ...rules.number(5, 1, false)]}>
					<InputNumber
						min={1}
						max={5}
						step={1}
						style={{ width: '100%' }}
						placeholder='Nhập số tiết'
						disabled={fromPhanCong}
					/>
				</Form.Item>
			</Col>

			<Col span={2} md={6}>
				<Form.Item
					name='loaiHinhHocTap'
					label='Loại hình'
					rules={[...rules.required]}
					initialValue={ELoaiHinhHocTap.LY_THUYET}
				>
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
					{maPhong ? (
						<Input value={maPhong} disabled />
					) : (
						<SelectPhongHoc selectMa disabled={fromPhanCong} allowClear />
					)}
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='nhanSuSsoId' label='Giảng viên'>
					<SelectNhanSuLopHocPhan lopHocPhanId={recLopHp?._id} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormLichHocTuan;
