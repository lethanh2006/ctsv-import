import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import {
	colorTrangThaiDuyetCanhBao,
	colorYKienCoVanHocTap,
	ELoaiThoiHoc,
	ETrangThaiDuyetCanhBao,
	EYKienCoVanHocTap,
} from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import {
	CheckCircleOutlined,
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	NotificationOutlined,
	RetweetOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Alert, Modal, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ConfirmKetThucDotCanhBao from './ConfirmKetThuc';
import Form from './Form';
import StatSinhVienCanhBao from './Stat';

const CanhBaoHocTapTable = (props: { isKetQua?: boolean; isThoiHoc?: boolean }) => {
	const { isKetQua, isThoiHoc } = props;
	const intl = useIntl();
	const { record: recHocKy, setRecord: setRecHocKy, getModel: getHocKy } = useModel('daotaov2.hocky.hocky');
	const {
		page,
		limit,
		setRecord,
		record: recCanhBao,
		danhSach,
		formSubmiting,
		getModel,
		deleteModel,
		putModel,
		khoiTaoCanhBaoSinhVienModel,
		tinhLaiCanhBaoSinhVienModel,
		duyetAllCanhBaoSinhVienModel,
		guiThongBaoHocVuModel,
		setFilters,
	} = useModel(isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao');
	const { thongkeSinhVienCanhBaoModel } = useModel('daotaov2.ketquahoctap.xethocvu.thongke');
	const { handleView } = useModel('daotaov2.sinhvien.sinhvien');
	const [viewChot, setViewChot] = useState<boolean>(false);
	const ngoaiThoiGianHopHoiDong =
		isKetQua === undefined && (!recHocKy?.tgHopHoiDongHvu || dayjs().isAfter(recHocKy?.tgHopHoiDongHvu, 'd'));

	const getData = () => recHocKy?.ma && getModel({ maHocKy: recHocKy.ma });

	useEffect(() => {
		setFilters([]);
	}, [recHocKy?.ma, isThoiHoc]);

	const handleGenerate = () => {
		if (recHocKy?.ma)
			khoiTaoCanhBaoSinhVienModel(recHocKy.ma).then(() => {
				getData();
			});
	};

	const handleRefresh = (rec: XetHocVu.IRecord) => {
		if (rec._id)
			tinhLaiCanhBaoSinhVienModel(rec._id)
				.then(() => {
					getData();
				})
				.catch((er) => console.log(er));
	};

	const handleDuyet = (rec: XetHocVu.IRecord, trangThai: ETrangThaiDuyetCanhBao) => {
		if (rec._id)
			putModel(rec._id ?? '', { trangThai }, getData)
				.then(() => {
					if (recHocKy?.ma)
						thongkeSinhVienCanhBaoModel(isThoiHoc ? 'thoi-hoc' : 'canh-bao-ket-qua-hoc-tap', recHocKy?.ma);
				})
				.catch((er) => console.log(er));
	};

	const handleDuyetAll = () =>
		recHocKy?.ma &&
		duyetAllCanhBaoSinhVienModel(recHocKy?.ma, { trangThai: ETrangThaiDuyetCanhBao.DA_DUYET })
			.then(() => {
				getData();
				if (recHocKy?.ma)
					thongkeSinhVienCanhBaoModel(isThoiHoc ? 'thoi-hoc' : 'canh-bao-ket-qua-hoc-tap', recHocKy?.ma);
			})
			.catch((er) => console.log(er));

	const onSendRequest = () => {
		Modal.confirm({
			title: `Gửi thông báo ${isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'}`,
			content: (
				<>
					Xác nhận gửi thông danh sách sinh viên xem xét {isThoiHoc ? 'cho thôi học' : ' cảnh báo học tập'}{' '}
					<b>{recHocKy?.ten}</b>?
				</>
			),
			onOk: () => {
				if (recHocKy?.ma)
					guiThongBaoHocVuModel(recHocKy.ma)
						.then(() => {})
						.catch((er) => console.log(er));
			},
		});
	};

	const handleSinhVien = (rec: XetHocVu.IRecord) => {
		setRecord(rec);
		handleView();
	};

	const handleKetThucDot = () => {
		if (recHocKy?._id) setViewChot(true);
	};

	const columns: IColumn<XetHocVu.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => (
				<a href='#!' onClick={() => handleSinhVien(rec)}>
					{val}
				</a>
			),
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Lớp hành chính',
			dataIndex: 'tenLopHanhChinh',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Lý do',
			dataIndex: 'danhSachLyDo',
			width: 350,
			render: (val, rec) => rec.danhSachLyDo?.map((item) => <div key={item._id}>- {item.noiDung}</div>),
		},
		{
			title: 'Ý kiến CVHT',
			dataIndex: 'trangThaiYKienCVHT',
			width: 200,
			filterType: 'select',
			filterData: Object.values(EYKienCoVanHocTap),
			render: (val: EYKienCoVanHocTap, rec) => (
				<>
					{val && (
						<div style={{ textAlign: 'center' }}>
							<Tag color={colorYKienCoVanHocTap[val]}>{val}</Tag>
						</div>
					)}
					<ExpandText>{rec.yKienCoVanHocTap}</ExpandText>
				</>
			),
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 150,
			render: (val, rec) => rec.nganh?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
		},
		{
			title: 'Loại thôi học',
			dataIndex: 'loaiThoiHoc',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiThoiHoc),
			hide: !isThoiHoc,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetCanhBao),
			render: (val, rec) => <Tag color={colorTrangThaiDuyetCanhBao[val as ETrangThaiDuyetCanhBao]}>{val}</Tag>,
			width: 120,
			hide: !isKetQua,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: XetHocVu.IRecord) =>
				!isKetQua ? (
					<>
						<Popconfirm
							onConfirm={() => handleRefresh(record)}
							title='Bạn có chắc chắn muốn cập nhật sinh viên này?'
							placement='topRight'
						>
							<ButtonExtend
								disabled={
									(isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao) || ngoaiThoiGianHopHoiDong
								}
								tooltip='Cập nhật'
								type='link'
								icon={<RetweetOutlined />}
							/>
						</Popconfirm>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa sinh viên này?'
							placement='topRight'
						>
							<ButtonExtend
								disabled={
									record.trangThai === ETrangThaiDuyetCanhBao.DA_DUYET ||
									record.trangThai === ETrangThaiDuyetCanhBao.KHONG_DUYET ||
									(isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao) ||
									ngoaiThoiGianHopHoiDong
								}
								tooltip='Xóa'
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				) : (
					<>
						<Popconfirm
							onConfirm={() => handleDuyet(record, ETrangThaiDuyetCanhBao.DA_DUYET)}
							title={`Bạn có chắc chắn muốn duyệt ${isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'} sinh viên?`}
							placement='topRight'
						>
							<ButtonExtend
								disabled={isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao}
								tooltip='Duyệt'
								type='link'
								className='btn-success'
								icon={<CheckOutlined />}
							/>
						</Popconfirm>
						<Popconfirm
							onConfirm={() => handleDuyet(record, ETrangThaiDuyetCanhBao.KHONG_DUYET)}
							title={`Bạn có chắc chắn không duyệt ${isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'} sinh viên?`}
							placement='topRight'
						>
							<ButtonExtend
								disabled={isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao}
								tooltip='Không duyệt'
								danger
								type='link'
								icon={<CloseOutlined />}
							/>
						</Popconfirm>
					</>
				),
		},
	];

	return (
		<>
			{!isThoiHoc && recHocKy?.daChotKqCanhBao ? (
				<Alert
					showIcon
					type='success'
					description='Đã chốt danh sách sinh viên cảnh báo học tập'
					style={{ marginBottom: 18 }}
				/>
			) : isThoiHoc && recHocKy?.daChotKqThoiHoc ? (
				<Alert
					showIcon
					type='success'
					description='Đã chốt danh sách sinh viên cho thôi học'
					style={{ marginBottom: 18 }}
				/>
			) : null}

			{!isThoiHoc && recHocKy?.daGuiTBDanhSachCanhBaoSoBo ? (
				<Alert
					showIcon
					type='success'
					description='Đã gửi thông báo tới sinh viên cảnh báo học tập'
					style={{ marginBottom: 18 }}
				/>
			) : isThoiHoc && recHocKy?.daChotKqThoiHoc ? (
				<Alert
					showIcon
					type='success'
					description='Đã gửi thông báo tới sinh viên cho thôi học'
					style={{ marginBottom: 18 }}
				/>
			) : null}

			{isKetQua ? <StatSinhVienCanhBao isThoiHoc={isThoiHoc} /> : null}

			<TableBase
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName={isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao'}
				title={
					isThoiHoc
						? intl.formatMessage({ id: 'ketquahoctap.xulyketqua.thoihoc.title' })
						: intl.formatMessage({ id: 'ketquahoctap.xulyketqua.canhbao.title' })
				}
				hideCard
				Form={Form}
				formProps={{ isThoiHoc }}
				widthDrawer={600}
				buttons={{
					export: true,
					create:
						isKetQua || (isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao) || ngoaiThoiGianHopHoiDong
							? false
							: true,
				}}
				otherButtons={
					!isKetQua
						? [
								<ButtonExtend
									disabled={
										(isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao) ||
										ngoaiThoiGianHopHoiDong ||
										!danhSach.length ||
										(isThoiHoc ? recHocKy?.daGuiTBDanhSachThoiHocSoBo : recHocKy?.daGuiTBDanhSachCanhBaoSoBo)
									}
									icon={<NotificationOutlined />}
									key='2'
									onClick={onSendRequest}
								>
									Gửi thông báo
								</ButtonExtend>,
								<Popconfirm
									onConfirm={handleGenerate}
									key='1'
									title={`Xác nhận khởi tạo lại danh sách SV ${isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'}?`}
								>
									<ButtonExtend
										disabled={
											(isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao) || ngoaiThoiGianHopHoiDong
										}
										loading={formSubmiting}
										icon={<RetweetOutlined />}
									>
										Khởi tạo lại
									</ButtonExtend>
								</Popconfirm>,
						  ]
						: [
								<Popconfirm
									title={`Xác nhận duyệt ${isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'} toàn bộ sinh viên?`}
									onConfirm={handleDuyetAll}
									key='all'
								>
									<ButtonExtend
										disabled={!danhSach.length || (isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao)}
										icon={<CheckCircleOutlined />}
										type='default'
									>
										Duyệt cảnh báo
									</ButtonExtend>
								</Popconfirm>,
								<ButtonExtend
									disabled={!danhSach.length || (isThoiHoc ? recHocKy?.daChotKqThoiHoc : recHocKy?.daChotKqCanhBao)}
									icon={<SaveOutlined />}
									type='primary'
									className='btn-success'
									onClick={handleKetThucDot}
									key='chot'
								>
									Chốt danh sách
								</ButtonExtend>,
						  ]
				}

				// {/* <Popconfirm key='revert-end' onConfirm={() => {}} title='Xác nhận tiếp tục đợt xét cảnh báo?'>
				// 	<ButtonExtend icon={<RollbackOutlined />}>Tiếp tục xét</ButtonExtend>
				// </Popconfirm> */}
			/>

			<ModalChiTietSinhVien sinhVienSsoId={recCanhBao?.sinhVienSsoId ?? ''} hasDetail />

			<ConfirmKetThucDotCanhBao
				onOk={() =>
					getHocKy().then((res) => {
						setRecHocKy(res?.find((item) => recHocKy?.ma === item.ma));
						getData();
					})
				}
				isThoiHoc={isThoiHoc}
				visibleForm={viewChot}
				setVisibleForm={setViewChot}
			/>
		</>
	);
};

export default CanhBaoHocTapTable;
