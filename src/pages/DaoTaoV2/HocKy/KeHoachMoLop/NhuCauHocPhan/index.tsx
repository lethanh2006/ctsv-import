import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import { ETrangThaiYKienHocPhan, colorYKienHocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { loaiNhuCauHocPhan, type ELoaiNhuCauHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Modal, Segmented, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import SinhVienHpHkPage from '../../SvHocPhan';

const NhuCauHocPhanPage = (props: { maHocPhan?: string; maKhoaNganh?: string }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, setRecord, record } = useModel('daotaov2.hocky.nhucauhocphan');
	const [segmentSelected, setSegmentSelected] = useState<string>('Tất cả');
	const { maHocPhan, maKhoaNganh } = props;
	const [visibleSvHpHk, setVisibleSvHpHk] = useState<boolean>(false);
	const [loaiNhuCau, setLoaiNhuCau] = useState<ELoaiNhuCauHocPhan>();

	const getData = () => {
		if (recHocKy?.ma)
			getModel(
				{ maKhoaNganh, maHocPhan, maHocKy: recHocKy?.ma },
				segmentSelected === 'Tất cả'
					? undefined
					: [
							{
								active: true,
								field: 'trangThaiYKien',
								operator: EOperatorType.INCLUDE,
								values: [ETrangThaiYKienHocPhan.CO_Y_KIEN],
							},
					  ],
			);
	};

	const columns: IColumn<DangKyNhuCau.INhuCauHocPhan>[] = [
		{
			title: 'Khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 180,
			render: (val, rec) => rec.khoaNganh?.ten ?? val,
			hide: !!maKhoaNganh,
		},
		{
			title: 'Học phần',
			dataIndex: 'maHocPhan',
			filterType: 'customselect',
			filterCustomSelect: <SelectHocPhan maHocKy={recHocKy?.ma} multiple />,
			render: (val, rec) => `${val} - ${rec.hocPhan.ten ?? ''}`,
			width: 200,
			hide: !!maHocPhan,
		},
		{
			title: 'Tổng số nhu cầu',
			align: 'center',
			render: (val, rec) =>
				(rec.soNhuCauCamThi ?? 0) +
				(rec.soNhuCauHocCaiThien ?? 0) +
				(rec.soNhuCauTheoKeHoach ?? 0) +
				(rec.soNhuCauHocLai ?? 0),
			width: 100,
		},
		{
			title: 'Ý kiến',
			dataIndex: 'trangThaiYKien',
			width: 200,
			filterType: segmentSelected === 'Tất cả' ? 'select' : undefined,
			filterData: Object.values(ETrangThaiYKienHocPhan).map((item) => ({ label: item, value: item })),
			render: (val: ETrangThaiYKienHocPhan, rec) => (
				<>
					<div style={{ textAlign: 'center' }}>
						<Tag color={colorYKienHocPhan[val]}>{val}</Tag>
					</div>
					<ExpandText>{rec.yKien ?? ''}</ExpandText>
				</>
			),
		},
		{
			title: 'Thời gian gửi',
			dataIndex: 'thoiGianGuiYKien',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Người gửi',
			dataIndex: 'hoTenCanBoGuiYKien',
			width: 120,
		},
	];

	const cols: IColumn<DangKyNhuCau.INhuCauHocPhan>[] = Object.entries(loaiNhuCauHocPhan).map(([field, title]) => ({
		title,
		dataIndex: field as ELoaiNhuCauHocPhan,
		width: 100,
		align: 'center',
		sortable: true,
		render: (val, rec) =>
			val && (
				<a
					href='#!'
					onClick={() => {
						setRecord(rec);
						setLoaiNhuCau(field as ELoaiNhuCauHocPhan);
						setVisibleSvHpHk(true);
					}}
				>
					{val}
				</a>
			),
	}));
	columns.splice(2, 0, { width: cols.length * 100, title: 'Số lượng sinh viên', children: cols });

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, recHocKy?.ma, maKhoaNganh, maHocPhan, segmentSelected]}
				modelName='daotaov2.hocky.nhucauhocphan'
				formProps={{ getData }}
				hideCard
				buttons={{ create: false }}
				otherButtons={[
					<Segmented
						key='1'
						options={['Tất cả', 'Đã có ý kiến']}
						value={segmentSelected}
						onChange={(val) => setSegmentSelected(val.toString())}
					/>,
				]}
			/>

			<Modal
				width={1000}
				title='Chi tiết nhu cầu học phần sinh viên'
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleSvHpHk(false)}
				open={visibleSvHpHk}
			>
				<SinhVienHpHkPage maHocPhan={record?.maHocPhan} maKhoaNganh={record?.maKhoaNganh} loaiNhuCau={loaiNhuCau} />
			</Modal>
		</>
	);
};

export default NhuCauHocPhanPage;
