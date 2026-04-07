import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormCompetencyCCAModel from './Form';

const AttributesCCAModel = (props: { disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;
	const { record: recCCA } = useModel('danhmuc.activities');
	const { getModel, page, limit, deleteModel } = useModel('danhmuc.ccaattributes');

	const getData = () => {
		if (recCCA?._id)
			getModel({
				activitiesTypeId: recCCA?._id,
			});
	};

	const columns: IColumn<Competency.ICompetencyAttributes>[] = [
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.attribute.column.code' }),
			dataIndex: ['attributes', 'code'],
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.attribute.column.name' }),
			dataIndex: ['attributes', 'name'],
			width: 200,
			render: (val, rec) => <Tag color={rec?.attributes?.color}>{rec?.attributes?.name}</Tag>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.attribute.column.des' }),
			dataIndex: ['attributes', 'description'],
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, getData, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'activitiesmanagement.attribute.confirm.xoa' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
							disabled={disabled}
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
			dependencies={[page, limit, recCCA?._id]}
			modelName='danhmuc.ccaattributes'
			Form={FormCompetencyCCAModel}
			formProps={{ getData }}
			buttons={{ create: !disabled }}
			hideCard
			otherProps={{
				pagination: false,
				size: 'small',
			}}
		/>
	);
};

export default AttributesCCAModel;
