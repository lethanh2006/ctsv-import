import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useEffect } from 'react';
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
	} = useModel('cct.activityoutcome');

	useEffect(() => {
		if (!visibleXuLyMany) {
			setSelectedIds([]);
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

	return (
		<Modal
			open={visibleXuLyMany}
			onCancel={() => setVisibleXuLyMany(false)}
			title={'Confirm Approval'}
			footer={null}
			width={600}
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
				<div>{`Are you sure you want to approve ${selectedIds?.length || 0} Activity Results?`}</div>
			</div>

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
