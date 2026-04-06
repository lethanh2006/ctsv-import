import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
import { useIntl, useModel } from 'umi';
import FormTrack from './components/Form';

const TrackPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } =
		useModel('danhmuc.track');

	const getData = () => {
		getModel(undefined, undefined, {
			order: 1,
		});
	};

	const onChecked = (rec: Track.IRecord, isActive: boolean) => {
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

	const onCell = (rec: Track.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Track.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'track.column.code' }),
			dataIndex: 'code',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'track.column.name' }),
			dataIndex: 'name',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'track.column.des' }),
			dataIndex: 'description',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'track.column.active' }),
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
						title={intl.formatMessage({ id: 'track.confirm.xoa' })}
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
			modelName='danhmuc.track'
			title={intl.formatMessage({ id: 'track.title' })}
			Form={FormTrack}
			formProps={{ getData }}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default TrackPage;
