import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { ETrangThaiDeCuongHPHK, colorTrangThaiDeCuongHPHK } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Card, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const CardFilterHocPhanHocKy = (props: { required?: boolean; trangThaiDiem?: boolean; size?: 'small' | 'default' }) => {
	const { record: recHocPhan, setRecord: setHocPhan, page, limit, getModel } = useModel('daotaov2.hocphan.decuonghphk');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { required, trangThaiDiem, size } = props;

	const getData = () =>
		recHocKy?.ma &&
		getModel({ maDonVi: recDonVi?.maDonVi, maHocKy: recHocKy?.ma, active: true }).then((data) => {
			if (required || recHocPhan?._id) setHocPhan(data?.[0]);
		});

	useEffect(() => {
		return () => {
			setHocPhan(undefined);
		};
	}, []);

	const onCell = (rec: HocPhan.IDeCuongHocPhanHocKy) => ({
		onClick: () => (required ? setHocPhan(rec) : setHocPhan(rec._id !== recHocPhan?._id ? rec : undefined)),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === recHocPhan?._id ? 600 : undefined,
			backgroundColor: rec._id === recHocPhan?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<HocPhan.IDeCuongHocPhanHocKy>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Mã',
			dataIndex: 'maHocPhan',
			width: 80,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'STC',
			dataIndex: 'soTinChi',
			width: 60,
			align: 'center',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDiem',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeCuongHPHK),
			render: (val: ETrangThaiDeCuongHPHK) => <Tag color={colorTrangThaiDeCuongHPHK[val]}>{val}</Tag>,
			width: 100,
			hide: !trangThaiDiem,
			onCell,
		},
	];

	return (
		<Card title='Danh sách học phần' headStyle={{ padding: 0 }} styles={{ padding: '8px 0 0' }} bordered={false}>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, recDonVi?.maDonVi, recHocKy?.ma]}
				modelName='daotaov2.hocphan.decuonghphk'
				buttons={{ create: false, filter: false }}
				otherProps={{ size }}
				addStt={false}
				hideCard
			/>
		</Card>
	);
};

export default CardFilterHocPhanHocKy;
