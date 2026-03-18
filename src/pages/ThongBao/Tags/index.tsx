import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ThongBao } from '@/services/ThongBao/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import { kiemTraPhanVung } from '../../../utils/constants';
import FormTags from './components/Form';

const Tags = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('thongbao.tags');
	const columns: IColumn<ThongBao.Tags>[] = [
		{
			title: intl.formatMessage({ id: 'thongbao.tags.column.name' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'thongbao.tags.column.description' }),
			dataIndex: 'moTa',
			width: 280,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.tags.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (recordVal: ThongBao.Tags) => {
				const isPhanVung = kiemTraPhanVung(recordVal?.dataPartitionCode ?? null);

				return (
					<>
						<ButtonExtend
							disabled={!isPhanVung}
							tooltip={intl.formatMessage({ id: 'thongbao.tags.action.edit' })}
							onClick={() => {
								handleEdit(recordVal);
							}}
							shape='circle'
							type={'link'}
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => {
								deleteModel(recordVal?._id);
							}}
							title={intl.formatMessage({ id: 'thongbao.tags.confirm.delete' })}
						>
							<ButtonExtend
								disabled={!isPhanVung}
								tooltip={intl.formatMessage({ id: 'thongbao.tags.action.delete' })}
								shape='circle'
								type='link'
								danger
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];
	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'thongbao.tags.table.title' })}
				modelName={'thongbao.tags'}
				columns={columns}
				dependencies={[page, limit]}
				Form={FormTags}
				destroyModal
			/>
		</>
	);
};
export default Tags;
