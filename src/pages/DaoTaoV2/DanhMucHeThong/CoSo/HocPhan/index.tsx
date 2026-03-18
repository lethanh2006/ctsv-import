import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import { type IColumn } from '@/components/Table/typing';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Space, Switch, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLoaiHocPhan from '../LoaiHocPhan/components/Select';
import SelectTrinhDo from '../TrinhDo/components/Select';
import ModalHocPhan from './components/ModalHocPhan';

const HocPhanPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, activeHocPhanModel, condition, setCondition } =
		useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { record: recTrinhDo, setRecord: setTrinhDo, danhSach: danhSachTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const [visibleImportDeCuong, setVisibleImportDeCuong] = useState<boolean>(false);

	const getData = () => getModel({ maDonVi: recDonVi?.maDonVi, maTrinhDoDaoTao: recTrinhDo?.ma });

	const onCell = (record: HocPhan.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const onChecked = (rec: HocPhan.IRecord) => activeHocPhanModel(rec?._id).then(() => getData());

	const onChangeCheckbox = (checked: boolean) => {
		const temp = { ...condition };
		if (!checked) temp.active = true; // Mặc định get học phần active
		else delete temp.active;
		setCondition(temp);
	};

	const columns: IColumn<HocPhan.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		// {
		// 	title: 'Tên tiếng Anh',
		// 	dataIndex: 'tenTiengAnh',
		// 	width: 150,
		// 	filterType: 'string',
		// 	sortable: true,
		// 	onCell,
		// },
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Tính chất HP',
			dataIndex: 'maLoaiHocPhan',
			width: 120,
			render: (val, rec) => rec.loaiHocPhan?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectLoaiHocPhan multiple selectMa />,
			onCell,
		},
		{
			title: 'Trình độ',
			width: 120,
			dataIndex: 'maTrinhDoDaoTao',
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo selectMa multiple />,
			render: (val, rec) => rec.trinhDoDaoTao?.ten ?? '--',
			onCell,
			hide: !!recTrinhDo?._id,
		},
		{
			title: 'Đơn vị quản lý',
			width: 150,
			dataIndex: 'maDonVi',
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) => rec.donVi?.ten ?? val,
			onCell,
			hide: !!recDonVi?.maDonVi,
		},
		{
			title: 'Đề cương hiện tại',
			dataIndex: 'deCuongHienTaiId',
			width: 120,
			align: 'center',
			render: (val, rec) => rec.deCuongHienTai?.ma ?? '--',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'active',
			width: 80,
			align: 'center',
			render: (val, rec) => <Switch checked={val} onChange={() => onChecked(rec)} size='small' />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HocPhan.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa học phần này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				// Truyền vào base export
				params={{ maDonVi: recDonVi?.maDonVi, maTrinhDoDaoTao: recTrinhDo?.ma }}
				dependencies={[page, limit, recDonVi?.maDonVi, recTrinhDo?.ma]}
				modelName='daotaov2.hocphan.hocphan'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.hocphan.title' })}
				Form={ModalHocPhan}
				widthDrawer={1000}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
				otherButtons={[
					<ButtonExtend key='1' icon={<ImportOutlined />} onClick={() => setVisibleImportDeCuong(true)}>
						Nhập Đề cương học phần
					</ButtonExtend>,
				]}
			>
				<Space wrap style={{ marginBottom: 18 }}>
					<SelectTrinhDo
						value={recTrinhDo?.ma}
						style={{ width: 200 }}
						onChange={(val) => {
							setTrinhDo(danhSachTrinhDo.find((item) => item.ma === val));
						}}
						selectMa
						allowClear
					/>
					<SelectDonVi
						value={recDonVi?.maDonVi}
						style={{ width: 350 }}
						onChange={(val) => {
							setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
						}}
						allowClear
						placeholder='Chọn đơn vị quản lý'
					/>
					<Checkbox checked={condition?.active === undefined} onChange={(val) => onChangeCheckbox(val.target.checked)}>
						Hiển thị các học phần đã ẩn
					</Checkbox>
				</Space>
			</TableBase>

			<ModalImport
				modelName='daotaov2.hocphan.decuonghocphan'
				open={visibleImportDeCuong}
				onCancel={() => setVisibleImportDeCuong(false)}
				onOk={() => {
					setVisibleImportDeCuong(false);
					getData();
				}}
				titleTemplate='Biểu mẫu Đề cương học phần.xlsx'
			/>
		</>
	);
};

export default HocPhanPage;
