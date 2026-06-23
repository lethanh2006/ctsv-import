import ExpandText from '@/components/ExpandText';
import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ColorDiemChu, type ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import { initTenPhongBan } from '@/utils/constants';
import {
	CheckOutlined,
	DiffOutlined,
	FileTextOutlined,
	ImportOutlined,
	PrinterOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import { Checkbox, Popconfirm, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import ViewDiemLopHocPhan from '../../DiemLopHocPhan/components/ViewDiemLopHocPhan';
import ModalLichSuNhapDiem from '../../LichSuNhapDiem';
import TitlePrintKQHT from './TitlePrintKQHT';

type TLocalView = LopHocPhan.TViewDiemHocKy & { isHeader?: boolean };

/** Đã bao gồm get KQHT Học kỳ */
const TableDiemHocPhan = (props: {
	sinhVienSsoId: string;
	maKhoaNganh: string;
	hocKyList?: string[];
	namHocId?: string;
	hideTitle?: boolean;
}) => {
	const intl = useIntl();
	const {
		getKetQuaHkSvModel,
		formSubmiting: formSubmitingKq,
		tinhDiemSinhVienModel,
	} = useModel('daotaov2.ketquahoctap.ketquahocky');
	const { getByKhoaNganhModel, loading, toggleSkipModel } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { getModel: getDauDiem, danhSach: danhSachDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [data, setData] = useState<TLocalView[]>([]);
	const [showDiemTp, setShowDiemTp] = useState<boolean>(false);
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState<boolean>(false);
	const [diemHpSvHkId, setDiemHpSvHkId] = useState<string>();
	const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
	// const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const componentRef = useRef(null);
	const { sinhVienSsoId, hocKyList = [], namHocId, hideTitle, maKhoaNganh } = props;
	const [visibleExport, setVisibleExport] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);

	/** Get Data theo điều kiện: Học kỳ, Năm học hoặc Toàn khóa */
	const getDiemSvHk = (): Promise<LopHocPhan.IDiemHpSvHk[]> => {
		if (sinhVienSsoId && maKhoaNganh)
			return getByKhoaNganhModel(sinhVienSsoId, maKhoaNganh, {
				namHocId,
				maHocKy: namHocId ? undefined : hocKyList?.[0],
			});
		return Promise.reject('Invalid sinhVien');
	};

	const getData = async () => {
		if (!sinhVienSsoId || !maKhoaNganh) return Promise.reject('Invalid');

		return Promise.all([getKetQuaHkSvModel(sinhVienSsoId, maKhoaNganh, hocKyList), getDiemSvHk()]).then(
			([kqhkList, diemList]) => {
				const res: any[] = [];
				const gHocKy = _.groupBy(diemList, (item) => item.maHocKy); // Nhóm theo học kỳ
				const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp giảm dần học kỳ
				aHocKy.forEach(([mahk, diemHpHkList]) => {
					const kqhk = kqhkList.find((j) => j.maHocKy === mahk);
					let tenHocPhan =
						diemHpHkList[0]?.hocKy?.ten ??
						intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hocky_mahk' }, { 0: mahk });
					if (kqhk)
						tenHocPhan += ` (${intl.formatMessage(
							{ id: 'ketquahoctap.ketquahocky.tbhk_tb' },
							{ 0: kqhk.trungBinhHocKyThang4 ?? '--' },
						)} | ${intl.formatMessage({ id: 'ketquahoctap.ketquahocky.dat_tc' }, { 0: kqhk.tongSoTinChiHocKy ?? '--' })} | ${intl.formatMessage(
							{ id: 'ketquahoctap.ketquahocky.tichluy_tc' },
							{ 0: kqhk.tongSoTinChiTichLuyToanKhoa ?? '--' },
						)})`;
					// Thêm 1 hàng trống => Tên học kỳ
					res.push({ _id: `header-${mahk}`, isHeader: true, tenHocPhan, maHocKy: mahk });
					// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
					// const hpTrongCtdt = diemHpHkList.filter((hp) => hp.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt);
					res.push(
						...diemHpHkList.map((diem, index) => ({
							...diem,
							title: `${index + 1}`,
							tenHocPhan: diem.hocPhan?.ten,
							maHocPhanQuyDoi:
								diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi !== diem.maHocPhan
									? diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi
									: '',
							trongChuongTrinh: diem.skip || (diem.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt ?? false),
							tichLuy:
								diem.tichLuy ??
								(diem.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt &&
									diem.infoKhoaNganh?.[maKhoaNganh]?.maHocKyCaiThien === diem.maHocKy &&
									diem.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy !== false),
						})),
					);
				});

				setData(res);
				return kqhkList;
			},
		);
	};

	useEffect(() => {
		if (!danhSachDauDiem.length) getDauDiem(); // Max 10 đầu điểm
	}, []);

	useEffect(() => {
		getData();
	}, [sinhVienSsoId, JSON.stringify(hocKyList), namHocId, maKhoaNganh]);

	const handlePrintBangDiem = useReactToPrint({ contentRef: componentRef });

	const onRecalculate = () => {
		if (sinhVienSsoId) {
			tinhDiemSinhVienModel(sinhVienSsoId).then(() => {
				getData();
			});
		}
	};

	const onToggle = (id: string) => () => {
		toggleSkipModel(id).then(() => getData());
	};

	const onCell = (rec: TLocalView) => ({
		onClick: () => {
			if (!rec.isHeader) {
				setDiemHpSvHkId(rec._id);
				setVisibleChiTietDiem(true);
			}
		},
		style: {
			cursor: rec.isHeader ? undefined : 'pointer',
			fontWeight: rec.isHeader ? 600 : undefined,
			backgroundColor: rec.isHeader ? '#e8fafdbf' : undefined,
			color: rec.skip ? '#bbb' : undefined,
		},
		colSpan: rec.isHeader ? 0 : 1,
	});

	const columns: IColumn<TLocalView>[] = [
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tt' }),
			dataIndex: 'title',
			width: 40,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.mahp' }),
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
			render: (val, rec) =>
				rec.trongChuongTrinh ? (
					val
				) : (
					<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.khongtrongctdt' })}>
						<u className='text-warning'>{val}</u>
					</Tooltip>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.quydoi' }),
			dataIndex: 'maHocPhanQuyDoi',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tenhocphan' }),
			dataIndex: 'tenHocPhan',
			width: 200,
			filterType: 'string',
			onCell: (rec: TLocalView) => ({
				...onCell(rec),
				colSpan: rec.isHeader ? 10 + (showDiemTp ? danhSachDauDiem.length + 1 : 0) : 1,
			}),
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tc' }),
			width: 40,
			align: 'center',
			render: (val, rec) => rec?.hocPhan?.soTinChi,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tl' }),
			// dataIndex: 'tichLuy',
			width: 40,
			align: 'center',
			render: (val, rec) =>
				rec.tichLuy || rec.skip ? (
					<Popconfirm
						title={intl.formatMessage(
							{ id: 'ketquahoctap.ketquahocky.xacnhanboqua' },
							{ 0: !rec.skip ? intl.formatMessage({ id: 'ketquahoctap.ketquahocky.boquakhong' }) : '' },
						)}
						placement='topLeft'
						onConfirm={onToggle(rec._id)}
					>
						<Tooltip
							title={
								rec.skip
									? intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hpdatchungkhongtinh' })
									: rec.tichLuy
										? intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hpcotinhtichluy' })
										: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hpkhongtichluy' })
							}
						>
							<a onClick={(e) => e.preventDefault()} style={{ color: rec.skip ? '#bbb' : undefined }}>
								<CheckOutlined />
							</a>
						</Tooltip>
					</Popconfirm>
				) : null,
			onCell: (rec) => ({ ...onCell(rec), onClick: undefined }),
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.kthp' }),
			dataIndex: 'diemKthp',
			width: 60,
			align: 'center',
			render: (val, rec) =>
				!!rec.trangThaiDuThi && rec.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
					<span title={trangThaiDuThi[rec.trangThaiDuThi]}>{rec?.trangThaiDuThi}</span>
				) : (
					val
				),
			// sortable: true,
			onCell,
			hide: !showDiemTp,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.diemtongket' }),
			width: 180,
			children: [
				{
					title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.he10' }),
					dataIndex: 'diemTongKet',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.he4' }),
					dataIndex: 'diemThang4',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.chu' }),
					dataIndex: 'diemChu',
					width: 60,
					align: 'center',
					render: (val, rec) => (
						<>
							<Tag color={ColorDiemChu[val as ELoaiDiemChu]}>{val}</Tag>{' '}
							{rec?.isCongNhanQuyDoiDiem && (
								<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.diemquydoi_tooltip' })}>(R)</Tooltip>
							)}
						</>
					),
					// filterType: 'select',
					// filterData: Object.values(ELoaiDiemChu),
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.ghichu' }),
			dataIndex: 'ghiChuDiem',
			width: 100,
			align: 'center',
			render: (val) => val && <ExpandText>{val}</ExpandText>,
			onCell,
		},
	];
	const cols: IColumn<LopHocPhan.IDiemHpSvHk & Record<string, any>>[] = danhSachDauDiem.map((item: any) => ({
		title: item.ma ?? item.ten,
		width: 60,
		dataIndex: `diemThanhPhan${item.field}`,
		align: 'center',
		render: (val, rec) =>
			val && (
				<>
					{val}
					{rec[`trongSo${item.field}`] ? (
						<div>
							<i>
								<small>({rec[`trongSo${item.field}`] ?? 0}%)</small>
							</i>
						</div>
					) : null}
				</>
			),
		onCell,
	}));
	if (cols.length)
		columns.splice(6, 0, {
			title: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.diemthanhphan' }),
			width: cols.length * 60,
			children: cols,
			hide: !showDiemTp,
		});

	return (
		<>
			{!hideTitle ? (
				<div className='ant-descriptions-title' style={{ fontSize: '16px', padding: '16px 0 8px 0' }}>
					{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.danhsachhocphanchitiet' })}
				</div>
			) : null}

			<TableStaticData
				columns={columns}
				data={data}
				size='small'
				loading={loading}
				otherProps={{ pagination: false, scroll: { y: 500 } }}
				otherButtons={[
					<Popconfirm
						title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xacnhantinhlaikqhk' })}
						onConfirm={onRecalculate}
						key='update'
					>
						<ButtonExtend
							icon={<RetweetOutlined />}
							tooltip={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinhlaiketquahoctap' })}
							loading={formSubmitingKq}
						>
							{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.capnhat' })}
						</ButtonExtend>
					</Popconfirm>,
					<ButtonExtend icon={<FileTextOutlined />} onClick={() => setVisibleExport(true)} key='export'>
						{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiem' })}
					</ButtonExtend>,
					<ButtonExtend icon={<ImportOutlined />} onClick={() => setVisibleImport(true)} key='import'>
						{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.nhapdiem' })}
					</ButtonExtend>,

					<ButtonExtend
						icon={<PrinterOutlined />}
						tooltip={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.inbangdiem' })}
						onClick={() => handlePrintBangDiem()}
						key='print'
					/>,

					<ButtonExtend
						icon={<DiffOutlined />}
						onClick={() => setVisibleHistory(true)}
						tooltip={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.lichsuthaotac' })}
						key='history'
					/>,
					<Checkbox
						checked={showDiemTp}
						onChange={({ target: { checked } }) => setShowDiemTp(checked)}
						key='toggleDiemTp'
					>
						{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hienthichitietdiem' })}
					</Checkbox>,
				]}
			/>

			<PrintTemplate ref={componentRef} tenPhongBan={initTenPhongBan}>
				<TitlePrintKQHT />
				<div className='to-print'>
					<TableStaticData columns={columns} data={data} size='small' otherProps={{ pagination: false }} />
				</div>
			</PrintTemplate>

			{diemHpSvHkId ? (
				<ViewDiemLopHocPhan
					visible={visibleChiTietDiem}
					setVisible={setVisibleChiTietDiem}
					diemHpSvHkId={diemHpSvHkId}
					hasEdit
					getData={getDiemSvHk}
				/>
			) : null}

			<ModalLichSuNhapDiem visible={visibleHistory} setVisible={setVisibleHistory} sinhVienSsoId={sinhVienSsoId} />

			<ModalImport
				modelName='daotaov2.ketquahoctap.diemhpsvhk'
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => getData()}
			/>
		</>
	);
};

export default TableDiemHocPhan;
