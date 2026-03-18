import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form, Modal, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyetDinhSV from './Form';
import ExpandText from '@/components/ExpandText';

const FormTableSinhVien = (props: { isThoiHoc: boolean; form: FormInstance }) => {
	const { isThoiHoc, form } = props;
	const { danhSach, visibleForm, selectedIds } = useModel(isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu');
	const { visibleForm: visibleSinhVien, setVisibleForm: setVisibleSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	// Danh sách sinh viên local để thêm, xóa
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<QuyetDinh.ISinhVienBaoLuuThoiHoc[]>([]);
	const thoiGianBatDauBaoLuu = Form.useWatch('danhSachSinhVien', form)?.map(
		(item: QuyetDinh.ISinhVienBaoLuuThoiHoc) => item.thoiGianBatDau,
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			const temp = danhSach.filter((item) => selectedIds?.includes(item._id));
			setDanhSachSinhVien(temp);
			form.setFieldsValue({ danhSachSinhVien: temp });
		}
	}, [visibleForm]);

	const handleLoaiBo = (rec: QuyetDinh.ISinhVienBaoLuuThoiHoc) => {
		const newDSSV = [...danhSachSinhVien].filter((item) => item.maSinhVien !== rec?.maSinhVien);
		setDanhSachSinhVien(newDSSV);
		form.setFieldsValue({ danhSachSinhVien: newDSSV });
	};

	const onFinish = async (val: QuyetDinh.ISinhVienBaoLuuThoiHoc) => {
		const updatedDanhSachSinhVien = [...danhSachSinhVien, val];
		setDanhSachSinhVien(updatedDanhSachSinhVien);
		form.setFieldsValue({ danhSachSinhVien: updatedDanhSachSinhVien });
		setVisibleSinhVien(false);
	};

	const columns: IColumn<QuyetDinh.ISinhVienBaoLuuThoiHoc & { index: number }>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			render: (val, rec) => (
				<>
					{val}
					<Form.Item name={['danhSachSinhVien', rec.index - 1, 'maSinhVien']} hidden />
				</>
			),
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
		},
		{
			title: 'Thời gian thôi học',
			dataIndex: 'thoiGianHieuLuc',
			width: 120,
			render: (val, rec) => (
				<Form.Item name={['danhSachSinhVien', rec.index - 1, 'thoiGianHieuLuc']} rules={[...rules.required]}>
					<MyDatePicker />
				</Form.Item>
			),

			hide: !isThoiHoc,
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			render: (val, rec) => (
				<Form.Item name={['danhSachSinhVien', rec.index - 1, 'thoiGianBatDau']} rules={[...rules.required]}>
					<MyDatePicker />
				</Form.Item>
			),

			hide: isThoiHoc,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			render: (val, rec) => (
				<Form.Item
					name={['danhSachSinhVien', rec.index - 1, 'thoiGianKetThuc']}
					rules={[...rules.required, ...rules.sauNgay(thoiGianBatDauBaoLuu, 'Thời gian bắt đầu')]}
				>
					<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDauBaoLuu[rec.index - 1])} />
				</Form.Item>
			),

			hide: isThoiHoc,
		},
		{
			title: 'Thời gian gửi yêu cầu',
			// dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			// render: (val, rec) => val && <a href='#!'>{val && dayjs(val).format('DD/MM/YYYY')}</a>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 150,
			render: (val, rec) => rec.nganh?.ten,
		},

		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 60,
			render: (val, rec) => (
				<ButtonExtend icon={<CloseOutlined />} danger type='link' tooltip='Loại bỏ' onClick={() => handleLoaiBo(rec)} />
			),
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginBottom: 8 }}>
				Danh sách sinh viên
			</div>
			<TableStaticData data={danhSachSinhVien} columns={columns} size='small' addStt otherProps={{ pagination: false }}>
				{!selectedIds?.length ? (
					<ButtonExtend
						type='primary'
						size='small'
						icon={<PlusCircleOutlined />}
						onClick={() => setVisibleSinhVien(true)}
					>
						Thêm mới
					</ButtonExtend>
				) : null}
			</TableStaticData>

			<Modal
				title='Thêm mới sinh viên'
				open={visibleSinhVien}
				width={600}
				footer={null}
				onCancel={() => setVisibleSinhVien(false)}
			>
				<FormQuyetDinhSV danhSachSinhVienQuyetDinh={danhSachSinhVien} onOk={onFinish} isThoiHoc={isThoiHoc} />
			</Modal>
		</>
	);
};

export default FormTableSinhVien;
