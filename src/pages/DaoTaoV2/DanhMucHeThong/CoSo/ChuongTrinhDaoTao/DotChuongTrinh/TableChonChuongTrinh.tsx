import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const TableChonChuongTrinh = () => {
	const { record: recDot } = useModel('daotaov2.chuongtrinhdaotao.dotrasoat');
	const { page, limit, getModel } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');

	const getData = () =>
		recDot?._id &&
		getModel(
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			`ra-soat-ctdt/dot/${recDot._id}/ctdt/add-ra-soat/page`,
			undefined,
			undefined,
			true,
		);

	const columns: IColumn<ChuongTrinhDaoTao.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Trình độ',
			width: 100,
			dataIndex: 'maTrinhDoDaoTao',
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => rec?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
		},
		{
			title: 'Ngành',
			width: 180,
			dataIndex: 'maNganh',
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ma ?? rec.nganh?.ma ?? ''} - ${rec?.nganh?.ten ?? ''}`,
		},
		{
			title: 'Năm ban hành',
			dataIndex: 'namBanHanh',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
		},
	];

	return (
		<TableBase
			columns={columns}
			getData={getData}
			dependencies={[page, limit, recDot?._id]}
			modelName='daotaov2.chuongtrinhdaotao.chuongtrinh'
			hideCard
			rowSelection
			buttons={{ create: false }}
			otherProps={{ rowKey: (rec: ChuongTrinhDaoTao.IRecord) => rec.ma }}
		/>
	);
};

export default TableChonChuongTrinh;
