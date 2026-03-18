import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiChuongTrinhDaoTao, LoaiChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Card, Segmented } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../../../Nganh/components/SelectNganh';
import SelectTrinhDo from '../../../TrinhDo/components/Select';

export const CardFilterCTDT = () => {
	const { record, setRecord, page, limit, getModel } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState<ELoaiChuongTrinhDaoTao>(ELoaiChuongTrinhDaoTao.KE_HOACH);

	const getData = () =>
		getModel({ loai: chuongTrinhDaoTao }).then((data) => {
			setRecord(data?.[0]);
		});

	const onCell = (rec: ChuongTrinhDaoTao.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columnsChuongTrinh: IColumn<ChuongTrinhDaoTao.IRecord>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Trình độ',
			width: 100,
			dataIndex: 'maTrinhDoDaoTao',
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => rec?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
			onCell,
		},
		{
			title: 'Ngành',
			width: 200,
			dataIndex: 'maNganh',
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ma ?? rec.nganh?.ma ?? ''} - ${rec?.nganh?.ten ?? ''}`,
			onCell,
		},
	];

	return (
		<Card title='Chương trình đào tạo' styles={{ padding: '8px 0 0' }} headStyle={{ padding: 0 }} bordered={false}>
			<TableBase
				columns={columnsChuongTrinh}
				dependencies={[page, limit, chuongTrinhDaoTao]}
				getData={getData}
				modelName='daotaov2.chuongtrinhdaotao.chuongtrinh'
				buttons={{ create: false, filter: false, reload: false }}
				addStt={false}
				hideCard
				otherButtons={[
					<Segmented
						key='1'
						value={chuongTrinhDaoTao}
						options={Object.values(ELoaiChuongTrinhDaoTao).map((item) => ({
							label: LoaiChuongTrinhDaoTao[item],
							value: item,
						}))}
						onChange={(value) => setChuongTrinhDaoTao(value as ELoaiChuongTrinhDaoTao)}
					/>,
				]}
			/>
		</Card>
	);
};
