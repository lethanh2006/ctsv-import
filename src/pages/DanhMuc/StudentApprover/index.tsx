import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Checkbox, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentApprover from './components/Form';

const StudentApproverPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, handleView } = useModel('danhmuc.studentdomain');

	const getData = () => {
		getModel(undefined, [
			{
				active: true,
				field: 'activitiesTypeId',
				operator: EOperatorType.NULL,
				values: [],
			},
			{
				active: true,
				field: 'activitiesId',
				operator: EOperatorType.NULL,
				values: [],
			},
		]);
	};

	const onCell = (rec: ActivitiesManagement.IStudentDeclaration) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ActivitiesManagement.IStudentDeclaration>[] = [
		{
			title: intl.formatMessage({ id: 'studentapprover.column.name' }),
			dataIndex: 'name',
			width: 220,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'studentapprover.column.code' }),
			dataIndex: 'code',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'studentapprover.column.email' }),
			dataIndex: 'email',
			width: 100,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'studentapprover.column.main' }),
			dataIndex: 'mainApprover',
			align: 'center',
			width: 90,
			render: (val, rec) => <Checkbox checked={val} />,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>

					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, getData, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'studentapprover.confirm.xoa' })}
						placement='topLeft'
					>
						<ButtonExtend
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
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.studentdomain'
			title={intl.formatMessage({ id: 'studentapprover.title' })}
			Form={FormStudentApprover}
			formProps={{ getData }}
		/>
	);
};

export default StudentApproverPage;
