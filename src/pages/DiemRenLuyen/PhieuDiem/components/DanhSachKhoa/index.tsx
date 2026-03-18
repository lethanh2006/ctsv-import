import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachKhoa = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, setRecord, record } = useModel('daotaov2.khoasinhvien.khoasinhvien');

	useEffect(() => {
		getAllModel(true);
	}, []);

	const onCell = (recordVal: KhoaSinhVien.IRecord) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal?._id === record?._id ? 700 : 600,
			color: recordVal?._id === record?._id ? '#1890ff' : undefined,
			backgroundColor: recordVal?._id === record?._id ? '#f0f0f0' : undefined,
		},
	});

	const columns: IColumn<KhoaSinhVien.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'phieudiem.tenkhoasinhvien' }),
			dataIndex: 'ten',
			width: 200,
			onCell,
		},
	];

	return (
		<div style={{ paddingTop: 3 }}>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ scrol: { x: 350 }, pagination: false }} />
		</div>
	);
};
export default DanhSachKhoa;
