import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';

const TrinhDoDTNhaNuoc = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmtrinhdo');

	const columns: IColumn<TrinhDoDaoTao.IRecordBo>[] = [
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
			modelName='daotaov2.danhmuc.nhanuoc.trinhdo'
			title={intl.formatMessage({ id: 'danhmuchethong.nhanuoc.trinhdo.title' })}
			buttons={{ create: false }}
		/>
	);
};

export default TrinhDoDTNhaNuoc;
