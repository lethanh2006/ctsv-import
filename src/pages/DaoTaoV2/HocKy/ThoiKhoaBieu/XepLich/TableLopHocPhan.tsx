import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { Modal, Progress, Segmented } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThoiKhoaBieuView from '../ThoiKhoaBieuView';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { MenuOutlined } from '@ant-design/icons';

const TableLopHocPhanTKB = (props: { tuanHienTai: number }) => {
	const { danhSach, setRecord, record, danhSachXepLich, setDanhSachXepLich } = useModel('daotaov2.hocky.lophocphan');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const [activeKey, setActiveKey] = useState('1');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { tuanHienTai } = props;

	useEffect(() => {
		const dataHienThi = (
			activeKey === '1' ? danhSach.filter((item) => item.cauHinhTkb?.some((j) => j.tuan === tuanHienTai)) : danhSach
		).map((rec) => ({
			...rec,
			daXepTuan: _.sumBy(
				rec.maHoaLichHoc?.filter((item) => item.danhSachTuan.some((j) => j.tuan === tuanHienTai)),
				(item) => item.soTiet,
			),
			daXep: _.sumBy(rec.maHoaLichHoc, (item) => item.soTiet * item.danhSachTuan.length),
		}));
		setDanhSachXepLich(dataHienThi);
		setRecord(dataHienThi?.[0]);
	}, [activeKey, danhSach.length, tuanHienTai]);

	const onCell = (rec: LopHocPhan.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const onViewDetail = (lopHp: LopHocPhan.IRecord) => {
		setRecord(lopHp);
		setVisibleModal(true);
	};

	const columns: IColumn<LopHocPhan.IRecord & { daXep: number; daXepTuan: number }>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Tên lớp',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 160,
			filterType: 'string',
			hide: !!recHocPhan?._id,
			onCell,
		},
		{
			title: 'Giảng viên',
			width: 180,
			render: (val, rec) => (
				<ExpandText>
					{rec.nhanSuList
						?.map((item) =>
							item.nhanSu?.hoDem ? [item.nhanSu?.hoDem, item.nhanSu?.ten].join(' ') : 'Không lấy được thông tin',
						)
						?.join(', ') ?? <i>Không có thông tin</i>}
				</ExpandText>
			),
			onCell,
		},
		{
			title: 'Số tiết đã xếp trong tuần',
			dataIndex: 'daXepTuan',
			align: 'center',
			sortable: true,
			width: 120,
			render: (val, rec) => {
				const cauHinh = rec.cauHinhTkb?.find((item) => item.tuan === tuanHienTai)?.soTiet ?? 0;
				return <Progress size='small' percent={Math.round((val * 100) / cauHinh)} format={() => `${val}/${cauHinh}`} />;
			},
			onCell,
		},
		{
			title: 'Tổng số tiết đã xếp',
			dataIndex: 'daXep',
			align: 'center',
			sortable: true,
			width: 120,
			render: (val, rec) => {
				const tongSo = 45;
				return <Progress size='small' percent={Math.round((val * 100) / tongSo)} format={() => `${val}/${tongSo}`} />;
			},
			onCell,
		},
		{
			title: 'Chi tiết',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => onViewDetail(rec)}
					tooltip='Chi tiết lịch học'
					type='link'
					icon={<MenuOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginBottom: 8 }}>
				Lớp tín chỉ
			</div>

			<TableStaticData
				columns={columns}
				data={danhSachXepLich}
				size='small'
				hideChildrenRows
				otherProps={{ scroll: { y: 250 } }}
				hasTotal
			>
				<Segmented
					value={activeKey}
					onChange={(val) => setActiveKey(val.toString())}
					options={[
						{ value: '1', label: 'Được cấu hình trong tuần' },
						{ value: '2', label: 'Tất cả lớp' },
					]}
				/>
			</TableStaticData>

			{/* View thời khóa biểu, mã hóa lịch học với từng lớp */}
			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				cancelText='Đóng'
				okButtonProps={{ hidden: true }}
				styles={{ padding: 0 }}
				width={1000}
				maskClosable={false}
			>
				<ThoiKhoaBieuView />
			</Modal>
		</>
	);
};

export default TableLopHocPhanTKB;
