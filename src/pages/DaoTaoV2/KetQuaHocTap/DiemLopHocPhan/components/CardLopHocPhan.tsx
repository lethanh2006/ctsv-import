import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import FilterHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/Filter';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiLopHocPhan,
	ETrangThaiDiemLop,
	ETrangThaiLopHocPhan,
	colorTrangThaiDiemLop,
} from '@/services/DaoTaoV2/HocKy/constant';
import { Card, Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';

/** Card filter Lớp tín chỉ */
const CardLopHocPhan = (props: {
	child: (getData: () => void) => JSX.Element;
	statistics?: () => JSX.Element;
	title?: string;
	hideTrangThai?: boolean;
}) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { danhSach: danhSachHocPhan, record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { page, limit, setRecord, getModel, record } = useModel('daotaov2.hocky.lophocphan');
	const { child, hideTrangThai, statistics } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState(hideTrangThai ? '30%' : '50%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const onCell = (rec: LopHocPhan.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const getData = () =>
		recHocKy?.ma &&
		getModel(
			{
				loai: ELoaiLopHocPhan.CHINH,
				maHocKy: recHocKy?.ma,
				maHocPhan: recHocPhan?.ma,
				trangThaiLop: ETrangThaiLopHocPhan.MO,
			},
			!recHocPhan?.ma && recDonVi?.maDonVi
				? [
						{
							active: true,
							field: 'maHocPhan',
							operator: EOperatorType.INCLUDE,
							values: danhSachHocPhan.length ? danhSachHocPhan.map((item) => item.ma) : [''],
						},
				  ]
				: undefined,
		).then((data) => {
			// Set lại giá trị cho lớp tín chỉ
			setRecord(data.find((i) => i._id === record?._id) ?? data?.[0]);
		});

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Mã lớp',
			dataIndex: 'ten',
			width: 140,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			width: 160,
			render: (val, rec) => rec.hocPhan?.ten,
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
							item.nhanSu?.hoDem
								? [item.nhanSu?.hoDem, item.nhanSu?.ten].join(' ')
								: item.tenNhanSu ?? 'Không lấy được thông tin',
						)
						?.join(', ') ?? <i>Không có thông tin</i>}
				</ExpandText>
			),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDiemLop',
			align: 'center',
			render: (val: ETrangThaiDiemLop, rec) => (
				<>
					<Tag color={colorTrangThaiDiemLop[val]}>{val}</Tag>
					{val === ETrangThaiDiemLop.CHUA_NOP_DIEM && rec.thoiGianNhapDiem?.start && rec.thoiGianNhapDiem?.end ? (
						<div
							style={{
								fontSize: 12,
								fontStyle: 'italic',
								color: dayjs().isAfter(rec.thoiGianNhapDiem.end) ? 'red' : undefined,
							}}
						>
							Thời gian nộp điểm từ {dayjs(rec.thoiGianNhapDiem?.start).format('DD/MM/YYYY')} đến{' '}
							{dayjs(rec.thoiGianNhapDiem.end).format('DD/MM/YYYY')}
						</div>
					) : null}
				</>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDiemLop),
			width: 190,
			hide: hideTrangThai,
			onCell,
		},
	];

	return (
		<Card title={props.title ?? `${intl.formatMessage({ id: 'ketquahoctap.diemlophocphan.title' })}`}>
			<FilterHocPhan />

			<Row gutter={[12, 12]}>
				{statistics ? <Col span={24}>{statistics()}</Col> : null}

				<Col span={24}>
					<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
						<Pane initialSize={paneSize} minSize='20%'>
							<Card title='Lớp tín chỉ' styles={{ padding: '8px 0 0' }} headStyle={{ padding: 0 }} bordered={false}>
								<TableBase
									hideCard
									getData={getData}
									columns={columns}
									dependencies={[page, limit, recHocKy?.ma, recHocPhan?.ma]}
									modelName='daotaov2.hocky.lophocphan'
									buttons={{ reload: false, create: false, filter: false }}
									otherProps={{ size: 'small', scroll: { y: 600 } }}
									// hideChildrenRows
									addStt={false}
								/>
							</Card>
						</Pane>
						<Pane minSize='40%'>{child(getData)}</Pane>
					</SplitPane>
				</Col>
			</Row>
		</Card>
	);
};

export default CardLopHocPhan;
