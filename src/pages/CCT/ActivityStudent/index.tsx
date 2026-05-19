import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExport from '@/components/Table/Export';
import { TFilter, type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { officialColors } from '@/services/base/constant';
import { thongKeSoLuongActivityOutCome } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapEvalidation,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	MenuOutlined,
	SafetyCertificateOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { Button, Card, Popover, Segmented, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from './components/Form';
import StatActivityOutCome from './components/Stat';
import ApproveMany from './Modal/ApproveMany';
import ModalChinhSuaImpact from './Modal/ModalImpact';
import ModalChinhSuaTrangThai from './Modal/ModalTrangThai';
import ModalXuLyActivityStudent from './Modal/ModalXuLy';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const {
		getModel,
		page,
		limit,
		handleView,
		setRecord,
		getAnalyticsStaffModel,
		filters: filtersOutCome,
		setFilters,
		setVisibleChangeStatus,
		setVisibleXuLy,
		setVisibleImpact,
		danhSach,
		setVisibleXuLyMany,
		selectedIds,
	} = useModel('cct.activityoutcome');
	const { getAllModel: getAllAtributes } = useModel('danhmuc.attributes');

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();
	const [segmentSelected, setSegmentSelected] = useState<EActivityCategory | string>(EActivityCategory.REGISTERED);
	const valueFiltered = filtersOutCome?.find((item) => item.field?.includes('workflow'))?.values ?? [];
	const [loadingThongke, setLoadingThongKe] = useState<boolean>(false);
	const [totalRegis, setTotalRegis] = useState<number>(0);
	const [totalPersional, setTotalPersional] = useState<number>(0);
	const [visibleExport, setVisibleExport] = useState<boolean>(false);

	const PROCESSED = [EApprovalStatus.APPROVED, EApprovalStatus.REJECTED, EApprovalStatus.CHANGES_REQUIRED];

	const pending = valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.SUBMITTED;
	const processed = valueFiltered?.length === PROCESSED.length && PROCESSED.every((s) => valueFiltered.includes(s));

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	const thongKeSoLuongActivityOutComeAll = async () => {
		try {
			setLoadingThongKe(true);

			const commonFilters = [
				{
					active: true,
					field: 'workflow',
					values: [EApprovalStatus.EVIDENCE_REQUIRED, EApprovalStatus.DRAFT],
					operator: EOperatorType.NOT_INCLUDE,
				},
			];

			const [resRegis, resPersional] = await Promise.all([
				thongKeSoLuongActivityOutCome([
					...(filtersOutCome || []),
					...commonFilters,
					{
						active: true,
						field: 'activityCategory',
						values: [EActivityCategory.REGISTERED],
						operator: EOperatorType.INCLUDE,
					},
				]),
				thongKeSoLuongActivityOutCome([
					...(filtersOutCome || []),
					...commonFilters,
					{
						active: true,
						field: 'activityCategory',
						values: [EActivityCategory.PERSONAL_CO_CURRICULAR],
						operator: EOperatorType.INCLUDE,
					},
				]),
			]);

			setTotalRegis(resRegis?.data?.data?.total);
			setTotalPersional(resPersional?.data?.data?.total);
		} catch (error) {
			console.error(intl.formatMessage({ id: 'activityresult.error.stat' }), error);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const filters: any[] = [];

	if (segmentSelected !== 'ALL') {
		filters.push({
			active: true,
			field: 'activityCategory',
			values: [segmentSelected],
			operator: EOperatorType.INCLUDE,
		});
	}

	const getData = () => {
		getModel(
			undefined,
			[
				...filters,
				{
					active: true,
					field: 'workflow',
					values: [EApprovalStatus.EVIDENCE_REQUIRED, EApprovalStatus.DRAFT],
					operator: EOperatorType.NOT_INCLUDE,
				},
			],
			processed
				? {
						approvalTime: -1,
					}
				: pending
					? {
							submittedAt: 1,
						}
					: {
							submittedAt: -1,
						},
			undefined,
			undefined,
			'approval-task-list/page',
		);
	};

	useEffect(() => {
		thongKeSoLuongActivityOutComeAll();
	}, [JSON.stringify(filtersOutCome)]);

	const getStat = () => {
		getAnalyticsStaffModel();
	};

	const getThongKe = () => {
		getStat();
		thongKeSoLuongActivityOutComeAll();
	};

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const isActivitiesNameFilter = <T,>(f: TFilter<T>) => {
		if (Array.isArray(f.field)) {
			return f.field[0] === 'activities' && f.field[1] === 'name';
		}
		return f.field === 'activitiesOutcomeName';
	};

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.column.studentCode' }),
			dataIndex: 'code',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.studentName' }),
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.activityName' }),
			dataIndex: segmentSelected === EActivityCategory.REGISTERED ? ['activities', 'name'] : 'activitiesOutcomeName',
			width: 180,
			render: (val, rec) =>
				rec?.isAwardRecognition ? (
					<Space>
						{rec?.competition}{' '}
						<Tag
							color={officialColors.official300}
							style={{
								color: officialColors.official500,
								fontWeight: 600,
							}}
						>
							Award
						</Tag>
					</Space>
				) : rec?.activityCategory === EActivityCategory.REGISTERED ? (
					rec?.activities?.name
				) : (
					rec?.activitiesOutcomeName
				),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.role' }),
			dataIndex: 'rolesId',
			width: 180,
			render: (val, rec) =>
				rec?.roles?.name ?? <i className='text-warning'>{intl.formatMessage({ id: 'global.noInfo' })}</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.level' }),
			dataIndex: 'levelsId',
			width: 120,
			render: (val, rec) =>
				rec?.levels?.name ?? <i className='text-warning'>{intl.formatMessage({ id: 'global.noInfo' })}</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.attribute' }),
			width: 160,
			render: (val, rec) => {
				const attriRe = rec?.activities?.coCurricularActivityEquivalency?.filter(
					(item) => item?.rolesId === rec?.rolesId,
				);

				const attriDec = rec?.activitiesType?.attributes;

				if (rec?.activityCategory === EActivityCategory.REGISTERED) {
					return (
						<Space wrap>
							{attriRe?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
				} else
					return (
						<Space wrap>
							{attriDec?.map((item: any) => (
								<Tag color={item?.color}>{item?.name}</Tag>
							))}
						</Space>
					);
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.competency' }),
			width: 220,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED ? (
					<ExpandText>
						{rec?.activities?.competencyList
							?.map((item) => item?.competency?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				) : (
					<ExpandText>
						{rec?.listAchievedCompetencies
							?.map((item) => item?.competencie?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.activityType' }),
			width: 200,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? rec?.activities?.activitiesType?.name
					: rec?.activitiesType?.name,
			onCell,
		},
		// {
		// 	title: intl.formatMessage({ id: 'activityresult.column.track' }),
		// 	width: 120,
		// 	render: (val, rec) =>
		// 		rec?.activityCategory === EActivityCategory.REGISTERED
		// 			? (rec?.activities?.activitiesType?.trackText ?? rec?.activities?.activitiesType?.track?.name)
		// 			: (rec?.activitiesType?.trackText ?? rec?.activitiesType?.track?.name),
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'activityresult.column.mentorSupervisor' }),
			dataIndex: 'supervisorName',
			width: 150,
			filterType: 'string',
			onCell,
			hide: segmentSelected === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.submissionTime' }),
			dataIndex: 'submittedAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.approver' }),
			dataIndex: 'studentDeclarationApproverName',
			width: 150,
			render: (val, rec) => {
				const approvalWorkflow =
					rec?.workflow === EApprovalStatus.APPROVED ||
					rec?.workflow === EApprovalStatus.REJECTED ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED;

				return (
					<>
						{rec?.workflow === EApprovalStatus.APPROVED && !rec?.studentDeclarationApproverName
							? intl.formatMessage({ id: 'global.system' })
							: approvalWorkflow
								? rec?.studentDeclarationApproverName
								: rec?.activities?.studentDeclarationApproverList
										?.map((item) => item?.name)
										.filter(Boolean)
										.join(', ')}
					</>
				);
			},
			filterType: 'string',
			onCell,
			hide: pending,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.evidenceReviewTime' }),
			dataIndex: 'approvalTime',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			hide: pending,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.impact' }),
			dataIndex: 'validation',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.workflow === EApprovalStatus.APPROVED && <Tag color={mapEvalidation[val as Evalidation]}>{val}</Tag>,
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(Evalidation).map((item) => ({
				value: item,
				label: item,
			})),
			onCell,
			hide: pending,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => {
				const now = dayjs();
				const endDateUpdateEvidence =
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED
						? rec?.dueDate
							? dayjs(rec?.dueDate)
							: null
						: rec?.activities?.allowPostEventResultsUpdate
							? rec?.activities?.dueDate
								? dayjs(rec?.activities?.dueDate)
								: null
							: rec?.activities?.endDate
								? dayjs(rec?.activities?.endDate)
								: null;

				const editableWorkflow =
					rec?.workflow === EApprovalStatus.DRAFT ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
					rec?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

				const isExpired =
					rec?.activityCategory === EActivityCategory.REGISTERED
						? editableWorkflow && now.isAfter(endDateUpdateEvidence)
						: rec?.workflow === EApprovalStatus.CHANGES_REQUIRED && now.isAfter(dayjs(rec?.dueDate));

				if (isExpired) {
					return (
						<Tag
							color={officialColors.official500}
							style={{
								color: officialColors.official300,
								fontWeight: 600,
							}}
						>
							{intl.formatMessage({ id: 'activityresult.status.expired' })}
						</Tag>
					);
				}
				return (
					<Tag
						color={mapColorApprovalStatus[val as EApprovalStatus]}
						style={{
							maxWidth: 120,
							whiteSpace: 'normal',
							wordBreak: 'break-word',
							textAlign: 'center',
							color: mapColorTextApprovalStatus[rec?.workflow as EApprovalStatus],
							fontWeight: 600,
						}}
					>
						{mapNameApprovalStatus[val as EApprovalStatus]}
					</Tag>
				);
			},
			fixed: 'right',
			filterType: !pending && !processed ? 'select' : undefined,
			filterData: Object.values(EApprovalStatus)
				.filter((item) => ![EApprovalStatus.EVIDENCE_REQUIRED, EApprovalStatus.DRAFT].includes(item))
				.map((item) => ({
					value: item,
					label: mapNameApprovalStatus[item as EApprovalStatus],
				})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => {
				if (rec?.workflow === EApprovalStatus.SUBMITTED) {
					return (
						<>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'activityresult.button.duyet' })}
								onClick={() => {
									setRecord(rec);
									setTrangThai({
										title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
										trangThai: EApprovalStatus.APPROVED,
									});
									setVisibleXuLy(true);
								}}
								type='link'
								icon={<CheckCircleOutlined />}
								className='btn-success'
							/>

							<Popover
								content={
									<Space direction='vertical' size={4} className='action-popover'>
										<ButtonExtend
											onClick={() => {
												setRecord(rec);
												setTrangThai({
													title: intl.formatMessage({ id: 'activityresult.xuly.tuchoi' }),
													trangThai: EApprovalStatus.REJECTED,
												});
												setVisibleXuLy(true);
											}}
											type='link'
											icon={<CloseCircleOutlined />}
											danger
											size='small'
										>
											{intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
										</ButtonExtend>

										<ButtonExtend
											onClick={() => {
												setRecord(rec);
												setTrangThai({
													title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
													trangThai: EApprovalStatus.CHANGES_REQUIRED,
												});
												setVisibleXuLy(true);
											}}
											type='link'
											icon={<EditOutlined />}
											size='small'
											className='btn-warning'
										>
											{intl.formatMessage({ id: 'activityresult.button.yccs' })}
										</ButtonExtend>
									</Space>
								}
								placement='bottomLeft'
							>
								<Button icon={<MenuOutlined />} type='link' />
							</Popover>
						</>
					);
				}
				return (
					<>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'activityresult.button.changeStatus' })}
							onClick={() => {
								setRecord(rec);
								setVisibleChangeStatus(true);
							}}
							type='link'
							icon={<SyncOutlined />}
							size='small'
						/>

						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'activityresult.button.verifyImpact' })}
							onClick={() => {
								setRecord(rec);
								setVisibleImpact(true);
							}}
							type='link'
							icon={<SafetyCertificateOutlined />}
							size='small'
							className='btn-success'
							disabled={rec?.workflow !== EApprovalStatus.APPROVED}
						/>
					</>
				);
			},
		},
	];

	return (
		<>
			<Card
				title={intl.formatMessage({ id: 'activityresult.title' })}
				className='card-big-title card-borderless'
				variant='borderless'
			>
				<Card style={{ marginBottom: 12 }}>
					<StatActivityOutCome getData={getStat} pending={pending} processed={processed} />
				</Card>

				<Card>
					<TableBase
						getData={getData}
						columns={columns}
						dependencies={[page, limit, segmentSelected]}
						modelName='cct.activityoutcome'
						title={intl.formatMessage({ id: 'activityresult.title' })}
						widthDrawer={1000}
						buttons={{ create: false }}
						onReload={() => {
							getData();
							getThongKe();
						}}
						hideCard
						otherButtons={[
							<Segmented
								options={[
									{
										value: EActivityCategory.REGISTERED,
										label: `${mapNameActivityCategory[EActivityCategory.REGISTERED]} (${
											loadingThongke ? '...' : totalRegis
										})`,
									},
									{
										value: EActivityCategory.PERSONAL_CO_CURRICULAR,
										label: `${mapNameActivityCategory[EActivityCategory.PERSONAL_CO_CURRICULAR]} (${
											loadingThongke ? '...' : totalPersional
										})`,
									},
								]}
								value={segmentSelected}
								disabled={loadingThongke}
								onChange={(val) => {
									setSegmentSelected(val);
									setFilters((prev) => prev?.filter((f) => !isActivitiesNameFilter(f)));
								}}
							/>,
							<ButtonExtend onClick={() => setVisibleExport(true)}>Export data</ButtonExtend>,
							<ButtonExtend
								onClick={() => setVisibleXuLyMany(true)}
								// disabled={!danhSach?.length}
							>
								Approve {selectedIds?.length && selectedIds?.length > 0 ? `(${selectedIds?.length})` : ''}
							</ButtonExtend>,
						]}
						rowSelection
					/>
				</Card>

				<ModalXuLyActivityStudent
					title={trangThai?.title ?? ''}
					trangThai={trangThai?.trangThai ?? EApprovalStatus.DRAFT}
					getData={() => {
						getData();
						getThongKe();
					}}
				/>

				<ModalChinhSuaImpact
					getData={() => {
						getData();
						getThongKe();
					}}
				/>

				<ModalChinhSuaTrangThai
					getData={() => {
						getData();
						getThongKe();
					}}
				/>

				<FormActivityStudent
					getData={() => {
						getData();
						getThongKe();
					}}
					setTrangThai={setTrangThai}
					iszindex
				/>

				<ModalExport
					visible={visibleExport}
					modelName='cct.activityoutcome'
					onCancel={() => setVisibleExport(false)}
					fileName={`Danh sách ${intl.formatMessage({ id: 'activityresult.title' })}.xlsx`}
					filters={[
						...filters,
						{
							active: true,
							field: 'workflow',
							values: [EApprovalStatus.EVIDENCE_REQUIRED, EApprovalStatus.DRAFT],
							operator: EOperatorType.NOT_INCLUDE,
						},
					]}
				/>

				<ApproveMany
					getData={() => {
						getData();
						getThongKe();
					}}
				/>
			</Card>
		</>
	);
};

export default HistoryActivityPage;
