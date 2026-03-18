import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmtrinhdo');

	const columns: IColumn<TrinhDoDaoTao.IRecordBo>[] = [
		{
			title: 'Mã trình độ',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên trình độ',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.danhmuc.dmtrinhdo'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.trinhdo.title' })}
			Form={Form}
			buttons={{ create: false, export: true, import: true }}
			addStt={false}
		/>
	);
};

export default TrinhDoDTBo;
