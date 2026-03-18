import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import DeCuongHocPhanPage from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/DeCuongHocPhan';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { duyetDeCuongTuLopHocPhan, getDeCuongHPHKDaDuyet } from '@/services/DaoTaoV2/HocKy/HocKy';
import { CheckCircleOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Segmented, Tag, Tooltip, message } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const RaSoatDeCuong = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const {
		record: recHocPhan,
		page,
		setPage,
		limit,
		visibleForm,
		setVisibleForm,
		handleEdit,
		total,
		getModel,
		loading,
		setLoading,
	} = useModel('daotaov2.hocphan.hocphan');
	const { duyetDeCuongHocKyModel, duyetDeCuongHocPhanModel } = useModel('daotaov2.hocphan.decuonghphk');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { getModel: getDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [childColumns, setChildColumns] = useState<IColumn<any>[]>([]);
	const [activeKey, setActiveKey] = useState('not_in');
	const [hocPhanDaDuyet, setHocPhanDaDuyet] = useState<string[]>(['1']);

	const getData = () =>
		getModel(
			{ maDonVi: recDonVi?.maDonVi, active: activeKey === 'inactive' ? false : undefined },
			undefined,
			undefined,
			undefined,
			undefined,
			activeKey === 'all' || activeKey === 'inactive' ? undefined : `de-cuong-hp-hk/hoc-phan/hoc-ky/${recHocKy?.ma}`,
			activeKey === 'in' || activeKey === 'not_in' ? { operator: activeKey } : undefined,
			undefined,
			activeKey === 'in' || activeKey === 'not_in',
		);

	const getDaDuyet = () => {
		if (recHocKy?.ma) {
			setLoading(true);
			getDeCuongHPHKDaDuyet(recHocKy?.ma)
				.then((res) => {
					const daDuyet: string[] = res.data?.data ?? [];
					setHocPhanDaDuyet(daDuyet);
				})
				.catch((er) => console.log(er))
				.finally(() => setLoading(false));
		}
	};

	const onCell = (record: HocPhan.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	// Chèn các cột trọng số học phần
	useEffect(() => {
		getDauDiem().then((dauDiem) => {
			const cols: IColumn<any>[] = dauDiem.map((item) => ({
				title: item.ten,
				width: 80,
				dataIndex: ['deCuongHienTai', `trongSo${item.field}`],
				align: 'center',
				onCell,
				render: (val) => (!!val ? val + '%' : '--'),
			}));
			cols.push({
				title: 'Điểm KTHP',
				width: 80,
				align: 'center',
				onCell,
				render: (val, rec: HocPhan.IRecord) => {
					const sum = _.sum(
						dauDiem.map((item) => rec.deCuongHienTai?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan]),
					);
					return 100 - (sum || 0) + '%';
				},
			});
			setChildColumns(cols);
		}); // Max 10 đầu điểm
	}, []);

	useEffect(() => {
		getDaDuyet();
	}, [recHocKy?.ma]);

	const handleCheck = (rec: HocPhan.IRecord) => {
		if (recHocKy?.ma)
			duyetDeCuongHocPhanModel(recHocKy.ma, [rec.ma])
				.then(() => getDaDuyet())
				.catch((er) => console.log(er));
	};

	const handleCheckAll = () => {
		if (total)
			Modal.confirm({
				title: 'Duyệt đề cương chi tiết học phần',
				content: <>Xác nhận duyệt tất cả đề cương chi tiết học phần cho học kỳ này?</>,
				onOk: () => {
					if (recHocKy?.ma)
						duyetDeCuongHocKyModel(recHocKy.ma)
							.then(() => getDaDuyet())
							.catch((er) => console.log(er));
				},
			});
	};

	const handleDuyetTheoLop = () => {
		if (recHocKy?.ma) {
			setLoading(true);
			duyetDeCuongTuLopHocPhan(recHocKy?.ma)
				.then(() => {
					getData();
					message.success('Đã duyệt');
				})
				.catch((er) => console.log(er))
				.finally(() => setLoading(false));
		}
	};

	const columns: IColumn<HocPhan.IRecord>[] = [
		{
			title: 'Mã học phần',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Đơn vị quản lý',
			width: 150,
			dataIndex: 'maDonVi',
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) => rec.donVi?.ten ?? val,
			onCell,
			hide: !!recDonVi?.maDonVi,
		},
		{
			title: 'Phiên bản đề cương',
			width: 100,
			render: (val, rec) => rec.deCuongHienTai?.ma ?? '--',
			onCell,
		},
		{
			title: 'Trạng thái',
			width: 130,
			dataIndex: 'ma',
			align: 'center',
			render: (val, rec) =>
				hocPhanDaDuyet.includes(val) ? (
					<Tag color='green'>Đã duyệt</Tag>
				) : !rec.active ? (
					<Tag color='red'>Không hoạt động</Tag>
				) : (
					<Tag color='yellow'>Chưa duyệt</Tag>
				),
			onCell,
			hide: activeKey !== 'all',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			hide: activeKey === 'in' || activeKey === 'inactive',
			render: (val, rec) => (
				<>
					<Tooltip title='Duyệt đề cương'>
						<Popconfirm
							onConfirm={() => handleCheck(rec)}
							title='Bạn có chắc chắn muốn duyệt đề cương cho học phần này?'
							placement='topRight'
							disabled={hocPhanDaDuyet.includes(rec.ma) || !rec.active}
						>
							<Button
								type='link'
								icon={
									<CheckOutlined
										style={{
											color: hocPhanDaDuyet.includes(rec.ma) || !rec.active ? '#bbb' : '#52c41a',
										}}
									/>
								}
								disabled={hocPhanDaDuyet.includes(rec.ma) || !rec.active}
							/>
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<EditOutlined />}
							disabled={hocPhanDaDuyet.includes(rec.ma) || !rec.active}
						/>
					</Tooltip>
				</>
			),
		},
	];
	columns.splice(5, 0, {
		title: 'Trọng số học phần',
		width: childColumns.length * 80,
		children: childColumns,
	});

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDonVi?.maDonVi, activeKey, recHocKy?.ma]}
				modelName='daotaov2.hocphan.hocphan'
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<Button
						key='1'
						icon={<CheckCircleOutlined />}
						type='primary'
						onClick={handleCheckAll}
						loading={loading}
						disabled={activeKey === 'in' || activeKey === 'inactive' || !total || loading}
					>
						Duyệt tất cả
					</Button>,
					<Button key='2' onClick={handleDuyetTheoLop} loading={loading} type='link'>
						Duyệt đề cương theo Lớp tín chỉ đã import
					</Button>,
				]}
			>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
					<Segmented
						options={[
							{ value: 'in', label: 'Đã duyệt' },
							{ value: 'not_in', label: 'Chưa duyệt' },
							{ value: 'inactive', label: 'Không hoạt động' },
							{ value: 'all', label: 'Tất cả học phần' },
						]}
						value={activeKey}
						onChange={(val) => {
							setActiveKey(val.toString());
							setPage(1);
						}}
					/>
					<SelectDonVi
						value={recDonVi?.maDonVi}
						style={{ width: 350 }}
						onChange={(val) => {
							setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
						}}
						allowClear
						placeholder='Chọn đơn vị quản lý'
					/>
				</div>
			</TableBase>

			<Modal
				open={visibleForm}
				onCancel={() => {
					setVisibleForm(false);
					getData();
				}}
				footer={null}
				width={1000}
				styles={{ padding: 0 }}
				maskClosable={false}
			>
				<Card title={`Đề cương chi tiết học phần ${recHocPhan?.ten}`}>
					<DeCuongHocPhanPage />
				</Card>
			</Modal>
		</>
	);
};

export default RaSoatDeCuong;
