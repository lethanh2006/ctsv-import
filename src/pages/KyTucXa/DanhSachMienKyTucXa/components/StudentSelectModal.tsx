import ModalImport from '@/pages/ThongBao/components/ModalImport';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { Button, Modal } from 'antd';
import fileDownload from 'js-file-download';
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const ModalImportAny = ModalImport as any;
const TableSelectUserAny = TableSelectUser as any;

interface StudentSelectModalProps {
	open: boolean;
	onCancel: () => void;
	activeSemester?: KyTucXa.IDanhSachMienKTX;
	selectedSemesterMa?: string;
	existingStudents: any[];
	onOk: (
		newStudents: {
			maSinhVien: string;
			hoTen: string;
			khoaSinhVien: string;
			khoaNganh?: string;
			soDienThoai?: string;
			email?: string;
		}[],
	) => Promise<void>;
}

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
	open,
	onCancel,
	activeSemester,
	selectedSemesterMa,
	existingStudents,
	onOk,
}) => {
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const hasImported = useRef(false);

	useEffect(() => {
		if (open) {
			setSelectedUsers([]);
			setShowTable(false);
			setImportOpen(true);
			hasImported.current = false;
		} else {
			setShowTable(false);
			setImportOpen(false);
		}
	}, [open]);

	const customImportConfig = {
		onDownloadTemplate: () => {
			const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên', 'Khóa ngành', 'SĐT', 'Email']];
			const worksheet = XLSX.utils.aoa_to_sheet(headers);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			fileDownload(blob, 'Mẫu nhập danh sách sinh viên miễn KTX.xlsx');
		},
		onImport: (file: File): Promise<any[]> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const data = e.target?.result;
						const workbook = XLSX.read(data, { type: 'array' });
						const ws = workbook.Sheets[workbook.SheetNames[0]];
						const sheetData: any[] = XLSX.utils.sheet_to_json(ws);
						const parsed = sheetData
							.map((row: any) => {
								const code = row['Mã sinh viên']?.toString()?.trim() || '';
								const fullname = row['Họ tên']?.toString()?.trim() || '';
								const khoa = row['Khoá sinh viên']?.toString()?.trim() || '';
								const khoaNganh = row['Khóa ngành']?.toString()?.trim() || '';
								const soDienThoai = row['SĐT']?.toString()?.trim() || '';
								const email = row['Email']?.toString()?.trim() || '';
								return {
									code,
									username: code,
									fullname,
									khoaSinhVien: khoa,
									khoaNganh,
									soDienThoai,
									email,
									vaiTro: EVaiTroKhaoSat.SINH_VIEN,
								};
							})
							.filter((item) => item.code);
						resolve(parsed);
					} catch (err) {
						reject(err);
					}
				};
				reader.onerror = (err) => reject(err);
				reader.readAsArrayBuffer(file);
			});
		},
	};

	const handleSetSelectedUsers = (val: any[]) => {
		const list = (val || []).map((u) => {
			const code = u.code || u.username;
			const existing = existingStudents.find((su) => su.code === code);
			return {
				...u,
				code,
				username: code,
				fullname: u.fullname || u.hoTen || existing?.fullname || '',
				khoaSinhVien: u.khoaSinhVien || u.maKhoaSinhVien || u.tenKhoaSinhVien || existing?.khoaSinhVien || '',
				khoaNganh:
					u.khoaNganh?.ten ||
					u.khoaNganh?.ma ||
					(typeof u.khoaNganh === 'string' ? u.khoaNganh : undefined) ||
					u.tenKhoaNganh ||
					u.maKhoaNganh ||
					existing?.khoaNganh?.ten ||
					existing?.khoaNganh?.ma ||
					(typeof existing?.khoaNganh === 'string' ? existing.khoaNganh : undefined) ||
					existing?.tenKhoaNganh ||
					existing?.maKhoaNganh ||
					'',
				soDienThoai: u.soDienThoai || u.sdt || existing?.soDienThoai || existing?.sdt || '',
				email: u.email || existing?.email || '',
				_id: existing?._id,
				trangThaiMinhChung: existing?.trangThaiMinhChung,
				ghiChuDuyet: existing?.ghiChuDuyet || '',
				urlMinhChung: existing?.urlMinhChung || '',
			};
		});
		setSelectedUsers(list);
	};

	const handleImportedUsers = (val: any[]) => {
		hasImported.current = true;
		handleSetSelectedUsers(val);
		setShowTable(true);
		setImportOpen(false);
	};

	const handleImportVisibleChange = (visible: boolean) => {
		setImportOpen(visible);
		if (!visible && !hasImported.current) {
			onCancel();
		}
	};

	const handleConfirm = async () => {
		const newStudents = (selectedUsers ?? [])
			.map((u: any) => ({
				maSinhVien: u.code,
				hoTen: u.fullname || '',
				khoaSinhVien: u.khoaSinhVien || u.maKhoaSinhVien || u.tenKhoaSinhVien || '',
				khoaNganh:
					u.khoaNganh?.ten ||
					u.khoaNganh?.ma ||
					(typeof u.khoaNganh === 'string' ? u.khoaNganh : undefined) ||
					u.tenKhoaNganh ||
					u.maKhoaNganh ||
					'',
				soDienThoai: u.soDienThoai || u.sdt || '',
				email: u.email || '',
			}))
			.filter((item) => item.maSinhVien);

		setSubmitting(true);
		try {
			await onOk(newStudents);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<ModalImportAny
				visible={importOpen}
				setVisible={handleImportVisibleChange}
				setSelectedUsers={handleImportedUsers}
				selectedUsers={[]}
				role={EVaiTroKhaoSat.SINH_VIEN}
				customImport={customImportConfig}
			/>
			<Modal
				open={open && showTable}
				onCancel={onCancel}
				title={
					<span style={{ fontWeight: 700, fontSize: 16 }}>
						Chọn/nhập danh sách sinh viên miễn KTX – HK {activeSemester?.maHocKy || selectedSemesterMa || ''}
					</span>
				}
				width={950}
				footer={null}
				destroyOnClose
				forceRender={open}
			>
				<div style={{ padding: '8px 0' }}>
					<TableSelectUserAny
						type={EVaiTroKhaoSat.SINH_VIEN}
						selectedUsers={selectedUsers}
						setSelectedUsers={handleSetSelectedUsers}
						customImport={customImportConfig}
						customStudentColumn={{
							title: 'Khoá sinh viên',
							dataIndex: 'khoaSinhVien',
						}}
						singleTable={true}
						hideImport={true}
					/>
					<div style={{ textAlign: 'right', marginTop: 20 }}>
						<Button
							onClick={handleConfirm}
							loading={submitting}
							type='primary'
							style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6, padding: '0 24px' }}
						>
							Chọn xong
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
