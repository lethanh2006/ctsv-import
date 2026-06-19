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
import { useModel } from 'umi';
import * as XLSX from 'xlsx';
import FormSinhVien from './FormSinhVien';
import { StudentSelectModal } from './StudentSelectModal';

interface DanhSachSinhVienPanelProps {
	activeSemester: KyTucXa.IDanhSachMienKTX;
	selectedSemesterMa?: string;
}

export const DanhSachSinhVienPanel: React.FC<DanhSachSinhVienPanelProps> = ({ activeSemester, selectedSemesterMa }) => {
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
			message.warning('Vui lòng chọn học kỳ/danh sách trước');
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
			message.success('Import sinh viên thành công');
			setVisibleSelect(false);
			getModel({ danhSachId });
		} catch (err) {
			console.error(err);
			message.error('Có lỗi xảy ra khi import sinh viên');
		}
	};

	const handleExportExcel = () => {
		if (!danhSach?.length) {
			message.warning('Không có dữ liệu để xuất');
			return;
		}

		const dataToExport = danhSach.map((item: any, index: number) => ({
			TT: index + 1,
			'Mã sinh viên': item.code || '',
			'Họ tên': item.fullname || '',
			'Khoá sinh viên': item.khoaSinhVien || '',
			'Khóa ngành': getKhoaNganh(item) || '',
			SĐT: getSoDienThoai(item) || '',
			Email: getEmail(item) || '',
			'Trạng thái minh chứng': item.trangThaiMinhChung || 'Chờ duyệt',
		}));

		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách');
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		fileDownload(blob, `Danh sách miễn KTX - HK ${selectedSemesterMa || ''}.xlsx`);
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'code',
			key: 'code',
			width: 120,
			filterType: 'string',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			key: 'fullname',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Khoá SV',
			dataIndex: 'khoaSinhVien',
			key: 'khoaSinhVien',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Khóa ngành',
			dataIndex: 'khoaNganh',
			key: 'khoaNganh',
			width: 180,
			filterType: 'string',
			render: (_value, record) => renderText(getKhoaNganh(record)),
		},
		{
			title: 'SĐT',
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
			title: 'Minh chứng',
			dataIndex: 'urlMinhChung',
			key: 'urlMinhChung',
			width: 180,
			render: (val: string) => {
				if (!val) return <span style={{ color: '#bfbfbf' }}>Chưa nộp</span>;

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
			title: 'Thao tác',
			key: 'action',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record._id, () => getModel({ danhSachId }))}
						title='Bạn có chắc chắn muốn xóa sinh viên này khỏi danh sách miễn?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
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
				title={`Sinh viên miễn KTX - HK ${selectedSemesterMa || ''}`}
				Form={FormSinhVien}
				buttons={{
					import: false,
					export: false,
				}}
				otherButtons={[
					<ButtonExtend key='btn-import-student' icon={<ImportOutlined />} onClick={() => setVisibleSelect(true)}>
						Nhập dữ liệu
					</ButtonExtend>,
					<ButtonExtend key='btn-export-student' icon={<ExportOutlined />} onClick={handleExportExcel}>
						Xuất dữ liệu
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
