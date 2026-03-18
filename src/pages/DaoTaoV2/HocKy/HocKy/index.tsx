import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';
import { deleteHocKyValidate } from '@/services/DaoTaoV2/HocKy/HocKy';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Switch, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import ModalHocKy from './components/Modal';

const HocKyPage = (props: { fromNamHoc?: boolean }) => {
	const intl = useIntl();
	const { fromNamHoc } = props;
	const { getModel, page, limit, deleteModel, handleEdit, sort, putModel, setFilters, filters } =
		useModel('daotaov2.hocky.hocky');
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');

	const getData = () =>
		getModel(
			fromNamHoc ? { namHocId: recNamHoc?._id } : undefined,
			undefined,
			sort ?? (fromNamHoc ? { soThuTu: 1 } : undefined),
		);

	const onChangeFilter = (field: keyof HocKy.IRecord, val: any) => {
		const temp = [...(filters || [])].filter((item) => item.field !== field);
		if (val) temp.push({ active: true, field, values: [val], operator: EOperatorType.INCLUDE });
		setFilters(temp);
	};

	const handleDelete = async (record: HocKy.IRecord) => {
		const res = await deleteHocKyValidate(record._id);

		Modal.confirm({
			title: 'Bạn có chắc muốn xóa kỳ học này?',
			content: res.data?.data ? undefined : 'Lưu ý: Việc xóa Kỳ học này sẽ ảnh hưởng tới các thông tin khác',
			onOk: () => deleteModel(record._id, getData),
		});
	};

	const onActive = (rec: HocKy.IRecord) => {
		putModel(`${rec._id}/active`, {} as HocKy.IRecord);
	};

	const onCell = (record: HocKy.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<HocKy.IRecord>[] = [
		{
			title: 'Năm học',
			dataIndex: 'namHocId',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectNamHoc multiple />,
			render: (val, rec) => rec.namHoc?.ten,
			onCell,
			hide: fromNamHoc,
		},
		// {
		// 	title: 'Trình độ',
		// 	dataIndex: 'maTrinhDoDaoTao',
		// 	width: 120,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectTrinhDo multiple selectMa />,
		// 	render: (val, rec) => rec.trinhDoDaoTao?.dmTrinhDo?.ten || rec.trinhDoDaoTao?.ten || val,
		// 	onCell,
		// },
		// {
		// 	title: 'Hình thức',
		// 	dataIndex: 'maHinhThucDaoTao',
		// 	width: 120,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectHinhThuc multiple selectMa />,
		// 	render: (val, rec) => rec.hinhThucDaoTao?.dmHinhThuc?.ten || rec.hinhThucDaoTao?.ten || val,
		// 	onCell,
		// },
		{
			title: 'TT kỳ',
			dataIndex: 'soThuTu',
			align: 'center',
			width: 60,
			sortable: true,
			onCell,
		},
		{
			title: 'Mã kỳ học',
			dataIndex: 'ma',
			width: 90,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên kỳ học',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 100,
			align: 'center',
			filterType: 'date',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Số tuần',
			dataIndex: 'soTuan',
			width: 70,
			align: 'center',
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Loại kỳ',
			dataIndex: 'isKyChinh',
			width: 80,
			align: 'center',
			onCell,
			render: (val) => <Tag color={val ? 'blue' : 'orange'}>{val ? 'Kỳ chính' : 'Kỳ phụ'}</Tag>,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'active',
			width: 70,
			align: 'center',
			render: (val, rec) => <Switch checked={!!val} onChange={() => onActive(rec)} size='small' />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: HocKy.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Button danger type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(rec)} />
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit]}
				modelName='daotaov2.hocky.hocky'
				title={intl.formatMessage({ id: 'kyhoc.kyhoc.title' })}
				Form={ModalHocKy}
				widthDrawer={1000}
				hideCard={fromNamHoc}
				formProps={{ fromNamHoc }}
				buttons={{ import: !fromNamHoc, export: !fromNamHoc }}
				rowSelection
				deleteMany
			>
				<Space style={{ marginBottom: 12 }}>
					{!fromNamHoc ? (
						<SelectNamHoc
							hasDefault
							allowClear
							value={filters?.find((item) => item.field === 'namHocId')?.values?.[0]?.toString()}
							onChange={(val) => onChangeFilter('namHocId', val)}
							style={{ width: 200 }}
						/>
					) : null}
					{/* <SelectTrinhDo
						allowClear
						value={filters?.find((item) => item.field === 'maTrinhDoDaoTao')?.values?.[0]?.toString()}
						onChange={(val) => onChangeFilter('maTrinhDoDaoTao', val)}
						style={{ width: 200 }}
						selectMa
					/>
					<SelectHinhThuc
						allowClear
						value={filters?.find((item) => item.field === 'maHinhThucDaoTao')?.values?.[0]?.toString()}
						onChange={(val) => onChangeFilter('maHinhThucDaoTao', val)}
						style={{ width: 200 }}
						selectMa
					/> */}
				</Space>
			</TableBase>
		</>
	);
};

export default HocKyPage;
