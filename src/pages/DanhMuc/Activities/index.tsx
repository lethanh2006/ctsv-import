import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Switch, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectActivitiesTypeDomain from '../CCD/components/Select';
import FormActivities from './components/Form';

const ActivitiesPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } = useModel('danhmuc.activities');

	const onChecked = (rec: ActivitiesManagement.IRecord, isActive: boolean) => {
		if (rec._id)
			putModel(
				rec._id,
				{ isActive },
				undefined,
				undefined,
				undefined,
				isActive
					? intl.formatMessage({ id: 'message.activateSuccess' })
					: intl.formatMessage({ id: 'message.deactivateSuccess' }),
			).catch((er) => console.log(er));
	};

	const onCell = (rec: ActivitiesManagement.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ActivitiesManagement.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.id' }),
			dataIndex: 'code',
			align: 'center',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.name' }),
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.attribute' }),
			dataIndex: 'attributes',
			width: 180,
			render: (val, rec) =>
				val && (
					<Space wrap>
						{val?.map((item: any) => (
							<Tag color={item?.color}>{item?.name}</Tag>
						))}
					</Space>
				),
			onCell,
		},
		// {
		// 	title: intl.formatMessage({ id: 'activitiesmanagement.column.track' }),
		// 	dataIndex: 'track',
		// 	width: 120,
		// 	render: (val, rec) => rec?.track?.name,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectTrack multiple />,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.required' }),
			dataIndex: 'requiredEvidenceList',
			width: 180,
			render: (val, rec) => val && <ExpandText>{val.filter(Boolean).join(', ')}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.domain' }),
			dataIndex: 'activitiesTypeDomainId',
			align: 'center',
			width: 200,
			render: (val, rec) => rec?.activitiesTypeDomain?.name ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesTypeDomain multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.des' }),
			dataIndex: 'description',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.column.active' }),
			dataIndex: 'isActive',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<Popconfirm
					title={
						val
							? intl.formatMessage({ id: 'message.confirm.deactivate' })
							: intl.formatMessage({ id: 'message.confirm.activate' })
					}
					onConfirm={() => onChecked(rec, !val)}
					placement='top'
				>
					<Switch checked={val} size='small' loading={formSubmiting} />
				</Popconfirm>
			),
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>

					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'activitiesmanagement.confirm.delete' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.activities'
			title={intl.formatMessage({ id: 'activitiesmanagement.title' })}
			Form={FormActivities}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default ActivitiesPage;
