import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import { type IColumn } from '@/components/Table/typing';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { EDoiTuongLopHanhChinh, doiTuongLopHanhChinh } from '@/services/DaoTaoV2/NamHoc/constant';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNganhCoSo from '../../DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import FilterKhoaSinhVien from '../KhoaSinhVien/components/FilterKhoaSinhVien';
import ModalChiTietKhoaSinhVien from '../KhoaSinhVien/components/ModalChiTiet';
import SelectKhoaSinhVien from '../KhoaSinhVien/components/Select';
import ModalLopHanhChinh from './components/ModalLopHanhChinh';

const LopHanhChinhPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.namhoc.lophanhchinh');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');

	const [visibleKhoaSv, setVisibleKhoaSv] = useState<boolean>(false);
	const [maKhoaSinhVien, setMaKhoaSinhVien] = useState<string>();
	const [visibleImportSvLhc, setVisibleImportSvLhc] = useState<boolean>(false);
	const [visibleImportNsLhc, setVisibleImportNsLhc] = useState<boolean>(false);

	const getData = () => getModel({ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma });

	const onCell = (record: LopHanhChinh.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.tenlop' }),
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.siso' }),
			dataIndex: 'siSo',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.khoasv' }),
			width: 120,
			dataIndex: 'maKhoaSinhVien',
			render: (val, rec) => (
				<a
					onClick={() => {
						setMaKhoaSinhVien(rec?.maKhoaSinhVien);
						setVisibleKhoaSv(true);
					}}
				>
					{rec?.khoaSinhVien?.ten}
				</a>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.nganhdt' }),
			width: 180,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.doituong' }),
			align: 'center',
			width: 100,
			dataIndex: 'doiTuong',
			render: (val: EDoiTuongLopHanhChinh) => val && doiTuongLopHanhChinh[val],
			filterType: 'select',
			filterData: Object.values(EDoiTuongLopHanhChinh).map((item) => ({
				label: doiTuongLopHanhChinh[item],
				value: item,
			})),
			onCell,
		},
		// {
		// 	title: 'Cố vấn',
		// 	width: 160,
		// 	dataIndex: 'nhanSuSsoId',
		// 	render: (val, rec) => `${rec.nhanSu?.hoDem ?? ''} ${rec.nhanSu?.ten ?? ''}`,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectNhanSuDebounce multiple />,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(record._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'lophanhchinh.column.confirm.xoa' })}
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
				dependencies={[page, limit, recKhoa?.ma, recNganh?.ma]}
				modelName='daotaov2.namhoc.lophanhchinh'
				title={intl.formatMessage({ id: 'namhoc.lophanhchinh.title' })}
				Form={ModalLopHanhChinh}
				widthDrawer={1200}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
				otherButtons={[
					<ButtonExtend key={'svlhc'} onClick={() => setVisibleImportSvLhc(true)} icon={<TeamOutlined />}>
						{intl.formatMessage({ id: 'lophanhchinh.button.nhapsv' })}
					</ButtonExtend>,
					<ButtonExtend key={'nslhc'} onClick={() => setVisibleImportNsLhc(true)} icon={<TeamOutlined />}>
						{intl.formatMessage({ id: 'lophanhchinh.button.nhapcvht' })}
					</ButtonExtend>,
				]}
			>
				<div style={{ marginBottom: 12 }}>
					<FilterKhoaSinhVien hasSelectNganh allowClear />
				</div>
			</TableBase>

			{maKhoaSinhVien ? (
				<ModalChiTietKhoaSinhVien
					visible={visibleKhoaSv}
					setVisible={setVisibleKhoaSv}
					maKhoaSinhVien={maKhoaSinhVien}
					hasEdit={false}
				/>
			) : null}

			<ModalImport
				modelName='daotaov2.hocky.sinhvienhocky'
				onCancel={() => setVisibleImportSvLhc(false)}
				visible={visibleImportSvLhc}
				onOk={() => {
					getData();
					setVisibleImportSvLhc(false);
				}}
				titleTemplate='Biểu mẫu Sinh viên - Lớp hành chính.xlsx'
			/>

			<ModalImport
				modelName='daotaov2.hocky.nhansuhocky'
				onCancel={() => setVisibleImportNsLhc(false)}
				visible={visibleImportNsLhc}
				onOk={() => {
					getData();
					setVisibleImportNsLhc(false);
				}}
				titleTemplate='Biểu mẫu Nhân sự - Lớp hành chính.xlsx'
			/>
		</>
	);
};

export default LopHanhChinhPage;
