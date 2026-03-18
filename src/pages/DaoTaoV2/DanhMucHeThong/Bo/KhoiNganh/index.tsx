import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmkhoinganh');

	const columns: IColumn<KhoiNganhDaoTao.IRecordBo>[] = [
		{
			title: 'Mã khối ngành',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên khối ngành',
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
			modelName='daotaov2.danhmuc.dmkhoinganh'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.khoinganh.title' })}
			Form={Form}
			buttons={{ create: false, import: true, export: true }}
		/>
	);
};

export default TrinhDoDTBo;
