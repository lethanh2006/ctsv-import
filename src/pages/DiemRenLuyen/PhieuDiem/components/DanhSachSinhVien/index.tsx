import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectDotDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Select';
import FormNhapPhieuDiem from '@/pages/DiemRenLuyen/PhieuDiem/FormPhieuDiem/Form';
import { exportPhieuDiem } from '@/services/DiemRenLuyen';
import {
	ENguoiTraLoiDrl,
	ETrangThaiPhieuDiemRL,
	MapColorETrangThaiPhieuDiemRL,
	MapTitleETrangThaiPhieuDiemRL,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Spin, Tag, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachSinhVien = (props: { idLop?: string }) => {
	const intl = useIntl();
	const { getModel, page, limit, condition, handleView, loading, exportThongKeModel, setLoading } = useModel(
		'diemrenluyen.phieudiemrenluyen',
	);
	const { record: recordLopHanhChinh, setRecord: setRecordLopHanhChinh } = useModel(
		'daotaov2.lophanhchinh.lophanhchinh',
	);

	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recordKhoaSinhVien } = useModel('daotaov2.khoasinhvien.khoasinhvien');
	const { record: recodDot, setRecord: setRecortdDot, loading: loadingDot } = useModel('diemrenluyen.dot');
	const { getByIdModel } = useModel('diemrenluyen.bieumau');

	const getData = () => {
		if ((!props?.idLop && recodDot?._id) || (props?.idLop && recodDot?._id && recordLopHanhChinh?.ten))
			getModel({
				lopHanhChinh: recordLopHanhChinh?.ten,
				dotChamDiemId: recodDot?._id,
			});
	};

	useEffect(() => {
		if (recodDot?.idBieuMau) getByIdModel(recodDot?.idBieuMau ?? '', true);
	}, [recodDot?._id]);

	const onCell = (rec: PhieuDiemRenLuyen.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const exportPhieuDiemRenLuyen = async (recPhieu: PhieuDiemRenLuyen.IRecord) => {
		if (!recodDot) return;
		setLoading(true);
		const res = await exportPhieuDiem(recodDot?._id, ENguoiTraLoiDrl.KHOA, recPhieu.ssoId);
		fileDownload(res?.data, `PhieuDRL_${recodDot.kyHoc}_${recPhieu.hoTen}_${recPhieu.maSinhVien}.docx`);
		setLoading(false);
	};

	const columns: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.masv' }),
			dataIndex: 'maSinhVien',
			width: 120,
			sortable: true,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.lophc' }),
			dataIndex: 'lopHanhChinh',
			width: 100,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.sinhvien' }),
			dataIndex: 'trangThaiNopSV',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val: ETrangThaiPhieuDiemRL) =>
				val ? <Tag color={MapColorETrangThaiPhieuDiemRL?.[val]}>{MapTitleETrangThaiPhieuDiemRL?.[val]}</Tag> : '',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.bancansu' }),
			dataIndex: 'trangThaiNopBCS',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val: ETrangThaiPhieuDiemRL) =>
				val ? <Tag color={MapColorETrangThaiPhieuDiemRL?.[val]}>{MapTitleETrangThaiPhieuDiemRL?.[val]}</Tag> : '',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.covanht' }),
			dataIndex: 'trangThaiNopCoVan',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val: ETrangThaiPhieuDiemRL) =>
				val ? <Tag color={MapColorETrangThaiPhieuDiemRL?.[val]}>{MapTitleETrangThaiPhieuDiemRL?.[val]}</Tag> : '',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: PhieuDiemRenLuyen.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chitiet' })}>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.button.xuatphieudiem' })}>
						<Button
							loading={loading}
							onClick={() => exportPhieuDiemRenLuyen(record)}
							type='link'
							icon={<ExportOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Spin spinning={loadingDot}>
			{/* <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={8}>
					<Card style={{ borderRadius: 5 }} hoverable>
						<div>
							<div style={{ fontSize: 18, fontWeight: 'bold' }}>Sinh viên</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[0]} />
								<span>
									Chưa gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[1]} />
								<span>
									Lưu:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[2]} />
								<span>
									Đã gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
						</div>
					</Card>
				</Col>
				<Col span={8}>
					<Card style={{ borderRadius: 5 }} hoverable>
						<div>
							<div style={{ fontSize: 18, fontWeight: 'bold' }}>Ban cán sự</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[0]} />
								<span>
									Chưa gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[1]} />
								<span>
									Lưu:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[2]} />
								<span>
									Đã gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
						</div>
					</Card>
				</Col>{' '}
				<Col span={8}>
					<Card style={{ borderRadius: 5 }} hoverable>
						<div>
							<div style={{ fontSize: 18, fontWeight: 'bold' }}>Cố vấn học tập</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[0]} />
								<span>
									Chưa gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[1]} />
								<span>
									Lưu:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
							<div>
								<Badge style={{ marginRight: 4 }} color={color?.[2]} />
								<span>
									Đã gửi:
									<b style={{ marginLeft: 4 }}>{0}</b>
								</span>
							</div>
						</div>
					</Card>
				</Col>
			</Row> */}
			<TableBase
				hideCard
				Form={FormNhapPhieuDiem as any}
				modelName={'diemrenluyen.phieudiemrenluyen'}
				columns={columns}
				getData={getData}
				dependencies={[page, limit, condition, recodDot?._id, recordKhoaSinhVien?.ma, recordLopHanhChinh?._id]}
				widthDrawer={900}
				destroyModal
				formProps={{ getData }}
				buttons={{ create: false, filter: false }}
				otherButtons={[
					<>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recodDot?._id}
							onChange={(val, option) => {
								const rawData = option?.rawData;
								setRecortdDot(rawData);
							}}
							isSetRecord={true}
						/>
						{!props?.idLop && (
							<SelectLopHanhChinh
								allowClear
								value={recordLopHanhChinh?._id}
								maNganh={recNganh?.ma}
								style={{ width: 300 }}
								onChange={(val: any, option: any) => {
									const rawData = option?.rawData;
									setRecordLopHanhChinh(rawData);
								}}
							/>
						)}
						<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.button.xuathongke' })}>
							<Button
								loading={loading}
								onClick={() => exportThongKeModel(recodDot?._id ?? '', recordLopHanhChinh?.ten)}
								type='primary'
								icon={<ExportOutlined />}
							>
								{intl.formatMessage({ id: 'lophanhchinh.phieudiem.dssv.button.xuatkq' })}
							</Button>
						</Tooltip>
					</>,
				]}
			/>
		</Spin>
	);
};
export default DanhSachSinhVien;
