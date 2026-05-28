import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { officialColors } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory } from '@/services/CCT/constant';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ApproveMany = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const {
		formSubmiting,
		putApproveActivityManyModel,
		visibleXuLyMany,
		setVisibleXuLyMany,
		selectedIds,
		setSelectedIds,
		getAllModel,
		loading,
	} = useModel('cct.activityoutcome');
	const [danhSach, setDanhSach] = useState<ActivityOutCome.IRecord[]>([]);

	useEffect(() => {
		if (!visibleXuLyMany) {
			setSelectedIds([]);
		} else {
			getAllModel(
				undefined,
				undefined,
				undefined,
				[{ active: true, field: '_id', values: selectedIds, operator: EOperatorType.INCLUDE }],
				undefined,
				false,
			).then((res) => setDanhSach(res));
		}
	}, [visibleXuLyMany]);

	const onFinish = async () => {
		if (selectedIds?.length)
			putApproveActivityManyModel(
				{
					listId: selectedIds,
				},
				getData,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			).then(() => {
				setVisibleXuLyMany(false);
				setSelectedIds([]);
			});
	};

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.column.studentCode' }),
			dataIndex: 'code',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.studentName' }),
			dataIndex: 'name',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.activityName' }),
			width: 250,
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
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popconfirm
					onConfirm={() => {
						setDanhSach((prev) => prev.filter((item) => item._id !== rec._id));
						setSelectedIds((prev: any) => prev.filter((id: any) => id !== rec._id));
					}}
					title='Confirm remove student'
					description='Are you sure you want to remove this student from the approval list?'
					placement='topLeft'
				>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
						danger
						type='link'
						icon={<DeleteOutlined />}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<Modal
			open={visibleXuLyMany}
			onCancel={() => setVisibleXuLyMany(false)}
			title={'Confirm Student Activity Approval'}
			footer={null}
			width={800}
			zIndex={1000}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div style={{ fontSize: 48 }} className={'text-success'}>
					<CheckCircleOutlined />
				</div>
				<div>Confirm Student Activity Approval!</div>
				<div>
					You are about to approve {selectedIds?.length || 0} evidences. These records will move to "Approved" status
				</div>
			</div>

			<TableStaticData
				loading={loading}
				columns={columns}
				data={danhSach ?? []}
				size='small'
				addStt
				otherProps={{ scroll: { y: 450 }, pagination: false }}
			/>

			<div className='form-footer'>
				<Button loading={formSubmiting} type='primary' onClick={onFinish} disabled={!selectedIds?.length}>
					{intl.formatMessage({ id: 'global.button.xacnhan' })}
				</Button>
				<Button onClick={() => setVisibleXuLyMany(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ApproveMany;
