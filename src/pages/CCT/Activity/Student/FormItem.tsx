import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentDomain from './Form';

const FormItemStudentDomain = (props: {
	value?: ActivitiesManagement.IStudentDeclaration[];
	onChange?: (data: ActivitiesManagement.IStudentDeclaration[]) => void;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { setVisibleForm, visibleForm, setEdit, edit, record, setRecord, setIsView } =
		useModel('danhmuc.studentdomain');
	const { value = [], onChange, disabled } = props;
	const dataSource = Array.isArray(value) ? value : [];

	const onDelete = (index: number) => {
		const data = [...dataSource];
		data.splice(index, 1);
		onChange?.(data);
	};

	const onAdd = (rec: ActivitiesManagement.IStudentDeclaration) => {
		const isDuplicate = dataSource.find((item, idx) => item.ssoId === rec.ssoId)?.ssoId;

		if (!!isDuplicate) {
			message.error(intl.formatMessage({ id: 'activitiesmanagement.student.error' }));
		} else {
			if (!record?.index) {
				onChange?.([...dataSource, rec]);
				setVisibleForm(false);
			} else {
				const data = [...dataSource];
				data.splice(record.index - 1, 1, rec);
				onChange?.(data);
				setVisibleForm(false);
			}
		}
	};

	const columns: IColumn<ActivitiesManagement.IStudentDeclaration>[] = [
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.hoten' }),
			dataIndex: 'name',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.email' }),
			dataIndex: 'email',
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
						title={intl.formatMessage({ id: 'activitiestypedomain.student.comfirm.xoa' })}
						placement='topLeft'
						disabled={disabled}
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
		<>
			<TableStaticData data={dataSource} columns={columns} size='small' hasTotal addStt>
				{!disabled && (
					<Button
						onClick={() => {
							setRecord({} as ActivitiesManagement.IStudentDeclaration);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						size='small'
						type='primary'
					>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
				)}
			</TableStaticData>

			<Modal
				title={
					edit
						? intl.formatMessage({ id: 'activitiestypedomain.student.form.chinhsua' })
						: intl.formatMessage({ id: 'activitiestypedomain.student.form.themmoi' })
				}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormStudentDomain onOk={onAdd} />
			</Modal>
		</>
	);
};

export default FormItemStudentDomain;
