import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import SelectLinhVuc from '../LinhVuc/components/SelectLinhVuc';
import Form from './components/Form';

const TrinhDoDTBo = () => {
	const intl = useIntl();
	const { page, limit, condition } = useModel('daotaov2.danhmuc.dmnhomnganh');

	const columns: IColumn<NhomNganhDaoTao.IRecordBo>[] = [
		{
			title: 'Mã nhóm ngành',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên nhóm ngành',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Lĩnh vực đào tạo',
			width: 200,
			dataIndex: 'maDmLinhVucDaoTao',
			render: (val, rec) => (
				<>
					{rec?.dmLinhVucDaoTao?.ma} - {rec?.dmLinhVucDaoTao?.ten}
				</>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectLinhVuc multiple />,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit, condition]}
			modelName='daotaov2.danhmuc.dmnhomnganh'
			title={intl.formatMessage({ id: 'danhmuchethong.bo.nhomnganh.title' })}
			Form={Form}
			buttons={{ create: false }}
		/>
	);
};

export default TrinhDoDTBo;
