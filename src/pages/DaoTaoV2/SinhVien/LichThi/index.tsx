import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { ETrangThaiThi } from '@/services/DaoTaoV2/HocKy/constant';
import {
	colorDKDTCongNo,
	colorDKDTKetQuaHocTap,
	colorTrangThaiThi,
	EDKDTCongNo,
	EDKDTKetQuaHocTap,
} from '@/services/KhaoThi/LichThi/constant';
import { LichThi } from '@/services/KhaoThi/LichThi/typings';
import dayjs from '@/utils/dayjs';
import { EyeOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterHocKy from '../../HocKy/HocKy/components/FilterHocKy';

const LichThiSinhVien = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { getAllModel, danhSach, loading, setVisibleForm, visibleForm } = useModel('khaothi.lichthi');
	const [recLichThi, setRecLichThi] = useState<LichThi.IRecordSinhVien>();

	const getData = () => {
		if (recSinhVien?.ssoId && recHocKy?.ma) {
			getAllModel(undefined, undefined, undefined, undefined, `sv/${recSinhVien.ssoId}`, undefined, undefined, {
				maHocKy: recHocKy.ma,
			});
		}
	};
	useEffect(() => {
		getData();
	}, [recSinhVien?.ssoId, recHocKy?.ma]);

	const onCell = (rec: LichThi.IRecordSinhVien) => ({
		onClick: () => {
			setRecLichThi(rec);
			setVisibleForm(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichThi.IRecordSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'lichthi.column.dotthi' }),
			dataIndex: 'kyThi',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.ngaythi' }),
			dataIndex: 'ngayThi',
			align: 'center',
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.giothi' }),
			dataIndex: 'gioThi',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.mahocphan' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.tenhocphan' }),
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.phongthi' }),
			dataIndex: 'phong',
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.sosv' }),
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.dieukienduthi' }),
			width: 160,
			children: [
				{
					title: intl.formatMessage({ id: 'lichthi.column.dieukienduthi.kqht' }),
					dataIndex: 'dieuKienKetQuaHocTap',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTKetQuaHocTap),
					render: (val: EDKDTKetQuaHocTap) => val && <Tag color={colorDKDTKetQuaHocTap[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lichthi.column.congno' }),
					dataIndex: 'dieuKienCongNo',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTCongNo),
					render: (val: EDKDTCongNo) => val && <Tag color={colorDKDTCongNo[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lichthi.column.trangthaithi' }),
					dataIndex: 'trangThai',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(ETrangThaiThi),
					render: (val: ETrangThaiThi) => val && <Tag color={colorTrangThaiThi[val as ETrangThaiThi]}>{val}</Tag>,
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'lichthi.column.thaotac' }),
			align: 'center',
			width: 60,
			render: (rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'lichthi.tooltip.chitiet' })}
					type='link'
					icon={<EyeOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSach}
				addStt
				loading={loading}
				otherButtons={[<FilterHocKy isSetHocKy />]}
				onReload={getData}
			/>

			<Modal
				open={visibleForm}
				title={intl.formatMessage({ id: 'lichthi.modal.title' })}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setVisibleForm(false)}
			>
				{recLichThi?.lichThiId && (
					<>
						<Descriptions column={1} size='small'>
							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.dotthi' })}>
								{recLichThi?.kyThi}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.tenhocphan' })}>
								{recLichThi?.tenHocPhan}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.mahocphan' })}>
								{recLichThi?.maHocPhan}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.sosv' })}>
								{recLichThi?.soLuong}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.ngaythi' })}>
								{dayjs(recLichThi?.ngayGioThi).format('DD/MM/YYYY')}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.giothi' })}>
								{dayjs(recLichThi?.ngayGioThi).format('HH:mm')} – {dayjs(recLichThi?.ngayGioThiKetThuc).format('HH:mm')}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.thoiluong' })}>
								{recLichThi?.soPhut} {intl.formatMessage({ id: 'lichthi.modal.phut' })}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.phongthi' })}>
								{recLichThi?.phong || '--'}
							</Descriptions.Item>
						</Descriptions>

						<Descriptions style={{ marginTop: 12 }} column={1} size='small' bordered>
							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.ketquahoctap' })}>
								{recLichThi?.dieuKienKetQuaHocTap && (
									<Tag color={colorDKDTKetQuaHocTap[recLichThi?.dieuKienKetQuaHocTap]}>
										{recLichThi?.dieuKienKetQuaHocTap}
									</Tag>
								)}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.congno' })}>
								{recLichThi?.dieuKienCongNo && (
									<Tag color={colorDKDTCongNo[recLichThi?.dieuKienCongNo]}>{recLichThi?.dieuKienCongNo}</Tag>
								)}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'lichthi.modal.label.trangthaithi' })}>
								{recLichThi?.trangThai && (
									<Tag color={colorTrangThaiThi[recLichThi?.trangThai]}>{recLichThi.trangThai}</Tag>
								)}
							</Descriptions.Item>
						</Descriptions>
					</>
				)}
			</Modal>
		</>
	);
};

export default LichThiSinhVien;
