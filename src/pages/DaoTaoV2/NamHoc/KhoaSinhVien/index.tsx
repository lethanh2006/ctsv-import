import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import { initHinhThuc, initTrinhDo } from '@/utils/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ModalKhoaSinhVien from './components/ModalKhoaSinhVien';

const KhoaSinhVien = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, filters, setFilters } =
		useModel('daotaov2.namhoc.khoasinhvien');
	const selectHinhThuc = filters?.find((item) => item.field === 'maHinhThucDaoTao')?.values?.[0]?.toString();
	const selectTrinhDo = filters?.find((item) => item.field === 'maTrinhDoDaoTao')?.values?.[0]?.toString();

	useEffect(() => {
		setFilters([
			{
				active: true,
				field: 'maHinhThucDaoTao',
				values: [initHinhThuc], // Chính quy
				operator: EOperatorType.INCLUDE,
			},
			{
				active: true,
				field: 'maTrinhDoDaoTao',
				values: [initTrinhDo], // Đại học
				operator: EOperatorType.INCLUDE,
			},
		]);
	}, []);

	const onChangeFilters = (field: keyof KhoaSinhVien.IRecord, value?: string) => {
		const temp = [...(filters || [])].filter((item) => item.field !== field);
		if (!value) setFilters(temp);
		else setFilters([...temp, { active: true, field, values: [value], operator: EOperatorType.INCLUDE }]);
	};

	const onCell = (rec: KhoaSinhVien.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<KhoaSinhVien.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên khóa sinh viên',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Năm học bắt đầu',
			dataIndex: 'namHocBatDau',
			width: 100,
			filterType: 'number',
			sortable: true,
			align: 'center',
			onCell,
		},
		{
			title: 'Trình độ đào tạo',
			dataIndex: 'maTrinhDoDaoTao',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => rec.trinhDoDaoTao?.ten ?? rec.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
			onCell,
		},
		{
			title: 'Hình thức đào tạo',
			dataIndex: 'maHinhThucDaoTao',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThuc multiple selectMa />,
			render: (val, rec) => rec.hinhThucDaoTao?.ten ?? '--',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: KhoaSinhVien.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getModel)}
							title='Bạn có chắc chắn muốn xóa khóa sinh viên này?'
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
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotaov2.namhoc.khoasinhvien'
				title={intl.formatMessage({ id: 'namhoc.khoasinhvien.title' })}
				widthDrawer={1000}
				Form={ModalKhoaSinhVien}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
			>
				<Space wrap style={{ marginBottom: 12 }}>
					<SelectTrinhDo
						style={{ width: 200 }}
						value={selectTrinhDo as string}
						onChange={(val) => onChangeFilters('maTrinhDoDaoTao', val as string)}
						allowClear
						selectMa
					/>
					<SelectHinhThuc
						style={{ width: 200 }}
						value={selectHinhThuc as string}
						onChange={(val) => onChangeFilters('maHinhThucDaoTao', val as string)}
						allowClear
						selectMa
					/>
				</Space>
			</TableBase>
		</>
	);
};

export default KhoaSinhVien;
