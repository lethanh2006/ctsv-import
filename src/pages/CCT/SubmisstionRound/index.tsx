import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormSubmisstionRound from './components/Form';
import ModalSubmisstionRound from './components/Modal';

export const getActivityMeta = (rec: SubmisstionRound.IRecord) => {
	const now = dayjs();
	const start = dayjs(rec?.startDate);
	const end = dayjs(rec?.endDate);

	if (now.isBefore(start)) {
		return {
			status: 'Upcoming',
			color: '#faad14',
			isEditable: true,
			isDeleteable: true,
		};
	}

	if (now.isAfter(end)) {
		return {
			status: 'Completed',
			color: '#8c8c8c',
			isEditable: true,
			isDeleteable: false,
		};
	}

	return {
		status: 'Ongoing',
		color: '#52c41a',
		isEditable: true,
		isDeleteable: false,
	};
};

const SubmisstionRoundPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, handleView, isView, edit } = useModel('cct.submissionround');

	const getData = () => {
		getModel();
	};

	const onCell = (rec: SubmisstionRound.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SubmisstionRound.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'submisstion.column.name' }),
			dataIndex: 'roundName',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.column.hocky' }),
			dataIndex: 'semesterCode',
			width: 180,
			render: (val, rec) => rec?.semesterName,
			onCell,
			filterType: 'customselect',
			filterCustomSelect: <SelectHocKy multiple selectMa placeHolder='Select Semester' />,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.column.date' }),
			dataIndex: 'startDate',
			width: 220,
			render: (val, rec) =>
				[dayjs(rec?.startDate).format('HH:mm DD/MM/YYYY'), dayjs(rec?.endDate).format('HH:mm DD/MM/YYYY')]
					.filter(Boolean)
					.join(' - '),
			onCell,
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.column.note' }),
			dataIndex: 'note',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.status' }),
			align: 'center',
			width: 130,
			render: (_, rec) => {
				const { status, color } = getActivityMeta(rec);
				return <Tag color={color}>{status}</Tag>;
			},
			fixed: 'right',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => {
				const { isEditable, isDeleteable } = getActivityMeta(rec);

				return (
					<>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<EditOutlined />}
							disabled={!isEditable}
						/>

						<Popconfirm
							onConfirm={() =>
								deleteModel(rec._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'submisstion.confirm.delete' })}
							placement='topLeft'
							disabled={!isDeleteable}
						>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
								disabled={!isDeleteable}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='cct.submissionround'
			title={intl.formatMessage({ id: 'submisstion.title' })}
			Form={isView ? ModalSubmisstionRound : FormSubmisstionRound}
			formProps={{ getData }}
			widthDrawer={isView ? 1000 : 800}
			modalTitle={
				edit
					? intl.formatMessage({ id: 'submisstion.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'submisstion.form.chitiet' })
						: intl.formatMessage({ id: 'submisstion.form.themmoi' })
			}
			showModalTitle
		/>
	);
};

export default SubmisstionRoundPage;
