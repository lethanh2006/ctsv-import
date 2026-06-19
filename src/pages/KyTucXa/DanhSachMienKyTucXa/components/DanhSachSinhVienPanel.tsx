import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import * as XLSX from 'xlsx';
import FormSinhVien from './FormSinhVien';
import { StudentSelectModal } from './StudentSelectModal';

interface DanhSachSinhVienPanelProps {
	activeSemester: KyTucXa.IDanhSachMienKTX;
	selectedSemesterMa?: string;
}

export const DanhSachSinhVienPanel: React.FC<DanhSachSinhVienPanelProps> = ({ activeSemester, selectedSemesterMa }) => {
	const intl = useIntl();
	const t = (id: string, values?: Record<string, any>) => intl.formatMessage({ id }, values);
	const { handleEdit, deleteModel, getModel, danhSach } = useModel('kytucxa.danhsachmiensinhvien');
	const [visibleSelect, setVisibleSelect] = useState(false);

	const danhSachId = activeSemester?._id;

	const renderText = (value?: string | number | null) => value || '-';

	const getKhoaNganh = (record: any) => {
		const khoaNganh = record?.khoaNganh;
		const sinhVienKhoaNganh = record?.sinhVien?.khoaNganh;

		return (
			khoaNganh?.ten ||
			khoaNganh?.ma ||
			(typeof khoaNganh === 'string' ? khoaNganh : undefined) ||
			record?.tenKhoaNganh ||
			record?.maKhoaNganh ||
			sinhVienKhoaNganh?.ten ||
			sinhVienKhoaNganh?.ma ||
			(typeof sinhVienKhoaNganh === 'string' ? sinhVienKhoaNganh : undefined) ||
			record?.sinhVien?.tenKhoaNganh ||
			record?.sinhVien?.maKhoaNganh
		);
	};

	const getSoDienThoai = (record: any) =>
		record?.soDienThoai || record?.sdt || record?.sinhVien?.soDienThoai || record?.sinhVien?.sdt;

	const getEmail = (record: any) => record?.email || record?.sinhVien?.email;

	const handleAddStudentsDone = async (
		newStudents: {
			maSinhVien: string;
			hoTen: string;
			khoaSinhVien: string;
			khoaNganh?: string;
			soDienThoai?: string;
			email?: string;
		}[],
	) => {
		if (!danhSachId) {
			message.warning(t('kytucxa.danhsachmien.message.selectSemesterListFirst'));
			return;
		}

		try {
			await axios.post(`${ipCsvc}/danh-sach-mien-ky-tuc-xa/${danhSachId}/sinh-vien`, {
				danhSach: newStudents.map((student) => ({
					maSinhVien: student.maSinhVien,
					hoTen: student.hoTen,
					khoaSinhVien: student.khoaSinhVien || '',
					khoaNganh: student.khoaNganh || '',
					soDienThoai: student.soDienThoai || '',
					email: student.email || '',
				})),
			});
			message.success(t('kytucxa.danhsachmien.message.importSuccess'));
			setVisibleSelect(false);
			getModel({ danhSachId });
		} catch (err) {
			console.error(err);
			message.error(t('kytucxa.danhsachmien.message.importFailed'));
		}
	};

	const handleExportExcel = () => {
		if (!danhSach?.length) {
			message.warning(t('kytucxa.danhsachmien.message.noDataToExport'));
			return;
		}

		const dataToExport = danhSach.map((item: any, index: number) => ({
			TT: index + 1,
			[t('kytucxa.danhsachmien.maSinhVien')]: item.code || '',
			[t('kytucxa.danhsachmien.hoTen')]: item.fullname || '',
			[t('kytucxa.danhsachmien.khoaSinhVien')]: item.khoaSinhVien || '',
			[t('kytucxa.danhsachmien.khoaNganh')]: getKhoaNganh(item) || '',
			[t('kytucxa.danhsachmien.soDienThoai')]: getSoDienThoai(item) || '',
			Email: getEmail(item) || '',
			[t('kytucxa.danhsachmien.trangThaiMinhChung')]: item.trangThaiMinhChung || t('kytucxa.danhsachmien.choDuyet'),
		}));

		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, t('kytucxa.danhsachmien.excel.sheetDanhSach'));
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		fileDownload(blob, t('kytucxa.danhsachmien.excel.fileName', { maHocKy: selectedSemesterMa || '' }));
	};

	const columns: IColumn<any>[] = [
		{
			title: t('kytucxa.danhsachmien.maSV'),
			dataIndex: 'code',
			key: 'code',
			width: 120,
			filterType: 'string',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: t('kytucxa.danhsachmien.hoTen'),
			dataIndex: 'fullname',
			key: 'fullname',
			width: 180,
			filterType: 'string',
		},
		{
			title: t('kytucxa.danhsachmien.khoaSV'),
			dataIndex: 'khoaSinhVien',
			key: 'khoaSinhVien',
			width: 120,
			filterType: 'string',
		},
		{
			title: t('kytucxa.danhsachmien.khoaNganh'),
			dataIndex: 'khoaNganh',
			key: 'khoaNganh',
			width: 180,
			filterType: 'string',
			render: (_value, record) => renderText(getKhoaNganh(record)),
		},
		{
			title: t('kytucxa.danhsachmien.soDienThoai'),
			dataIndex: 'soDienThoai',
			key: 'soDienThoai',
			width: 130,
			filterType: 'string',
			render: (_value, record) => renderText(getSoDienThoai(record)),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: 200,
			filterType: 'string',
			render: (_value, record) => renderText(getEmail(record)),
		},
		{
			title: t('kytucxa.danhsachmien.minhChung'),
			dataIndex: 'urlMinhChung',
			key: 'urlMinhChung',
			width: 180,
			render: (val: string) => {
				if (!val) return <span style={{ color: '#bfbfbf' }}>{t('kytucxa.danhsachmien.chuaNop')}</span>;

				const filename = val.substring(val.lastIndexOf('/') + 1) || 'minh-chung.pdf';
				return (
					<a
						href={val}
						target='_blank'
						rel='noopener noreferrer'
						style={{ textDecoration: 'underline', color: '#125195', fontWeight: 500 }}
					>
						{filename}
					</a>
				);
			},
		},
		{
			title: t('kytucxa.danhsachmien.thaoTac'),
			key: 'action',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<ButtonExtend
						tooltip={t('global.button.chinhsua')}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, () => getModel({ danhSachId }))}
						title={t('kytucxa.danhsachmien.confirmDeleteStudent')}
						placement='topRight'
					>
						<ButtonExtend tooltip={t('global.button.xoa')} danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				modelName='kytucxa.danhsachmiensinhvien'
				title={t('kytucxa.danhsachmien.panelTitle', { maHocKy: selectedSemesterMa || '' })}
				Form={FormSinhVien}
				buttons={{
					import: false,
					export: false,
				}}
				otherButtons={[
					<ButtonExtend key='btn-import-student' icon={<ImportOutlined />} onClick={() => setVisibleSelect(true)}>
						{t('global.button.nhapdulieu')}
					</ButtonExtend>,
					<ButtonExtend key='btn-export-student' icon={<ExportOutlined />} onClick={handleExportExcel}>
						{t('global.button.xuatdulieu')}
					</ButtonExtend>,
				]}
				params={{ danhSachId }}
				dependencies={[danhSachId]}
				formProps={{ danhSachId }}
				scroll={{ x: 1300 }}
				showModalTitle
				hideCard
				otherProps={{ size: 'small' }}
			/>

			<StudentSelectModal
				open={visibleSelect}
				onCancel={() => setVisibleSelect(false)}
				activeSemester={activeSemester}
				selectedSemesterMa={selectedSemesterMa}
				existingStudents={danhSach || []}
				onOk={handleAddStudentsDone}
			/>
		</>
	);
};
