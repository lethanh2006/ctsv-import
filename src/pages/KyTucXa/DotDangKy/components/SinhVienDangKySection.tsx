import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, message, type FormInstance } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';

const TableSelectUserAny = TableSelectUser as any;

type TSinhVienDangKy = {
	_id?: string;
	code: string;
	username: string;
	fullname: string;
	khoaSinhVien: string;
	vaiTro: EVaiTroKhaoSat;
};

const mapUsersToFormValue = (users: TSinhVienDangKy[]) =>
	users
		.map((u) => ({
			maSinhVien: u.code,
			hoTen: u.fullname || '',
			khoaSinhVien: u.khoaSinhVien || '',
		}))
		.filter((item) => item.maSinhVien);

const normalizeUser = (user: any): TSinhVienDangKy => {
	const code = user?.code || user?.username || user?.maSinhVien || user?.ma || '';
	return {
		...user,
		code,
		username: code,
		fullname: user?.fullname || user?.hoTen || user?.tenSinhVien || '',
		khoaSinhVien: user?.khoaSinhVien || '',
		vaiTro: EVaiTroKhaoSat.SINH_VIEN,
	};
};

const uniqueUsers = (users: TSinhVienDangKy[]) =>
	users.filter((item, index, self) => item.code && self.findIndex((t) => t.code === item.code) === index);

const FormThemSinhVien = (props: {
	onCancel?: () => void;
	onSubmit?: (values: {
		maSinhVien: string;
		hoTen?: string;
		khoaSinhVien?: string;
	}) => Promise<boolean | void> | boolean | void;
}) => {
	const [form] = Form.useForm();

	return (
		<Card title='Thêm mới sinh viên'>
			<Form
				form={form}
				layout='vertical'
				onFinish={async (values) => {
					const shouldClose = await props.onSubmit?.(values);
					if (shouldClose === false) return;
					props.onCancel?.();
				}}
			>
				<Form.Item name='maSinhVien' label='Sinh viên' rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}>
					<SelectSinhVienDebounce
						selectMa
						onChange={(value, option) => {
							const rawData = option?.rawData;
							form.setFieldsValue({
								maSinhVien: value,
								hoTen: rawData?.ten || rawData?.hoTen || '',
								khoaSinhVien: rawData?.khoaSinhVien?.ten || rawData?.khoaSinhVien || rawData?.maKhoaSinhVien || '',
							});
						}}
					/>
				</Form.Item>
				<Form.Item name='hoTen' hidden />
				<Form.Item name='khoaSinhVien' hidden />
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						Thêm mới
					</Button>
					<Button htmlType='button' onClick={props.onCancel}>
						Hủy
					</Button>
				</div>
			</Form>
		</Card>
	);
};

const SinhVienDangKySection = (props: {
	form: FormInstance;
	dotId?: string;
	visible?: boolean;
	isOngoing?: boolean;
	isEnded?: boolean;
}) => {
	const { form, visible, dotId, isOngoing, isEnded } = props;
	const [visibleSelect, setVisibleSelect] = useState(false);
	const [showAddStudent, setShowAddStudent] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<TSinhVienDangKy[]>([]);
	const [loading, setLoading] = useState(false);
	const { getSinhVienDangKy, deleteSinhVienDangKy, postSinhVienDangKy } = useModel('kytucxa.dotdangkyktx');

	const updateSelectedUsers = (users: TSinhVienDangKy[]) => {
		const nextUsers = uniqueUsers(users);
		setSelectedUsers(nextUsers);
		form.setFieldsValue({ danhSach: mapUsersToFormValue(nextUsers) });
	};

	const fetchStudents = async () => {
		if (!dotId) return;
		setLoading(true);
		try {
			const res = await getSinhVienDangKy(dotId);
			const rawData = res?.data?.data?.result || res?.data?.data || res?.data || [];
			const data = Array.isArray(rawData) ? rawData : [];
			const list = data.map((item: any) => ({
				_id: item._id,
				code: item.maSinhVien || item.ma || '',
				username: item.maSinhVien || item.ma || '',
				fullname: item.hoTen || item.fullname || item.tenSinhVien || '',
				khoaSinhVien: item.khoaSinhVien || '',
				vaiTro: EVaiTroKhaoSat.SINH_VIEN,
			}));
			updateSelectedUsers(list);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!visible) {
			setSelectedUsers([]);
			return;
		}

		if (dotId) {
			fetchStudents();
		} else {
			setSelectedUsers([]);
			form.setFieldsValue({ danhSach: [] });
		}
	}, [dotId, visible]);

	const customImportConfig = {
		onDownloadTemplate: () => {
			const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên']];
			const worksheet = XLSX.utils.aoa_to_sheet(headers);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			fileDownload(blob, 'Mẫu nhập danh sách sinh viên.xlsx');
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
								return {
									code,
									username: code,
									fullname,
									khoaSinhVien: khoa,
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

	const onDelete = async (record: any) => {
		if (isEnded || (isOngoing && record._id)) {
			message.warning('Không được xóa danh sách sinh viên hiện tại');
			return;
		}

		if (dotId && record._id) {
			try {
				await deleteSinhVienDangKy(dotId, record._id);
				message.success('Xóa sinh viên thành công');
				fetchStudents();
			} catch (err) {
				console.error(err);
				message.error('Không thể xóa sinh viên');
			}
		} else {
			const nextUsers = selectedUsers.filter((u) => u.code !== record.code);
			updateSelectedUsers(nextUsers);
		}
	};

	const onAddStudent = async (values: { maSinhVien: string; hoTen?: string; khoaSinhVien?: string }) => {
		if (isEnded) {
			message.warning('Đợt đăng ký đã kết thúc, không được chỉnh sửa danh sách sinh viên');
			return false;
		}

		const maSinhVien = values.maSinhVien?.trim();
		if (!maSinhVien) return false;

		if (selectedUsers.some((item) => item.code === maSinhVien)) {
			message.warning('Sinh viên đã có trong danh sách');
			return false;
		}

		const payload = {
			maSinhVien,
			hoTen: values.hoTen?.trim() || '',
			khoaSinhVien: values.khoaSinhVien?.trim() || '',
		};

		if (dotId) {
			await postSinhVienDangKy(dotId, [payload]);
			message.success('Thêm sinh viên thành công');
			await fetchStudents();
			return true;
		}

		updateSelectedUsers([
			...selectedUsers,
			{
				code: payload.maSinhVien,
				username: payload.maSinhVien,
				fullname: payload.hoTen,
				khoaSinhVien: payload.khoaSinhVien,
				vaiTro: EVaiTroKhaoSat.SINH_VIEN,
			},
		]);
		return true;
	};

	const columns: IColumn<TSinhVienDangKy>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'code',
			key: 'code',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			key: 'fullname',
			width: 220,
			filterType: 'string',
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'khoaSinhVien',
			key: 'khoaSinhVien',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 80,
			align: 'center' as const,
			render: (_text: any, record: any) => {
				const disabledDelete = isEnded || (isOngoing && record._id);
				return (
					<Button
						type='link'
						danger
						disabled={disabledDelete}
						icon={<DeleteOutlined />}
						onClick={() => onDelete(record)}
					/>
				);
			},
		},
	];

	return (
		<div style={{ marginTop: 12 }}>
			<Form.Item name='danhSach' noStyle>
				<input type='hidden' />
			</Form.Item>

			<span style={{ fontWeight: 'bold', marginBottom: 12 }}>Danh sách sinh viên đăng ký KTX</span>

			<TableStaticData
				data={selectedUsers}
				columns={columns}
				loading={loading}
				size='small'
				addStt
				hasTotal
				hasCreate={!isEnded}
				showEdit={showAddStudent}
				setShowEdit={setShowAddStudent}
				Form={FormThemSinhVien}
				formProps={{ onSubmit: onAddStudent }}
				// otherButtons={[
				// 	<Button
				// 		size='small'
				// 		key='import'
				// 		onClick={() => setVisibleSelect(true)}
				// 		icon={<ImportOutlined />}
				// 		type='primary'
				// 	>
				// 		Nhập danh sách sinh viên
				// 	</Button>,
				// ]}
			/>

			<Modal
				open={visibleSelect}
				onCancel={() => setVisibleSelect(false)}
				title={'Chọn/nhập danh sách sinh viên'}
				width={900}
				footer={null}
				destroyOnClose
			>
				<TableSelectUserAny
					type={EVaiTroKhaoSat.SINH_VIEN}
					selectedUsers={selectedUsers}
					setSelectedUsers={(val: any) => {
						const unique = uniqueUsers((val || []).map(normalizeUser));
						setSelectedUsers(unique);
					}}
					customImport={customImportConfig}
					customStudentColumn={{
						title: 'Khoá sinh viên',
						dataIndex: 'khoaSinhVien',
					}}
					singleTable={true}
				/>
				<div style={{ textAlign: 'right', marginTop: 12 }}>
					<Button
						onClick={() => {
							form.setFieldsValue({ danhSach: mapUsersToFormValue(selectedUsers) });
							setVisibleSelect(false);
						}}
						type='primary'
					>
						Chọn xong
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default SinhVienDangKySection;
