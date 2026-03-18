import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Checkbox, Popconfirm, Switch } from 'antd';
import { useIntl, useModel } from 'umi';
import FormLevels from './components/Form';

const LevelsPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } =
		useModel('danhmuc.levels');

	const getData = () => {
		getModel(undefined, undefined, {
			order: 1,
		});
	};

	const onChecked = (rec: LevelsManagement.IRecord, isActive: boolean) => {
		if (rec._id)
			putModel(
				rec._id,
				{ isActive },
				getData,
				undefined,
				undefined,
				isActive
					? intl.formatMessage({ id: 'message.activateSuccess' })
					: intl.formatMessage({ id: 'message.deactivateSuccess' }),
			).catch((er) => console.log(er));
	};

	const onCell = (rec: LevelsManagement.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LevelsManagement.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'levelsmanagement.column.id' }),
			dataIndex: 'code',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'levelsmanagement.column.name' }),
			dataIndex: 'name',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'levelsmanagement.column.des' }),
			dataIndex: 'description',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'levelsmanagement.column.auto' }),
			dataIndex: 'autoApproval',
			align: 'center',
			width: 120,
			render: (val, rec) => <Checkbox checked={val} />,
		},
		{
			title: intl.formatMessage({ id: 'levelsmanagement.column.active' }),
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
							deleteModel(rec._id, getData, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'levelsmanagement.confirm.delete' })}
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
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.levels'
			title={intl.formatMessage({ id: 'levelsmanagement.title' })}
			Form={FormLevels}
			formProps={{ getData }}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default LevelsPage;
