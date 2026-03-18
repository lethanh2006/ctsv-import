import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import SelectNhomNganh from '../NhomNganh/components/SelectNhomNganh';
import SelectTrinhDo from '../TrinhDo/components/SelectTrinhDo';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.dmnganh');

	const columns: IColumn<NganhDaoTao.IRecordBo>[] = [
		{
			title: 'Mã ngành',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên ngành',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Nhóm ngành đào tạo',
			width: 150,
			dataIndex: 'maDmNhomNganh',
			render: (val, rec) => `${rec?.dmNhomNganh?.ma ?? ''} - ${rec?.dmNhomNganh?.ten ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectNhomNganh multiple selectMa />,
		},
		{
			title: 'Trình độ đào tạo',
			width: 150,
			dataIndex: 'maDmTrinhDo',
			render: (val, rec) => `${rec?.dmTrinhDo?.ma ?? ''} - ${rec?.dmTrinhDo?.ten ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.danhmuc.dmnganh'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.nganh.title' })}
			Form={Form}
			buttons={{ create: false, export: true, import: true }}
		/>
	);
};

export default TrinhDoDTBo;
