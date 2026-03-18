import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectLopHanhChinhDebounce from '../../LopHanhChinh/components/SelectLopHanhChinh';
import Form from './components/Form';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';

const SinhVienDotNhapHocPage = () => {
	const intl = useIntl();
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
		'daotaov2.namhoc.sinhvienlophanhchinh',
	);

	const handleEdit = (record: LopHanhChinh.IRecordSinhVien) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: 'Sinh viên',
			width: 150,
			dataIndex: 'sinhVien',
			render: (val, rec) => (
				<>
					{rec?.sinhVien?.ten} - {rec?.sinhVien?.ma}
				</>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectSinhVienDebounce multiple />,
		},
		{
			title: 'Lớp hành chính',
			width: 200,
			dataIndex: 'lopHanhChinh',
			render: (val, rec) => <>{rec?.lopHanhChinh?.ten}</>,
			filterType: 'customselect',
			filterCustomSelect: <SelectLopHanhChinhDebounce multiple />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecordSinhVien) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa sinh viên này?'
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
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.namhoc.sinhvienlophanhchinh'
			title={intl.formatMessage({ id: 'namhoc.dotnhaphoc.sinhviendotnhaphoc.title' })}
			Form={Form}
			hideCard
			rowSelection
			deleteMany
		/>
	);
};

export default SinhVienDotNhapHocPage;
