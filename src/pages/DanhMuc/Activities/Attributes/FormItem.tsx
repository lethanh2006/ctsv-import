import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormAttributesCCA from './Form';

const FormItemAttributesCCA = (props: {
	value?: ActivitiesManagement.IActivitiesTypeAttributes[];
	onChange?: (data: ActivitiesManagement.IActivitiesTypeAttributes[]) => void;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { setVisibleForm, visibleForm, setEdit, edit, setRecord, setIsView } = useModel('danhmuc.ccaattributes');
	const { value = [], onChange, disabled } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (records: ActivitiesManagement.IActivitiesTypeAttributes[]) => {
		const data = [...value];

		records.forEach((rec) => {
			const existed = data.some((d) => d.attributesId === rec.attributesId);
			if (!existed) data.push(rec);
		});

		onChange?.(data);
		setVisibleForm(false);
	};

	const columns: IColumn<ActivitiesManagement.IActivitiesTypeAttributes>[] = [
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
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'activitiesmanagement.attribute.confirm.xoa' })}
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
			<TableStaticData data={value} columns={columns} size='small' hasTotal addStt otherProps={{ pagination: false }}>
				{!disabled && (
					<Button
						onClick={() => {
							setRecord({} as ActivitiesManagement.IActivitiesTypeAttributes);
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
						? intl.formatMessage({ id: 'activitiesmanagement.attribute.form.chinhsua' })
						: intl.formatMessage({ id: 'activitiesmanagement.attribute.form.themmoi' })
				}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormAttributesCCA onOk={onAdd} value={value} />
			</Modal>
		</>
	);
};

export default FormItemAttributesCCA;
