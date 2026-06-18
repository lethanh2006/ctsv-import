import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import {
	EStatusMyCCT,
	mapColorStatusMyCCT,
	mapColorTextStatusMyCCT,
	mapNameStatusMyCCT,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSubmisstionRound from '../components/Select';
import StatMyCTT from '../components/Stat';
import ChiTietMyCCT from './components/ChiTiet';
import ModalXuLyMyCCT from './components/ModalXuLy';

const DanhSachMyCCT = (props: { isDot?: boolean; ssoId?: string }) => {
	const { isDot, ssoId } = props;
	const intl = useIntl();
	const { danhSach: dsDot, record: recDot, setRecord: setRecDot } = useModel('cct.submissionround');
	const { getModel, page, limit, handleView, setRecord, setVisibleXuLy, getAnalyticsMyCCTModel, filters } =
		useModel('cct.mycct');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<MyCCT.IAnalyticsMyCCT>();
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EStatusMyCCT;
	}>();

	const getThongKe = () => {
		setLoadingThongKe(true);
		getAnalyticsMyCCTModel({
			_id: recDot?._id,
		})
			.then((res) => setDataThongKe(res))
			.finally(() => setLoadingThongKe(false));
	};

	const valueFiltered = filters?.find((item) => item.field == 'status')?.values?.[0];

	const getData = () => {
		getModel(
			{
				submissionRoundId: recDot?._id,
				ssoId: ssoId,
			},
			[
				{
					active: true,
					field: 'status',
					values: [EStatusMyCCT.DRAFT],
					operator: EOperatorType.NOT_INCLUDE,
				},
			],

			valueFiltered === EStatusMyCCT.PENDING_APPROVAL
				? {
						submittedAt: 1,
					}
				: { approvedAt: -1 },
		);
	};

	useEffect(() => {
		getThongKe();
	}, [recDot?._id]);

	const onCell = (rec: MyCCT.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MyCCT.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.studentName' }),
			dataIndex: 'name',
			width: 180,
			render: (val) => val ?? '--',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.studentId' }),
			dataIndex: 'code',
			width: 150,
			render: (val) => val ?? '--',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.dob' }),
			dataIndex: 'dob',
			width: 160,
			render: (val) => (val ? dayjs(val).format('DD/MM/YYYY') : '--'),
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.approver' }),
			dataIndex: 'approvedByName',
			width: 220,
			render: (val) => val || '--',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.reviewTime' }),
			dataIndex: 'approvedAt',
			width: 180,
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '--'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'submisstion.danhsach.submissionTime' }),
			dataIndex: 'submittedAt',
			width: 180,
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '--'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'status',
			align: 'center',
			width: 120,
			render: (val, rec) => {
				return (
					<Tag
						color={mapColorStatusMyCCT[val as EStatusMyCCT]}
						style={{
							maxWidth: 120,
							whiteSpace: 'normal',
							wordBreak: 'break-word',
							textAlign: 'center',
							color: mapColorTextStatusMyCCT[rec?.status as EStatusMyCCT],
							fontWeight: 600,
						}}
					>
						{mapNameStatusMyCCT[val as EStatusMyCCT]}
					</Tag>
				);
			},
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(EStatusMyCCT)
				?.filter((item) => item !== EStatusMyCCT.DRAFT)
				.map((item) => ({
					value: item,
					label: mapNameStatusMyCCT[item as EStatusMyCCT],
				})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{/* <ButtonExtend
						tooltip={'Export PDF'}
						loading={loadingExport}
						onClick={() => {
							setLoadingExport(true);
							exportMyCCT(rec?.ssoId)
								.then((res) => {
									fileDownload(res.data, getFilenameHeader(res));
								})
								.catch((er) => console.log(er))
								.finally(() => setLoadingExport(false));
						}}
						type='link'
						icon={<FilePdfOutlined />}
					/> */}

					<ButtonExtend
						disabled={rec?.status !== EStatusMyCCT.PENDING_APPROVAL}
						tooltip={intl.formatMessage({ id: 'activityresult.button.duyet' })}
						onClick={() => {
							setRecord(rec);
							setTrangThai({
								title: intl.formatMessage({ id: 'submisstion.danhsach.modal.approveTitle' }),
								trangThai: EStatusMyCCT.APPROVED,
							});
							setVisibleXuLy(true);
						}}
						type='link'
						icon={<CheckCircleOutlined />}
						className='btn-success'
					/>

					<ButtonExtend
						disabled={rec?.status !== EStatusMyCCT.PENDING_APPROVAL}
						tooltip={intl.formatMessage({ id: 'activityresult.button.yccs' })}
						onClick={() => {
							setRecord(rec);
							setTrangThai({
								title: intl.formatMessage({ id: 'submisstion.danhsach.modal.editTitle' }),
								trangThai: EStatusMyCCT.CHANGES_REQUIRED,
							});
							setVisibleXuLy(true);
						}}
						type='link'
						icon={<EditOutlined />}
						size='small'
						className='btn-warning'
					/>
				</>
			),
			hide: !!ssoId,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id, ssoId]}
				modelName='cct.mycct'
				Form={ChiTietMyCCT}
				title={intl.formatMessage({ id: 'submisstion.danhsach.title' })}
				formProps={{
					getData: () => {
						getData();
						getThongKe();
					},
					setTrangThai,
					ssoId,
				}}
				widthDrawer={1300}
				buttons={{ create: false }}
				modalTitle={intl.formatMessage({ id: 'submisstion.danhsach.modal.detail' })}
				showModalTitle
				onReload={() => {
					getData();
					getThongKe();
				}}
				hideCard={isDot || !!ssoId}
			>
				{!isDot && (
					<SelectSubmisstionRound
						style={{ width: 300, marginBottom: 12 }}
						allowClear
						value={recDot?._id}
						onChange={(val) => setRecDot(dsDot?.find((item) => item?._id === val))}
					/>
				)}

				{!ssoId && (
					<StatMyCTT loadingThongKe={loadingThongKe} dataThongKe={dataThongKe ?? ({} as MyCCT.IAnalyticsMyCCT)} />
				)}
			</TableBase>

			<ModalXuLyMyCCT
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? EStatusMyCCT.DRAFT}
				getData={() => {
					getData();
					getThongKe();
				}}
			/>
		</>
	);
};

export default DanhSachMyCCT;
