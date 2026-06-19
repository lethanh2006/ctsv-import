import StepChonDoiTuong from '@/pages/KyTucXa/DotDangKy/components/StepChonDoiTuong';
import StepThongTin from '@/pages/KyTucXa/DotDangKy/components/StepThongTin';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Steps, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDotDangKyKTX = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.dotdangky');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { postSinhVienDangKy } = useModel('kytucxa.dotdangkyktx');
	const loaiDot = Form.useWatch('loaiDot', form) ?? 'Theo khoa';
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedToaNhaIds, setSelectedToaNhaIds] = useState<string[]>([]);
	const [selectedPhongIds, setSelectedPhongIds] = useState<string[]>([]);
	const [selectedKhoaNganh, setSelectedKhoaNganh] = useState<string[]>([]);
	const [initialKhoaNganh, setInitialKhoaNganh] = useState<string[]>([]);
	const [initialToaNhaIds, setInitialToaNhaIds] = useState<string[]>([]);
	const [initialKhoaToaConfig, setInitialKhoaToaConfig] = useState<Record<string, string[]>>({});
	const [selectedKhoaRows, setSelectedKhoaRows] = useState<
		Array<{
			ma: string;
			maKhoaSinhVien?: string;
			khoaSinhVien?: {
				ten?: string;
			};
		}>
	>([]);
	const [khoaToaConfig, setKhoaToaConfig] = useState<Record<string, string[]>>({});

	const { danhSach: allPhong } = useModel('theodoitaisanvattu.phong');

	const { getAllModel: getAllToaNha } = useModel('theodoitaisanvattu.toanha');
	const { danhSach: allKhoaSinhVien, getAllModel: getAllKhoaSinhVien } = useModel('daotaov2.namhoc.khoasinhvien');

	const getDateValue = (value?: string | null) => (value ? dayjs(value) : null);
	const now = dayjs();
	const isOngoing =
		!!record?._id &&
		!!record?.thoiGianBatDau &&
		!!record?.thoiGianKetThuc &&
		!now.isBefore(dayjs(record.thoiGianBatDau)) &&
		!now.isAfter(dayjs(record.thoiGianKetThuc));
	const isEnded = !!record?._id && !!record?.thoiGianKetThuc && now.isAfter(dayjs(record.thoiGianKetThuc));

	useEffect(() => {
		if (visibleForm) {
			getAllToaNha();
			getAllKhoaSinhVien(undefined, { namHocBatDau: -1 });
			setCurrentStep(0);
		}
	}, [visibleForm]);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	useEffect(() => {
		const nextRows = selectedKhoaNganh.map((ma) => {
			const khoaSv = allKhoaSinhVien.find((item) => item.ma === ma);
			return {
				ma,
				maKhoaSinhVien: ma,
				khoaSinhVien: khoaSv,
			};
		});
		setSelectedKhoaRows(nextRows);
	}, [selectedKhoaNganh, allKhoaSinhVien]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedToaNhaIds([]);
			setSelectedPhongIds([]);
			setSelectedKhoaNganh([]);
			setInitialKhoaNganh([]);
			setSelectedKhoaRows([]);
			setKhoaToaConfig({});
			setInitialKhoaToaConfig({});
			setInitialToaNhaIds([]);
			return;
		}

		if (record?._id) {
			const initialLoaiDot = record?.loaiDot ?? (record?.cauHinhKhoaToa?.length ? 'Theo khoa' : 'Theo danh sách');
			const danhSachToaNha = record?.danhSachToaNha ?? [];
			const danhSachPhong = record?.danhSachPhong ?? [];
			const cauHinh = record?.cauHinhKhoaToa ?? [];
			const khoaNganh = cauHinh.length ? cauHinh.map((item: any) => item.maKhoaSinhVien) : (record?.maKhoaNganh ?? []);
			const nextKhoaToaConfig = cauHinh.reduce<Record<string, string[]>>((accumulator: any, item: any) => {
				accumulator[item.maKhoaSinhVien] = item.danhSachToaNha ?? [];
				return accumulator;
			}, {});

			form.setFieldsValue({
				...record,
				loaiDot: initialLoaiDot,
				maHocKy: recHocKy?.ma,
				maKhoaNganh: khoaNganh,
				danhSachToaNha,
				thoiGianBatDau: getDateValue(record?.thoiGianBatDau),
				thoiGianKetThuc: getDateValue(record?.thoiGianKetThuc),
				ngayChuyenVao: getDateValue(record?.ngayChuyenVao),
				ngayChuyenRa: getDateValue(record?.ngayChuyenRa),
				hanDuyetMien: getDateValue(record?.hanDuyetMien),
			});
			setSelectedKhoaNganh(khoaNganh);
			setInitialKhoaNganh(khoaNganh);
			setSelectedKhoaRows(cauHinh as any);
			setKhoaToaConfig(nextKhoaToaConfig);
			setInitialKhoaToaConfig(nextKhoaToaConfig);
			setSelectedToaNhaIds(danhSachToaNha);
			setInitialToaNhaIds(danhSachToaNha);
			setSelectedPhongIds(danhSachPhong);
		} else {
			form.setFieldsValue({
				maHocKy: recHocKy?.ma,
				loaiDot: 'Theo khoa',
				maKhoaNganh: [],
				danhSachToaNha: [],
				hanDuyetMien: null,
			});
			setSelectedToaNhaIds([]);
			setInitialToaNhaIds([]);
			setSelectedPhongIds([]);
			setSelectedKhoaNganh([]);
			setInitialKhoaNganh([]);
			setSelectedKhoaRows([]);
			setKhoaToaConfig({});
			setInitialKhoaToaConfig({});
		}
	}, [record?._id, visibleForm, recHocKy?.ma]);

	useEffect(() => {
		if (!visibleForm) return;
		if (edit) return;
		if (!allPhong || allPhong.length === 0) return;

		const nextPhongIds = allPhong
			.filter((phong: any) => {
				const maToaNha = phong.maToaNha ?? phong.toaNha?.ma;
				return maToaNha && selectedToaNhaIds.includes(maToaNha);
			})
			.map((phong: any) => phong.ma);
		setSelectedPhongIds(nextPhongIds);
	}, [selectedToaNhaIds, allPhong, visibleForm, edit]);

	const handleNextStep = async () => {
		try {
			const fieldsToValidate = [
				'tenDot',
				'maHocKy',
				'ngayChuyenVao',
				'ngayChuyenRa',
				'thoiGianBatDau',
				'thoiGianKetThuc',
				'loaiDot',
				'hanDuyetMien',
				'ghiChu',
			];
			await form.validateFields(fieldsToValidate);

			setCurrentStep(1);
		} catch (error) {
			console.log('Validation failed:', error);
		}
	};

	const onFinish = async (values: KyTucXa.IDotDangKyKTX) => {
		if (currentStep === 0) {
			await handleNextStep();
			return;
		}

		if (isEnded) {
			message.error('Đợt đăng ký đã kết thúc, không được chỉnh sửa');
			return;
		}

		if (isOngoing && values?.thoiGianKetThuc && dayjs(values.thoiGianKetThuc).endOf('day').isBefore(dayjs())) {
			message.error('Registration end time must be greater than or equal to the current time.');
			return;
		}

		if (isOngoing) {
			if (initialKhoaNganh.some((ma) => !selectedKhoaNganh.includes(ma))) {
				message.error('Không được xóa khóa sinh viên hiện có khi đợt đăng ký đang diễn ra');
				return;
			}
			if (initialToaNhaIds.some((ma) => !selectedToaNhaIds.includes(ma))) {
				message.error('Không được xóa tòa nhà hiện có khi đợt đăng ký đang diễn ra');
				return;
			}
			const removedToaByKhoa = Object.entries(initialKhoaToaConfig).some(([maKhoaSinhVien, danhSachToaNha]) =>
				danhSachToaNha.some((maToaNha) => !(khoaToaConfig[maKhoaSinhVien] ?? []).includes(maToaNha)),
			);
			if (removedToaByKhoa) {
				message.error('Không được xóa tòa nhà hiện có của khóa sinh viên khi đợt đăng ký đang diễn ra');
				return;
			}
		}

		if (loaiDot === 'Theo khoa') {
			if (!selectedKhoaNganh.length) {
				message.error('Vui lòng chọn ít nhất 1 khóa sinh viên');
				return;
			}
			if (selectedKhoaRows.some((row) => !(khoaToaConfig[row.maKhoaSinhVien ?? row.ma]?.length ?? 0))) {
				message.error('Mỗi khóa sinh viên phải có ít nhất 1 tòa nhà');
				return;
			}
		}

		if (loaiDot === 'Theo danh sách') {
			if (!selectedToaNhaIds.length) {
				message.error('Vui lòng chọn ít nhất 1 tòa nhà');
				return;
			}
			if (!selectedPhongIds.length) {
				message.error('Vui lòng chọn ít nhất 1 phòng');
				return;
			}
		}

		const { danhSachToaNha, danhSach, ...restValues } = values as any;
		const startDate = values?.thoiGianBatDau ? dayjs(values.thoiGianBatDau).startOf('day').toISOString() : undefined;
		const endDate = values?.thoiGianKetThuc ? dayjs(values.thoiGianKetThuc).endOf('day').toISOString() : undefined;
		const payload: Partial<KyTucXa.IDotDangKyKTX> = {
			...restValues,
			loaiDot,
			startDate,
			endDate,
			thoiGianBatDau: startDate,
			thoiGianKetThuc: endDate,
			ngayChuyenVao: values?.ngayChuyenVao ? dayjs(values.ngayChuyenVao).toISOString() : undefined,
			ngayChuyenRa: values?.ngayChuyenRa ? dayjs(values.ngayChuyenRa).toISOString() : undefined,
			maKhoaNganh: values?.maKhoaNganh ?? [],
			cauHinhKhoaToa:
				loaiDot === 'Theo khoa'
					? selectedKhoaRows.map((row) => ({
							maKhoaSinhVien: row.maKhoaSinhVien ?? row.ma,
							danhSachToaNha: khoaToaConfig[row.maKhoaSinhVien ?? row.ma] ?? [],
						}))
					: [],
			hanDuyetMien: values?.hanDuyetMien ? dayjs(values.hanDuyetMien).toISOString() : null,
			danhSachToaNha: loaiDot === 'Theo danh sách' ? selectedToaNhaIds : [],
			danhSachPhong: loaiDot === 'Theo danh sách' ? selectedPhongIds : [],
		};

		if (edit) {
			const dotId = record?._id ?? '';
			await putModel(dotId, payload, getData).catch((er) => console.log(er));
			if (danhSach?.length) {
				await postSinhVienDangKy?.(dotId, danhSach).catch((er) => console.log(er));
			}
		} else {
			const res = await postModel(payload, getData).catch((er) => console.log(er));
			const newDotId = res?._id;
			if (newDotId && danhSach?.length) {
				await postSinhVienDangKy?.(newDotId, danhSach).catch((er) => console.log(er));
			}
		}
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={(step) => {
					if (record?._id || step < currentStep) {
						setCurrentStep(step);
					}
				}}
				type='navigation'
			>
				<Steps.Step title='Thông tin đợt' />
				<Steps.Step title='Chọn đối tượng' disabled={!record?._id && currentStep === 0} />
			</Steps>

			<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
				<StepThongTin isOngoing={isOngoing} isEnded={isEnded} />
			</div>

			<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
				<StepChonDoiTuong
					form={form}
					loaiDot={loaiDot}
					selectedKhoaNganh={selectedKhoaNganh}
					setSelectedKhoaNganh={setSelectedKhoaNganh}
					initialKhoaNganh={initialKhoaNganh}
					selectedKhoaRows={selectedKhoaRows}
					khoaToaConfig={khoaToaConfig}
					setKhoaToaConfig={setKhoaToaConfig}
					initialKhoaToaConfig={initialKhoaToaConfig}
					selectedToaNhaIds={selectedToaNhaIds}
					setSelectedToaNhaIds={setSelectedToaNhaIds}
					initialToaNhaIds={initialToaNhaIds}
					selectedPhongIds={selectedPhongIds}
					setSelectedPhongIds={setSelectedPhongIds}
					isOngoing={isOngoing}
					isEnded={isEnded}
				/>
			</div>

			<div className='form-footer'>
				{currentStep === 0 ? (
					<>
						<Button
							htmlType='button'
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleNextStep();
							}}
							type='primary'
						>
							Tiếp theo
						</Button>
						<Button htmlType='button' onClick={() => setVisibleForm(false)}>
							Hủy
						</Button>
					</>
				) : (
					<>
						<Button loading={formSubmiting} disabled={isEnded} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
						<Button htmlType='button' onClick={() => setCurrentStep(0)}>
							Quay lại
						</Button>
					</>
				)}
			</div>
		</Form>
	);
};

export default FormDotDangKyKTX;
