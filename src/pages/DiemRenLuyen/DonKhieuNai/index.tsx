import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import { primaryColor } from '@/services/base/constant';
import { ETrangThaiKhieuNai, MapKeyColorTrangThaiKhieuNai } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { CheckOutlined, CloseOutlined, ExportOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import FormNhapPhieuDiem from '../PhieuDiem/FormPhieuDiem/Form';

const DonKhieuNaiPage = () => {
	const intl = useIntl();
	const {
		getModel,
		exportDonKhieuNaiModel,
		loading,
		handleView,
		record: recPhieuDiem,
		xuLyKhieuNaiModel,
	} = useModel('diemrenluyen.phieudiemrenluyen');
	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');
	const { getByIdModel, record: recBieuMau } = useModel('diemrenluyen.bieumau');
	const [trangThai, setTrangThai] = useState<ETrangThaiKhieuNai | undefined>(ETrangThaiKhieuNai.CHO_XU_LY);
	const { record: recordLopHanhChinh, setRecord: setRecordLopHanhChinh } = useModel(
		'daotaov2.lophanhchinh.lophanhchinh',
	);
	const getData = () => {
		if (recDot?._id)
			getModel({
				dotChamDiemId: recDot?._id,
				guiKhieuNai: true,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
	};

	const onCell = (rec: PhieuDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(rec);
			setTrangThai(undefined);
		},
		style: { cursor: 'pointer' },
	});

	useEffect(() => {
		if (recDot?.idBieuMau) getByIdModel(recDot?.idBieuMau ?? '', true);
	}, [recDot?._id]);

	const columns: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'donkhieunai.thoigiangui' }),
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianGuiKhieuNai',
			width: 120,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.hoten' }),
			align: 'center',
			dataIndex: 'hoTen',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.msv' }),
			align: 'center',
			dataIndex: 'maSinhVien',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.lop' }),
			align: 'center',
			dataIndex: 'lopHanhChinh',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.noidung' }),
			// align: 'center',
			dataIndex: 'noiDungKhieuNai',
			width: 300,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.fileminhchung' }),
			dataIndex: 'urlFileDinhKem',
			align: 'center',
			onCell,
			width: 200,
			render: (val: string[]) => (
				<div>
					{val.map((item) => (
						<Tag key={item} color={primaryColor}>
							<a href={item} target='_blank' rel='noreferrer'>
								{intl.formatMessage({ id: 'donkhieunai.xemteptin' })}
							</a>
						</Tag>
					))}
				</div>
			),
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.trangthai' }),
			dataIndex: 'trangThaiXuLyKhieuNai',
			width: 120,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ETrangThaiKhieuNai),
			render: (val: ETrangThaiKhieuNai) => <Tag color={MapKeyColorTrangThaiKhieuNai[val]}>{val}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'donkhieunai.thaotac' }),
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'donkhieunai.tooltip.xuatdon' })}>
						<Button
							loading={loading}
							onClick={() => {
								exportDonKhieuNaiModel(rec._id);
							}}
							type='link'
							icon={<ExportOutlined />}
						/>
					</Tooltip>
					{rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY && (
						<Tooltip title={intl.formatMessage({ id: 'donkhieunai.tooltip.chuyenvechoxuly' })}>
							<Button
								loading={loading}
								onClick={() => {
									xuLyKhieuNaiModel(
										rec?._id ?? '',
										{
											traLoiNoiDungKhieuNai: '',
											trangThaiXuLyKhieuNai: ETrangThaiKhieuNai.CHO_XU_LY,
										},
										getData,
									);
								}}
								type='link'
								icon={<RedoOutlined />}
							/>
						</Tooltip>
					)}
					<Tooltip title={intl.formatMessage({ id: 'donkhieunai.tooltip.duyet' })}>
						<Button
							disabled={rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY}
							loading={loading}
							onClick={() => {
								handleView(rec);
								setTrangThai(ETrangThaiKhieuNai.DA_DUYET);
							}}
							type='link'
							icon={<CheckOutlined />}
						/>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'donkhieunai.tooltip.khongduyet' })}>
						<Button
							disabled={rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY}
							loading={loading}
							onClick={() => {
								handleView(rec);
								setTrangThai(ETrangThaiKhieuNai.KHONG_DUYET);
							}}
							type='link'
							icon={<CloseOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormNhapPhieuDiem isSuaDiemKhieuNai getData={getData} trangThai={trangThai} />,
		[recBieuMau?._id, recDot?._id, recPhieuDiem?._id, recordLopHanhChinh?._id, trangThai],
	);

	return (
		<TableBase
			maskCloseableForm
			widthDrawer={1000}
			dependencies={[recDot?._id, recordLopHanhChinh?._id]}
			getData={getData}
			buttons={{ create: false }}
			Form={Form}
			otherButtons={[
				<SelectDotDiemRenLuyen
					key={'filterDot'}
					style={{ width: 300 }}
					value={recDot?._id}
					onChange={(val, option) => {
						const rawData = option?.rawData;
						setRecDot(rawData);
					}}
					isSetRecord={true}
				/>,
				<SelectLopHanhChinh
					key={'filterLop'}
					allowClear
					value={recordLopHanhChinh?._id}
					style={{ width: 300 }}
					onChange={(val: any, option: any) => {
						const rawData = option?.rawData;
						setRecordLopHanhChinh(rawData);
					}}
				/>,
			]}
			modelName={'diemrenluyen.phieudiemrenluyen'}
			columns={columns}
			title={intl.formatMessage({ id: 'donkhieunai.title' })}
		/>
	);
};

export default DonKhieuNaiPage;
