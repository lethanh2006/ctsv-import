import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';

import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { exportKQHTHocKy } from '@/services/DaoTaoV2/SinhVien';
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import ViewDiemLopHocPhan from '../../DiemLopHocPhan/components/ViewDiemLopHocPhan';
import TitlePrintKQHT from './TitlePrintKQHT';
import './style.less';

interface DataType extends LopHocPhan.IDiemHpSvHk {
	title?: string;
	tenHocPhan?: string;
}

const TableDiemHocPhan = (props: {
	sinhVienSsoId: string;
	maHocKy?: string;
	namHocId?: string;
	hideTitle?: boolean;
	maKhoaNganh?: string;
}) => {
	const intl = useIntl();
	const { danhSach: danhSachKQHK } = useModel('daotaov2.ketquahoctap.ketquahocky');
	const { getAllModel, setRecord, getByHocPhanNamHocModel } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { record } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [data, setData] = useState<DataType[]>([]);
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const [loadingExport, seLoadingExport] = useState<boolean>(false);
	const componentRef = useRef(null);
	const { sinhVienSsoId, maHocKy, namHocId, hideTitle, maKhoaNganh } = props;

	/** Get Data theo điều kiện: Học kỳ, Năm học hoặc Toàn khóa */
	const getData = (): Promise<LopHocPhan.IDiemHpSvHk[]> => {
		if (sinhVienSsoId) {
			if (namHocId) return getByHocPhanNamHocModel(sinhVienSsoId, { namHocId, maKhoaNganh });
			else return getAllModel(false, undefined, { sinhVienSsoId, maHocKy, maKhoaNganh });
		}
		return Promise.reject('Invalid sinhVien');
	};

	useEffect(() => {
		getData().then((da) => {
			const res: any[] = [];
			const gHocKy = _.groupBy(da, (item) => item.maHocKy); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp tăng dần học kỳ
			aHocKy.forEach(([mahk, diemHpHkList]) => {
				const kqhk = danhSachKQHK.find((j) => j.maHocKy === mahk);
				let tenHocPhan =
					diemHpHkList[0]?.hocKy?.ten ??
					intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.hockyfallback' }, { maHk: mahk });
				if (kqhk)
					tenHocPhan += intl.formatMessage(
						{ id: 'sinhvienhocvu.diemhocphan.thongtinhocky' },
						{
							tbHocKy: kqhk.trungBinhHocKy ?? '--',
							soTcDat: kqhk.tongSoTinChiHocKy ?? '--',
							tongTcTichLuy: kqhk.tongSoTinChiTichLuyToanKhoa ?? '--',
						},
					);
				// Thêm 1 hàng trống => Tên học kỳ
				res.push({ _id: '-1', tenHocPhan, maHocKy: mahk });
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(
					...diemHpHkList.map((diem, index) => ({
						...diem,
						title: `${index + 1}`,
						tenHocPhan: diem.hocPhan?.ten,
					})),
				);
			});

			setData(res);
		});
	}, [sinhVienSsoId, maHocKy, namHocId, maKhoaNganh]);

	const handlePrint = useReactToPrint({ contentRef: componentRef });

	const onExportKetQuaHocTap = (): void => {
		seLoadingExport(true);
		exportKQHTHocKy(sinhVienSsoId ?? '', {
			condition: {
				maKhoaNganh,
			},
		}).then((res) => {
			fileDownload(
				res.data,
				intl.formatMessage(
					{ id: 'table.diemhocphan.filename' },
					{
						maSv: record?.sinhVien?.ma ?? recSinhVien?.ma,
						tenSv: record?.sinhVien?.ten ?? recSinhVien?.ten,
					},
				),
			);
			seLoadingExport(false);
		});
	};

	const onCell = (rec: LopHocPhan.IDiemHpSvHk) => ({
		onClick: () => {
			if (rec._id !== '-1') {
				setRecord(rec);
				setVisibleChiTietDiem(true);
			}
		},
		style: {
			cursor: rec._id !== '-1' ? 'pointer' : undefined,
			fontWeight: rec._id === '-1' ? 600 : undefined,
			backgroundColor: rec._id === '-1' ? '#e8fafdbf' : undefined,
		},
		colSpan: rec._id === '-1' ? 0 : 1,
	});

	const columns: IColumn<DataType>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.tt' }),
			dataIndex: 'title',
			width: 40,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.mahp' }),
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.tenhocphan' }),
			dataIndex: 'tenHocPhan',
			width: 200,
			filterType: 'string',
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 7 : 1,
			}),
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.sotc' }),
			width: 80,
			align: 'center',
			render: (val, rec) => rec?.hocPhan?.soTinChi,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.diemhe10' }),
			dataIndex: 'diemTongKet',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.diemhe4' }),
			dataIndex: 'diemThang4',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.column.diemchu' }),
			dataIndex: 'diemChu',
			width: 80,
			align: 'center',
			render: (val, rec) => (
				<>
					{val}{' '}
					{rec?.isCongNhanQuyDoiDiem && (
						<Tooltip title={intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.tooltip.diemquydoi' })}>(R)</Tooltip>
					)}
				</>
			),
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			onCell,
		},
	];

	return (
		<>
			{!hideTitle ? (
				<div className='ant-descriptions-title' style={{ fontSize: '16px', padding: '16px 0 8px 0' }}>
					{intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.title' })}
				</div>
			) : null}
			<Space wrap>
				<ButtonExtend loading={loadingExport} icon={<ExportOutlined />} onClick={() => onExportKetQuaHocTap()}>
					{intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.button.xuatbangdiem' })}
				</ButtonExtend>
				<ButtonExtend icon={<PrinterOutlined />} onClick={() => handlePrint()}>
					{intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.button.inbangdiem' })}
				</ButtonExtend>
			</Space>

			<TableStaticData
				columns={columns}
				data={data}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			/>

			<PrintTemplate
				ref={componentRef}
				tenPhongBan={intl.formatMessage({ id: 'sinhvienhocvu.diemhocphan.tenphongban' })}
			>
				<TitlePrintKQHT />
				<div className='to-print'>
					<TableStaticData columns={columns} data={data} size='small' otherProps={{ pagination: false }} />
				</div>
			</PrintTemplate>

			<ViewDiemLopHocPhan visible={visibleChiTietDiem} setVisible={setVisibleChiTietDiem} />
		</>
	);
};

export default TableDiemHocPhan;
