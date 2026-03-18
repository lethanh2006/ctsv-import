import ExpandText from '@/components/ExpandText';
import NumberInputRating from '@/pages/DiemRenLuyen/PhieuDiem/FormPhieuDiem/NumberInputRating/NumberInputRating';
import type { ENguoiTraLoiDrl } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import {
	BCS_DANH_GIA_PREFIX,
	CVHT_DANH_GIA_PREFIX,
	ELoaiCauHoiDrl,
	TU_DANH_GIA_PREFIX,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { Form, Table, Typography } from 'antd';
import { type ColumnType } from 'antd/lib/table';
import type { ReactNode } from 'react';
import { useIntl, useModel } from 'umi';
import { FieldWithTitle } from '../FieldWithTitle';
import '../styles.less';

interface TableRecordKhoi {
	rowKey: string;
	type: 'khoi';
	noiDung: string;
	diemToiDa: number;
	diemToiThieu: number;
}
interface TableRecordCauHoi {
	rowKey: string;
	type: 'cauHoi';
	noiDung: string;
	loaiCauHoi: string;
	diemToiDa: number;
	diemToiThieu: number;
	indexKhoi: number;
	indexCauHoi: number;
	batBuoc: boolean;
	idCauHoi: string;
	isTieuDeDanhMuc?: boolean;
}
interface TableRecordTongDiem {
	rowKey: string;
	type: 'tongDiem';
	tongDiemToiDa: number;
	isTieuDeDanhMuc?: boolean;
}
type TableRecord = TableRecordKhoi | TableRecordCauHoi | TableRecordTongDiem;

interface Props {
	tongDiemCTSVDanhGia: number;
	tongDiemTuDanhGia: number;
	tongDiemDonViDanhGia: number;
	tongDiemKhoaDanhGia: number;
	nguoiTraLoi: ENguoiTraLoiDrl;
	disabled?: boolean;
	title?: string | ReactNode;
}

export const FieldsNhapDiem = ({
	nguoiTraLoi,
	disabled,
	tongDiemDonViDanhGia,
	tongDiemTuDanhGia,
	tongDiemCTSVDanhGia,
	tongDiemKhoaDanhGia,
	title,
}: Props) => {
	const intl = useIntl();
	const { record } = useModel('diemrenluyen.bieumau');

	const columns: ColumnType<TableRecord>[] = [
		{
			title: intl.formatMessage({ id: 'phieudiem.noidung' }),
			width: 420,
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return (
						<Typography.Text style={{ fontSize: '18px' }}>
							{intl.formatMessage({ id: 'phieudiem.tongdiem' })}
						</Typography.Text>
					);
				}
				return <ExpandText>{tableRecord.noiDung}</ExpandText>;
			},
		},
		{
			title: intl.formatMessage({ id: 'phieudiem.diemtoida' }),
			align: 'center',
			width: 106,
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return <ExpandText>{tableRecord.tongDiemToiDa}</ExpandText>;
				}
				return (
					<ExpandText>
						{tableRecord.type !== 'khoi' ? `${tableRecord?.diemToiThieu} - ` : ''}
						{tableRecord.diemToiDa}
					</ExpandText>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'phieudiem.svtudanhgia' }),
			align: 'center',
			width: 80,
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return tongDiemTuDanhGia;
				}
				if (tableRecord.type === 'cauHoi') {
					return (
						<Form.Item
							// rules={tableRecord.batBuoc ? [...rules.required] : []}
							name={`${TU_DANH_GIA_PREFIX}${tableRecord.idCauHoi}`}
							className='FieldsInCell__item'
						>
							<NumberInputRating
								disabled={
									disabled ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.MINH_CHUNG ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.HE_THONG
								}
								max={tableRecord.diemToiDa}
								min={tableRecord.diemToiThieu}
							/>
						</Form.Item>
					);
				}
				return null;
			},
		},
		{
			title: intl.formatMessage({ id: 'phieudiem.bcschamdiem' }),
			align: 'center',
			width: 80,
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return tongDiemKhoaDanhGia;
				}
				if (tableRecord.type === 'cauHoi') {
					return (
						<Form.Item
							// rules={tableRecord.batBuoc ? [...rules.required] : []}
							name={`${BCS_DANH_GIA_PREFIX}${tableRecord.idCauHoi}`}
							className='FieldsInCell__item'
						>
							<NumberInputRating
								disabled={
									disabled ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.MINH_CHUNG ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.HE_THONG
								}
								max={tableRecord.diemToiDa}
								min={tableRecord.diemToiThieu}
							/>
						</Form.Item>
					);
				}
				return null;
			},
		},
		{
			title: intl.formatMessage({ id: 'phieudiem.cvhtchamdiem' }),
			align: 'center',
			width: 80,
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return tongDiemDonViDanhGia;
				}
				if (tableRecord.type === 'cauHoi') {
					return (
						<Form.Item
							// rules={tableRecord.batBuoc ? [...rules.required] : []}
							name={`${CVHT_DANH_GIA_PREFIX}${tableRecord.idCauHoi}`}
							className='FieldsInCell__item'
						>
							<NumberInputRating
								disabled={
									disabled ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.MINH_CHUNG ||
									tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.HE_THONG
								}
								max={tableRecord.diemToiDa}
								min={tableRecord.diemToiThieu}
							/>
						</Form.Item>
					);
				}
				return null;
			},
		},

		// {
		// 	title: 'Phòng CTSV chấm điểm',
		// 	align: 'center',
		// 	width: 80,
		// 	render: (_: any, tableRecord: TableRecord) => {
		// 		if (tableRecord.type === 'tongDiem') {
		// 			return tongDiemCTSVDanhGia;
		// 		}
		// 		if (tableRecord.type === 'cauHoi') {
		// 			const coTheSua = nguoiTraLoi === ENguoiTraLoiDrl.CTSV;
		// 			return (
		// 				<Form.Item
		// 					rules={coTheSua && tableRecord.batBuoc ? [...rules.required] : []}
		// 					name={`${CTSV_DANH_GIA_PREFIX}${tableRecord.idCauHoi}`}
		// 					className='FieldsInCell__item'
		// 				>
		// 					<NumberInputRating
		// 						disabled={
		// 							!coTheSua ||
		// 							disabled ||
		// 							tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.MINH_CHUNG ||
		// 							tableRecord?.loaiCauHoi === ELoaiCauHoiDrl.HE_THONG
		// 						}
		// 						max={tableRecord.diemToiDa}
		// 						min={tableRecord.diemToiThieu}
		// 					/>
		// 				</Form.Item>
		// 			);
		// 		}
		// 		return null;
		// 	},
		// },
	];

	let tongDiemCuaForm = 0;
	const dataSource = record?.danhSachKhoi
		.reduce<TableRecord[]>((result, khoi, indexKhoi) => {
			const records: TableRecord[] = [
				{
					rowKey: `khoi_${indexKhoi}`,
					type: 'khoi',
					noiDung: khoi.tieuDe,
					diemToiDa: 0,
					diemToiThieu: 0,
					// isTieuDeDanhMuc: khoi?.isTieuDeDanhMuc,
				},
			];
			const firstRecord = records[0] as TableRecordKhoi;
			khoi.danhSachCauHoi.forEach((cauHoi, indexCauHoi) => {
				records.push({
					rowKey: `cauHoi_${cauHoi._id}`,
					type: 'cauHoi',
					noiDung: cauHoi.noiDungCauHoi,
					diemToiDa: cauHoi.gioiHanTrenTuyenTinh,
					diemToiThieu: cauHoi.gioiHanDuoiTuyenTinh,
					indexKhoi: indexKhoi,
					indexCauHoi: indexCauHoi,
					batBuoc: cauHoi.batBuoc,
					idCauHoi: cauHoi._id,
					loaiCauHoi: cauHoi?.loai,
				});
				firstRecord.diemToiDa = (firstRecord.diemToiDa ?? 0) + cauHoi.gioiHanTrenTuyenTinh;
			});
			tongDiemCuaForm += firstRecord?.diemToiDa ?? 0;
			return result.concat(...records);
		}, [])
		.concat({ rowKey: 'tongDiem', type: 'tongDiem', tongDiemToiDa: tongDiemCuaForm });

	return (
		<FieldWithTitle title={title ?? intl.formatMessage({ id: 'phieudiem.phieudiemrenluyen.uppercase' })}>
			<Table rowKey={(item) => item.rowKey} pagination={false} columns={columns} dataSource={dataSource} />
		</FieldWithTitle>
	);
};
