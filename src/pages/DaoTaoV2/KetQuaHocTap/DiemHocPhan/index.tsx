import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import type { SinhVien } from '@/services/SinhVien/typings';

import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { exportKetQuaHocTap, exportPhuLucVanBang } from '@/services/DaoTaoV2/SinhVien';
import { ETrangThaiDiemHocPhanSv } from '@/services/SinhVien/constant';
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import TitlePrintKQHT from '../KetQuaHocKy/components/TitlePrintKQHT';

/** Bảng Điểm học phần (cuối cùng) của sinh viên */
const DiemHocPhanSvTable = (props: { sinhVienSsoId: string; maKhoaNganh?: string }) => {
	const intl = useIntl();
	const { getAllModel, danhSach } = useModel('daotaov2.sinhvien.diemhocphan');
	const { record } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const componentRef = useRef(null);
	// const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const { sinhVienSsoId, maKhoaNganh } = props;

	const getData = () => sinhVienSsoId && getAllModel(false, { maHocKyKeHoach: 1 }, { sinhVienSsoId, maKhoaNganh });

	useEffect(() => {
		getData();
	}, [sinhVienSsoId, maKhoaNganh]);

	const handlePrint = useReactToPrint({ contentRef: componentRef });

	const onExportPhuLucVanBang = (): void => {
		if (sinhVienSsoId) {
			setLoadingExport(true);
			exportPhuLucVanBang(sinhVienSsoId ?? '', {
				condition: {
					maKhoaNganh,
				},
			}).then((res) => {
				fileDownload(
					res.data,
					intl.formatMessage(
						{ id: 'sinhvienhocvu.bangdiemhp.filename.phulucvb' },
						{
							maSv: record?.sinhVien?.ma ?? recSinhVien?.ma,
							tenSv: record?.sinhVien?.ten ?? recSinhVien?.ten,
						},
					),
				);
				setLoadingExport(false);
			});
		}
	};

	const onExportBangDiemToanKhoa = (): void => {
		if (sinhVienSsoId) {
			setLoadingExport(true);
			exportKetQuaHocTap(sinhVienSsoId ?? '', {
				condition: {
					maKhoaNganh,
				},
			}).then((res) => {
				fileDownload(
					res.data,
					intl.formatMessage(
						{ id: 'sinhvienhocvu.bangdiemhp.filename.bangdiemtichluy' },
						{
							maSv: record?.sinhVien?.ma ?? recSinhVien?.ma,
							tenSv: record?.sinhVien?.ten ?? recSinhVien?.ten,
						},
					),
				);
				setLoadingExport(false);
			});
		}
	};

	const columns: IColumn<SinhVien.IDiemHocPhanSv>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.mahp' }),
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.tenhocphan' }),
			dataIndex: ['hocPhan', 'ten'],
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.sotc' }),
			dataIndex: ['hocPhan', 'soTinChi'],
			width: 80,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.diemhe10' }),
			dataIndex: 'diemTongKet',
			width: 80,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.diemhe4' }),
			dataIndex: 'diemThang4',
			width: 80,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.column.diemchu' }),
			dataIndex: 'diemChu',
			width: 80,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			render: (val, rec) => (
				<>
					{val} {rec?.trangThai === ETrangThaiDiemHocPhanSv.QUY_DOI_DIEM && <>(R)</>}
				</>
			),
		},
	];

	return (
		<>
			<Space wrap>
				<Dropdown
					overlay={
						<Menu>
							<Menu.Item onClick={() => onExportBangDiemToanKhoa()}>
								{intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.button.bangdiemtichluy' })}
							</Menu.Item>
							<Menu.Item onClick={() => onExportPhuLucVanBang()}>
								{intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.button.phulucvb' })}
							</Menu.Item>
						</Menu>
					}
				>
					<ButtonExtend loading={loadingExport} icon={<ExportOutlined />}>
						{intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.button.xuatbangdiem' })}
					</ButtonExtend>
				</Dropdown>

				<ButtonExtend icon={<PrinterOutlined />} onClick={() => handlePrint()}>
					{intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.button.inbangdiem' })}
				</ButtonExtend>
			</Space>

			<TableStaticData
				columns={columns}
				data={danhSach}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 600 } }}
				addStt
			/>

			<PrintTemplate
				ref={componentRef}
				tenPhongBan={intl.formatMessage({ id: 'sinhvienhocvu.bangdiemhp.tenphongban' })}
			>
				<TitlePrintKQHT />
				<div className='to-print'>
					<TableStaticData columns={columns} data={danhSach} size='small' otherProps={{ pagination: false }} addStt />
				</div>
			</PrintTemplate>

			{/* <ModalExport
				visible={visibleExport}
				fileName={`Bảng điểm học phần - ${record?.sinhVien?.ma ?? recSinhVien?.ma} - ${
					record?.sinhVien?.ten ?? recSinhVien?.ten
				}.xlsx`}
				modelName='sinhvien.diemhocphan'
				onCancel={() => setVisibleExport(false)}
				condition={{ sinhVienSsoId }}
			/> */}
		</>
	);
};

export default DiemHocPhanSvTable;
