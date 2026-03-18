import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Space, Tag } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivity from './components/Form';
import ModalActivity from './components/Modal';
import StatActivity from './components/Stat';

const ActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, handleView, edit, isView, filters } =
		useModel('cct.activity');
	const { getAnalyticsActivityModel } = useModel('cct.activity');
	const { getAllModel: getAllAtributes } = useModel('danhmuc.attributes');
	const { initialState } = useModel('@@initialState');
	const phanQuyenSuKien = initialState?.currentUser?.realm_access?.roles?.find(
		(item) => item === 'CHUYEN_VIEN_CTSV_DON_VI',
	);

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	const getActivityMeta = (rec: Activity.IRecord) => {
		const now = dayjs();
		const start = dayjs(rec?.startDate);
		const end = dayjs(rec?.endDate);

		if (now.isBefore(start)) {
			return {
				status: 'Upcoming',
				color: '#faad14',
				isEditable: true,
			};
		}

		if (now.isAfter(end)) {
			return {
				status: 'Completed',
				color: '#8c8c8c',
				isEditable: false,
			};
		}

		return {
			status: 'Ongoing',
			color: '#52c41a',
			isEditable: false,
		};
	};

	const detectWorkflow = (): 'total' | 'upcoming' | 'ongoing' | 'completed' => {
		if (!filters || filters.length === 0) return 'total';

		const hasStartGt = filters.some((f) => f.field === 'startDate' && f.operator === EOperatorType.GREAT_THAN);

		const hasStartLte = filters.some((f) => f.field === 'startDate' && f.operator === EOperatorType.LESS_EQUAL);

		const hasEndGte = filters.some((f) => f.field === 'endDate' && f.operator === EOperatorType.GREAT_EQUAL);

		const hasEndLt = filters.some((f) => f.field === 'endDate' && f.operator === EOperatorType.LESS_THAN);

		if (hasStartGt) return 'upcoming';

		if (hasStartLte && hasEndGte) return 'ongoing';

		if (hasEndLt) return 'completed';

		return 'total';
	};
	const currentWorkflow = detectWorkflow();

	const getData = () => {
		getModel(
			phanQuyenSuKien
				? {
						activityCreatorSsoId: initialState?.currentUser?.ssoId,
					}
				: undefined,
			undefined,
			currentWorkflow === 'total' || currentWorkflow === 'ongoing'
				? {
						startDate: -1,
					}
				: currentWorkflow === 'upcoming'
					? {
							startDate: 1,
						}
					: currentWorkflow === 'completed'
						? {
								endDate: -1,
							}
						: undefined,
		);
	};

	const getThongKe = () => {
		getAnalyticsActivityModel(
			phanQuyenSuKien
				? {
						activityCreatorSsoId: initialState?.currentUser?.ssoId,
					}
				: undefined,
		);
	};

	const onCell = (rec: Activity.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Activity.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activity.column.name' }),
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.attribute' }),
			width: 200,
			render: (val, rec) => {
				const attri = uniqBy(rec?.coCurricularActivityEquivalency ?? [], 'attributesId');

				if (attri) {
					return (
						<Space wrap>
							{attri?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
				} else return null;
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.type' }),
			dataIndex: 'activitiesTypeId',
			width: 170,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.track' }),
			width: 130,
			render: (val, rec) => rec?.activitiesType?.trackText,
			filterType: 'customselect',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.regis' }),
			dataIndex: 'numberOfRegisteredActivityOutcomes',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.submit' }),
			dataIndex: 'numberOfAddEvidenceActivityOutcomes',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.appro' }),
			dataIndex: 'numberOfApprovedActivityOutcomes',
			width: 100,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.date' }),
			dataIndex: 'startDate',
			width: 220,
			render: (val, rec) =>
				[dayjs(rec?.startDate).format('HH:mm DD/MM/YYYY'), dayjs(rec?.endDate).format('HH:mm DD/MM/YYYY')]
					.filter(Boolean)
					.join(' - '),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.organ' }),
			dataIndex: 'codeOrganizer',
			width: 150,
			render: (val, rec) => rec?.organizer,
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi selectMa multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.approver' }),
			width: 150,
			render: (val, rec) => (
				<ExpandText>
					{rec?.studentDeclarationApproverList
						?.map((item) => item?.name)
						.filter(Boolean)
						.join(', ')}
				</ExpandText>
			),
			onCell,
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
			render: (_, rec) => {
				const { isEditable } = getActivityMeta(rec);

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
								deleteModel(
									rec._id,
									() => {
										getData();
										getThongKe();
									},
									{
										messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
									},
								)
							}
							title={intl.formatMessage({ id: 'activity.confirm.xoa' })}
							placement='topLeft'
							disabled={!isEditable}
						>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
								disabled={!isEditable}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<Card
			title={intl.formatMessage({ id: 'activity.title' })}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Card style={{ marginBottom: 12 }}>
				<StatActivity currentWorkflow={currentWorkflow} />
			</Card>

			<Card>
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit]}
					modelName='cct.activity'
					title={intl.formatMessage({ id: 'activity.title' })}
					Form={isView ? ModalActivity : FormActivity}
					showModalTitle
					modalTitle={
						edit
							? intl.formatMessage({ id: 'activity.form.chinhsua' })
							: isView
								? intl.formatMessage({ id: 'activity.form.chitet' })
								: intl.formatMessage({ id: 'activity.form.themmoi' })
					}
					formProps={{
						getData: () => {
							getData();
							getThongKe();
						},
					}}
					widthDrawer={1000}
					onReload={() => {
						getData();
						getThongKe();
					}}
					hideCard
				/>
			</Card>
		</Card>
	);
};

export default ActivityPage;
