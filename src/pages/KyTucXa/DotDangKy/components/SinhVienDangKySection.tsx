import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, message, type FormInstance } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
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
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	return (
		<Card title={t('kytucxa.dotdangky.themMoiSinhVien')}>
			<Form
				form={form}
				layout='vertical'
				onFinish={async (values) => {
					const shouldClose = await props.onSubmit?.(values);
					if (shouldClose === false) return;
					props.onCancel?.();
				}}
			>
				<Form.Item
					name='maSinhVien'
					label={t('kytucxa.dotdangky.sinhVien')}
					rules={[{ required: true, message: t('kytucxa.dotdangky.message.chonSinhVien') }]}
				>
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
						{t('global.button.themmoi')}
					</Button>
					<Button htmlType='button' onClick={props.onCancel}>
						{t('global.button.huy')}
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
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
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
			const headers = [
				['TT', t('kytucxa.dotdangky.maSinhVien'), t('kytucxa.dotdangky.hoTen'), t('kytucxa.dotdangky.khoaSinhVien')],
			];
			const worksheet = XLSX.utils.aoa_to_sheet(headers);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, t('kytucxa.dotdangky.excel.sheetTemplate'));
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			fileDownload(blob, t('kytucxa.dotdangky.excel.templateFileName'));
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
								const code = row[t('kytucxa.dotdangky.maSinhVien')]?.toString()?.trim() || '';
								const fullname = row[t('kytucxa.dotdangky.hoTen')]?.toString()?.trim() || '';
								const khoa = row[t('kytucxa.dotdangky.khoaSinhVien')]?.toString()?.trim() || '';
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
			message.warning(t('kytucxa.dotdangky.message.keepCurrentStudentList'));
			return;
		}

		if (dotId && record._id) {
			try {
				await deleteSinhVienDangKy(dotId, record._id);
				message.success(t('kytucxa.dotdangky.message.deleteStudentSuccess'));
				fetchStudents();
			} catch (err) {
				console.error(err);
				message.error(t('kytucxa.dotdangky.message.deleteStudentFailed'));
			}
		} else {
			const nextUsers = selectedUsers.filter((u) => u.code !== record.code);
			updateSelectedUsers(nextUsers);
		}
	};

	const onAddStudent = async (values: { maSinhVien: string; hoTen?: string; khoaSinhVien?: string }) => {
		if (isEnded) {
			message.warning(t('kytucxa.dotdangky.message.endedCannotEditStudentList'));
			return false;
		}

		const maSinhVien = values.maSinhVien?.trim();
		if (!maSinhVien) return false;

		if (selectedUsers.some((item) => item.code === maSinhVien)) {
			message.warning(t('kytucxa.dotdangky.message.studentAlreadyExists'));
			return false;
		}

		const payload = {
			maSinhVien,
			hoTen: values.hoTen?.trim() || '',
			khoaSinhVien: values.khoaSinhVien?.trim() || '',
		};

		if (dotId) {
			await postSinhVienDangKy(dotId, [payload]);
			message.success(t('kytucxa.dotdangky.message.addStudentSuccess'));
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
			title: t('kytucxa.dotdangky.maSinhVien'),
			dataIndex: 'code',
			key: 'code',
			width: 150,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.hoTen'),
			dataIndex: 'fullname',
			key: 'fullname',
			width: 220,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.khoaSinhVien'),
			dataIndex: 'khoaSinhVien',
			key: 'khoaSinhVien',
			width: 150,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.thaoTac'),
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

			<span style={{ fontWeight: 'bold', marginBottom: 12 }}>{t('kytucxa.dotdangky.danhSachSinhVienDangKy')}</span>

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
			/>

			<Modal
				open={visibleSelect}
				onCancel={() => setVisibleSelect(false)}
				title={t('kytucxa.dotdangky.chonNhapDanhSachSinhVien')}
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
						title: t('kytucxa.dotdangky.khoaSinhVien'),
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
						{t('kytucxa.dotdangky.chonXong')}
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default SinhVienDangKySection;
