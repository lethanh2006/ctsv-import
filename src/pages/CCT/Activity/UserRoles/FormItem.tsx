import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { EparticipantRole } from '@/services/CCT/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormUserRoles from './Form';

const FormItemUserRoles = (props: {
	value?: Activity.IParticipantsList[];
	onChange?: (data: Activity.IParticipantsList[]) => void;
	disabled?: boolean;
	participantRole: EparticipantRole;
}) => {
	const intl = useIntl();
	const { setVisibleForm, visibleForm, setEdit, edit, record, setRecord, setIsView } = useModel('cct.userroles');
	const { value = [], onChange, disabled, participantRole } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: Activity.IParticipantsList) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<Activity.IParticipantsList>[] = [
		{
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.name' }),
			dataIndex: 'name',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.email' }),
			dataIndex: 'email',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.role' }),
			dataIndex: 'participantRole',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'activity.info.participantsList.confirm.xoa' })}
						placement='topLeft'
					>
						<ButtonExtend
							disabled={disabled}
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
		<>
			<TableStaticData data={value} columns={columns} size='small' hasTotal addStt>
				<Button
					disabled={disabled}
					onClick={() => {
						setRecord({} as Activity.IParticipantsList);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					{intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
			</TableStaticData>

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${intl.formatMessage({ id: 'activity.info.form.participantsList' })}`}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormUserRoles onOk={onAdd} participantRole={participantRole} />
			</Modal>
		</>
	);
};

export default FormItemUserRoles;
