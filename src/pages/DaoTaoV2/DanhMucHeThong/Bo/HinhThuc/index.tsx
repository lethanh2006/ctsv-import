import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmhinhthuc');

	const columns: IColumn<HinhThucDaoTao.IRecordBo>[] = [
		{
			title: 'Mã hình thức',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên hình thức',
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
			modelName='daotaov2.danhmuc.dmhinhthuc'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.hinhthuc.title' })}
			Form={Form}
			buttons={{ create: false, export: true, import: true }}
		/>
	);
};

export default TrinhDoDTBo;
