import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal, Popconfirm, Switch, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../components/FormQuyTrinh';
import Form from './components/Form';

const QuanLyBieuMau = () => {
	const {
		page,
		limit,
		getBieuMauAdminModel,
		setRecord,
		setEdit,
		setVisibleForm,
		deleteBieuMauAdminModel,
		setCurrent,
		setLoaiDichVu,
		setDanhSach,
		putTrangThaiBieuMauModel,
	} = useModel('dvmc.dichvumotcuav2');
	// const { getAllDonViModel } = useModel('donvi');
	const { getAllModel, setRecord: setRecordKhoanThu, danhSach } = useModel('dvmc.khoanthu');
	const { getAllModel: getAllMucThu } = useModel('dvmc.mucthu');
	// const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('namhoc.lophanhchinh');
	// const access = useAccess();
	const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
	const [visible, setVisible] = useState<boolean>(false);
	// const isCreate = useCheckAccess('dvmc-thao-tac:create');
	// const isUpdate = useCheckAccess('dvmc-thao-tac:update');
	// const isDelete = useCheckAccess('dvmc-thao-tac:delete');

	useEffect(() => {
		setLoaiDichVu('DVMC');
		getAllModel(false, undefined, { 'metaData.service': 'DVMC' });
		// getAllHinhThucDaoTaoModel();
		// getAllDonViModel();
		return () => {
			setRecord({} as DichVuMotCuaV2.BieuMau);
			setDanhSach([]);
		};
	}, []);

	const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'ten',
			filterType: 'string',
			width: 200,
		},
		{
			title: 'Yêu cầu trả phí',
			dataIndex: ['thongTinThuTuc', 'yeuCauTraPhi'],
			width: 80,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: 'Tính theo số lượng',
			dataIndex: ['thongTinThuTuc', 'tinhTienTheoSoLuong'],
			width: 80,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 170,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		// {
		//   title: 'Hình thức đào tạo',
		//   width: 120,
		//   dataIndex: 'hinhThucDaoTaoId',
		//   render: (val, record) => (
		//     <div>
		//       {/*{record?.phamVi === 'Tất cả'*/}
		//       {/*  ? 'Tất cả'*/}
		//       {/*  : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}*/}
		//     </div>
		//   ),
		// },

		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 100,
			render: (val, record) => (
				<Switch checked={val} onChange={() => putTrangThaiBieuMauModel(record._id)} size='small' />
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: DichVuMotCuaV2.BieuMau) => (
				<>
					<Tooltip title='Xem trước'>
						<Button
							onClick={() => {
								setRecord(record);
								setRecordView({ thongTinDichVu: { ...record } } as any);
								setVisible(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Chỉnh sửa'>
						<Button
							// disabled={!isUpdate}
							onClick={() => {
								if (record?.thongTinThuTuc?.idKhoanThu) {
									setRecordKhoanThu(danhSach.find((item) => item._id === record.thongTinThuTuc?.idKhoanThu));
									getAllMucThu(false, undefined, {
										product: record.thongTinThuTuc.idKhoanThu,
										active: true,
									});
								}
								setRecord(record);
								setEdit(true);
								setVisibleForm(true);

								setCurrent(0);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							// disabled={!isDelete}
							onConfirm={() => {
								deleteBieuMauAdminModel(record._id);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button
								type='link'
								danger
								// disabled={!isDelete}
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				formType='Drawer'
				widthDrawer={1000}
				title='Quản lý biểu mẫu'
				modelName='dvmc.dichvumotcuav2'
				columns={columns}
				dependencies={[page, limit]}
				getData={() => getBieuMauAdminModel('DVMC')}
				Form={Form}
				destroyModal
				onCreate={() => {
					setCurrent(0);
				}}
			/>
			<Modal width={800} footer={null} open={visible} onCancel={() => setVisible(false)} destroyOnClose>
				<Tabs>
					<Tabs.TabPane tab='Quy trình' key={0}>
						<FormQuyTrinh type='view' record={recordView?.thongTinDichVu?.quyTrinh} />
					</Tabs.TabPane>

					<Tabs.TabPane tab='Biểu mẫu' key={1}>
						<FormView onCancel={() => setVisible(false)} type='view' record={recordView} />
					</Tabs.TabPane>
				</Tabs>
			</Modal>
		</>
	);
};

export default QuanLyBieuMau;
