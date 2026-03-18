import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Table } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';

const TableKhoiHocPhanCTDT = (props: { hocKy?: number; chuyenNganh?: string; toPrint?: boolean }) => {
	const { hocKy, chuyenNganh, toPrint } = props;
	const { danhSach, setDanhSach, loading } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const { getAllModel: getHocPhanTuChon } = useModel('daotaov2.chuongtrinhdaotao.hocphanctdt');
	const data = danhSach.filter(
		(item) =>
			(!hocKy || (hocKy === -1 && !item.soThuTuKy) || item.soThuTuKy === hocKy) &&
			(!chuyenNganh || !item.maChuyenNganh || item.maChuyenNganh === chuyenNganh),
	);

	const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{
			title: 'Tên học phần / khối học phần',
			width: 200,
			render: (val, rec) => rec.hocPhan?.ten ?? rec.ten,
		},
		{
			title: 'Mã học phần',
			width: 100,
			render: (val, rec) => rec.hocPhan?.ma,
		},
		{
			title: 'Loại học phần',
			width: 100,
			dataIndex: 'loaiHocPhanCtdt',
		},
		{
			title: 'Số tín chỉ',
			width: 80,
			align: 'center',
			render: (val, rec) => rec.hocPhan?.soTinChi ?? rec.soTinChiTuChonPhaiHoc,
		},
		{
			title: 'Học kỳ',
			width: 80,
			dataIndex: 'soThuTuKy',
			align: 'center',
			hide: !!hocKy,
		},
		{
			title: 'Chuyên ngành',
			width: 150,
			render: (val, rec) => rec.chuyenNganh?.ten,
			hide: !!chuyenNganh,
		},
	];

	const expandedRowRender = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		const columns1: IColumn<ChuongTrinhDaoTao.IHocPhanTuChonCTDT>[] = [
			{
				title: 'Tên học phần tự chọn',
				width: 180,
				render: (val, r) => r.hocPhan?.ten,
			},
			{
				title: 'Mã học phần',
				width: 100,
				render: (val, r) => r.hocPhan?.ma,
			},
			{
				title: 'Số tín chỉ',
				width: 80,
				align: 'center',
				render: (val, r) => r.hocPhan?.soTinChi,
			},
		];

		return (
			<TableStaticData
				columns={columns1}
				data={rec.hocPhanCtdtList ?? []}
				size='small'
				loading={loading}
				otherProps={{ pagination: false, scroll: { y: 300 } }}
				addStt
			/>
		);
	};

	return (
		<TableStaticData
			addStt
			data={data}
			columns={columns}
			size='small'
			otherProps={{
				bordered: true,
				pagination: false,
				scroll: toPrint ? undefined : { y: 400 },
				expandable: toPrint
					? undefined
					: {
							expandedRowRender,
							expandRowByClick: true,
							expandIconColumnIndex: 0,
							rowExpandable: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) =>
								rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON || rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP,
							columnWidth: 20,
							onExpand: (expand: boolean, rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
								if (expand && !rec.hocPhanCtdtList?.length)
									getHocPhanTuChon(false, undefined, { khoiHpCtId: rec._id }).then((dat) => {
										const temp = [...danhSach]?.map((item) =>
											item._id === rec._id ? { ...rec, hocPhanCtdtList: dat } : item,
										);
										setDanhSach(temp);
									});
							},
					  },
				summary: () => {
					const sum = _.sumBy(data, (rec) => rec.hocPhan?.soTinChi ?? rec.soTinChiTuChonPhaiHoc ?? 0);
					return (
						<>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={toPrint ? 4 : 5}>
									<div className='fw500'>Tổng số tín chỉ</div>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align='center'>
									<div className='fw500'>{sum}</div>
								</Table.Summary.Cell>
								{!hocKy ? (
									<Table.Summary.Cell index={2} colSpan={!!chuyenNganh ? 1 : 2} />
								) : !chuyenNganh ? (
									<Table.Summary.Cell index={2} colSpan={1} />
								) : null}
							</Table.Summary.Row>
						</>
					);
				},
			}}
		/>
	);
};

export default TableKhoiHocPhanCTDT;
