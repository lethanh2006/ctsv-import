import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Space, message } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import TitlePrintKQHP from './TitlePrintKQHP';
import ViewDiemLopHocPhan from './ViewDiemLopHocPhan';

const CardDiemLopHocPhan = (getData: () => void) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const { getAllService: getAllLopHP } = useModel('daotaov2.hocky.lophocphan');
	const { getAllModel, danhSach, loading } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const { getModel: getDauDiem, danhSach: danhSachDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const componentRef = useRef(null);
	const [diemLopHocPhanId, setDiemLopHocPhanId] = useState<string>();

	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) => recHocPhan?.deCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan],
	);
	const tongTrongSo = _.sumBy(
		dauDiemCoTrongSo,
		(item) => +(recHocPhan?.deCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan] ?? 0),
	);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => (
			<ButtonExtend icon={<PrinterOutlined />} disabled={!danhSach.length}>
				In bảng điểm
			</ButtonExtend>
		),
		[danhSach.length],
	);

	const getDataInternal = () => {
		if (recHocPhan?.maHocPhan && recHocKy?.ma)
			getAllLopHP({
				condition: {
					maHocPhan: recHocPhan.maHocPhan,
					maHocKy: recHocKy?.ma,
					loai: ELoaiLopHocPhan.CHINH,
					trangThaiLop: ETrangThaiLopHocPhan.MO,
				},
			}).then((res) =>
				getAllModel(false, undefined, undefined, [
					{
						active: true,
						field: 'lopHocPhanId',
						values: res.data?.data?.map((item: LopHocPhan.IRecord) => item._id),
						operator: EOperatorType.INCLUDE,
					},
				]),
			);
	};

	useEffect(() => {
		getDataInternal();
	}, [recHocPhan?.maHocPhan, recHocKy?.ma]);

	useEffect(() => {
		getDauDiem(); // Max 10 đầu điểm
	}, []);

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setDiemLopHocPhanId(rec._id);
			setVisibleChiTietDiem(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: ['sinhVien', 'ma'],
			align: 'center',
			width: 100,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: ['sinhVien', 'ten'],
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mã lớp',
			dataIndex: ['lopHocPhan', 'ten'],
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: `Điểm KTHP (${100 - tongTrongSo}%)`,
			dataIndex: 'diemKthp',
			width: 80,
			align: 'center',
			sortable: true,
			hide: 100 - tongTrongSo <= 0,
			onCell: onCell,
		},
		{
			title: 'Điểm tổng kết học phần',
			width: 240,
			children: [
				{
					title: 'Điểm thang 10',
					width: 80,
					dataIndex: 'diemTongKet',
					align: 'center',
					sortable: true,
					onCell: onCell,
				},
				{
					title: 'Điểm thang 4',
					width: 80,
					dataIndex: 'diemThang4',
					align: 'center',
					sortable: true,
					onCell: onCell,
				},
				{
					title: 'Điểm chữ',
					width: 80,
					dataIndex: 'diemChu',
					align: 'center',
					filterType: 'select',
					filterData: Object.values(ELoaiDiemChu),
					onCell: onCell,
				},
			],
		},
	];

	const cols: IColumn<any>[] = dauDiemCoTrongSo.map((item) => ({
		title: `${item.ten} (${recHocPhan?.deCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan]}%)`,
		width: 80,
		dataIndex: `diemThanhPhan${item.field}`,
		align: 'center',
		sortable: true,
		onCell: onCell,
	}));
	if (cols.length)
		columns.splice(3, 0, {
			title: 'Điểm thành phần',
			width: cols.length * 80,
			children: cols,
		});

	return (
		<>
			<Card
				title={'Danh sách sinh viên'}
				styles={{ padding: '8px 0 0' }}
				headStyle={{ padding: '0' }}
				bordered={false}
			>
				{recHocPhan?._id ? (
					<>
						<TableStaticData
							columns={columns}
							data={danhSach.map((item, index) => ({ ...item, index }))}
							addStt
							// otherProps={{ pagination: false, scroll: { y: 600 } }}
							size='small'
							loading={loading}
							hasTotal
						>
							<Space wrap>
								<Button
									icon={<ExportOutlined />}
									onClick={() => message.warning('Đang phát triển...')}
									disabled={!danhSach.length}
								>
									Xuất bảng điểm
								</Button>
								<ReactToPrint
									content={reactToPrintContent}
									documentTitle='Kết quả học tập học phần'
									trigger={reactToPrintTrigger}
									removeAfterPrint
								/>
							</Space>
						</TableStaticData>

						<PrintTemplate ref={componentRef}>
							<TitlePrintKQHP />
							<div className='to-print'>
								<TableStaticData
									columns={columns}
									data={danhSach.map((item, index) => ({ ...item, index }))}
									addStt
									size='small'
									otherProps={{ pagination: false }}
								/>
							</div>
						</PrintTemplate>
					</>
				) : (
					<Empty description='Vui lòng chọn lớp tín chỉ' />
				)}
			</Card>

			{diemLopHocPhanId ? (
				<ViewDiemLopHocPhan
					visible={visibleChiTietDiem}
					setVisible={setVisibleChiTietDiem}
					sinhVienLopHocPhanId={diemLopHocPhanId}
				/>
			) : null}
		</>
	);
};

export default CardDiemLopHocPhan;
