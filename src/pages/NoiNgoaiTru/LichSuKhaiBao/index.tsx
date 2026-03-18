import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { colorETrangThaiKhaiBaoNoiNgoaiTru, type ETrangThaiKhaiBaoNoiNgoaiTru } from '@/services/NoiNgoaiTru/constant';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietKhaiBao from './ChiTietKhaiBao';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EyeOutlined } from '@ant-design/icons';

const LichSuKhaiBaoPage = () => {
	const { getAllModel, setRecord } = useModel('noingoaitru.khaibao');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [viewChiTiet, setViewChiTiet] = useState<boolean>(false);
	const [danhSach, setDanhSach] = useState<NoiNgoaiTru.IKhaiBao[]>();

	const getData = () =>
		getAllModel(undefined, undefined, undefined, undefined, `sinh-vien/${recSinhVien?.ssoId}`, false).then((rec) =>
			setDanhSach(rec),
		);

	useEffect(() => {
		getData();
	}, [recSinhVien?.ssoId]);

	const onCell = (rec: NoiNgoaiTru.IKhaiBao) => ({
		onClick: () => (setViewChiTiet(true), setRecord(rec)),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NoiNgoaiTru.IKhaiBao>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'dotKhaiBaoId',
			width: 150,
			render: (val, rec) => rec.dotKhaiBao?.hocKy?.ten ?? rec.dotKhaiBao?.maHocKy,
			onCell,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'dotKhaiBaoId',
			align: 'center',
			width: 150,
			render: (val, rec) => rec.dotKhaiBao?.tenDot,
			onCell,
		},

		{
			title: 'Thời gian',
			dataIndex: 'dotKhaiBaoId',
			align: 'center',
			width: 250,
			render: (val, rec) => {
				return (
					<>
						{dayjs(rec.dotKhaiBao?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
						{dayjs(rec.dotKhaiBao?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</>
				);
			},
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 150,
			render: (val, rec) => (
				<Tag color={colorETrangThaiKhaiBaoNoiNgoaiTru[val as ETrangThaiKhaiBaoNoiNgoaiTru]}>{val}</Tag>
			),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Xem chi tiết'
					type='link'
					icon={<EyeOutlined />}
					onClick={() => (setViewChiTiet(true), setRecord(rec))}
				/>
			),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSach ?? []}
				size='small'
				addStt
				otherProps={{ scroll: { y: 380 }, pagination: true }}
				hasTotal
			/>

			<ChiTietKhaiBao visibleForm={viewChiTiet} setVisibleForm={setViewChiTiet} />
		</>
	);
};

export default LichSuKhaiBaoPage;
