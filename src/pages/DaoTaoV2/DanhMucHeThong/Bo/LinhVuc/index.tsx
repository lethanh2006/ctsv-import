import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmlinhvuc');

	const columns: IColumn<LinhVucDaoTao.IRecordBo>[] = [
		{
			title: 'Mã lĩnh vực',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên lĩnh vực',
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
			modelName='daotaov2.danhmuc.dmlinhvuc'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.linhvuc.title' })}
			Form={Form}
			buttons={{ create: false, export: true, import: true }}
			addStt={false}
		/>
	);
};

export default TrinhDoDTBo;
