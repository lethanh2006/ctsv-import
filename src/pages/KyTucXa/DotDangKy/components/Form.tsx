import StepChonDoiTuong from '@/pages/KyTucXa/DotDangKy/components/StepChonDoiTuong';
import StepThongTin from '@/pages/KyTucXa/DotDangKy/components/StepThongTin';
import { ELoaiDotDangKyKTX, ETrangThaiPhatHanh } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Steps, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotDangKyKTX = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.dotdangkyktx');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { postSinhVienDangKy } = useModel('kytucxa.dotdangkyktx');
	const loaiDot = Form.useWatch('loaiDot', form) ?? ELoaiDotDangKyKTX.THEO_KHOA;
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
	const isPublished = record?.trangThaiPhatHanh === ETrangThaiPhatHanh.DA_PHAT_HANH;

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
			const initialLoaiDot =
				record?.loaiDot ??
				(record?.cauHinhKhoaToa?.length ? ELoaiDotDangKyKTX.THEO_KHOA : ELoaiDotDangKyKTX.THEO_DANH_SACH);
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
				loaiDot: ELoaiDotDangKyKTX.THEO_KHOA,
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
			message.error(t('kytucxa.dotdangky.message.endedCannotEdit'));
			return;
		}

		if (isOngoing && values?.thoiGianKetThuc && dayjs(values.thoiGianKetThuc).endOf('day').isBefore(dayjs())) {
			message.error(t('kytucxa.dotdangky.validation.endTimeAfterNow'));
			return;
		}

		if (isOngoing) {
			if (initialKhoaNganh.some((ma) => !selectedKhoaNganh.includes(ma))) {
				message.error(t('kytucxa.dotdangky.message.keepCurrentStudentCohorts'));
				return;
			}
			if (initialToaNhaIds.some((ma) => !selectedToaNhaIds.includes(ma))) {
				message.error(t('kytucxa.dotdangky.message.keepCurrentBuildings'));
				return;
			}
			const removedToaByKhoa = Object.entries(initialKhoaToaConfig).some(([maKhoaSinhVien, danhSachToaNha]) =>
				danhSachToaNha.some((maToaNha) => !(khoaToaConfig[maKhoaSinhVien] ?? []).includes(maToaNha)),
			);
			if (removedToaByKhoa) {
				message.error(t('kytucxa.dotdangky.message.keepCurrentCohortBuildings'));
				return;
			}
		}

		if (loaiDot === ELoaiDotDangKyKTX.THEO_KHOA) {
			if (!selectedKhoaNganh.length) {
				message.error(t('kytucxa.dotdangky.message.selectAtLeastOneCohort'));
				return;
			}
			if (selectedKhoaRows.some((row) => !(khoaToaConfig[row.maKhoaSinhVien ?? row.ma]?.length ?? 0))) {
				message.error(t('kytucxa.dotdangky.message.eachCohortNeedsBuilding'));
				return;
			}
		}

		if (loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH) {
			if (!selectedToaNhaIds.length) {
				message.error(t('kytucxa.dotdangky.message.selectAtLeastOneBuilding'));
				return;
			}
			if (!selectedPhongIds.length) {
				message.error(t('kytucxa.dotdangky.message.selectAtLeastOneRoom'));
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
				loaiDot === ELoaiDotDangKyKTX.THEO_KHOA
					? selectedKhoaRows.map((row) => ({
							maKhoaSinhVien: row.maKhoaSinhVien ?? row.ma,
							danhSachToaNha: khoaToaConfig[row.maKhoaSinhVien ?? row.ma] ?? [],
						}))
					: [],
			hanDuyetMien: values?.hanDuyetMien ? dayjs(values.hanDuyetMien).toISOString() : null,
			danhSachToaNha: loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH ? selectedToaNhaIds : [],
			danhSachPhong: loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH ? selectedPhongIds : [],
			trangThaiPhatHanh: edit ? record?.trangThaiPhatHanh : ETrangThaiPhatHanh.CHUA_PHAT_HANH,
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
				<Steps.Step title={t('kytucxa.dotdangky.step.thongTinDot')} />
				<Steps.Step title={t('kytucxa.dotdangky.step.chonDoiTuong')} disabled={!record?._id && currentStep === 0} />
			</Steps>

			<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
				<StepThongTin isOngoing={isOngoing} isEnded={isEnded} isPublished={isPublished} />
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
					isPublished={isPublished}
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
							{t('global.button.tieptheo')}
						</Button>
						<Button htmlType='button' onClick={() => setVisibleForm(false)}>
							{t('global.button.huy')}
						</Button>
					</>
				) : (
					<>
						<Button loading={formSubmiting} disabled={isEnded || isPublished} htmlType='submit' type='primary'>
							{!edit ? t('global.button.themmoi') : t('global.button.luulai')}
						</Button>
						<Button htmlType='button' onClick={() => setCurrentStep(0)}>
							{t('kytucxa.dotdangky.quayLai')}
						</Button>
					</>
				)}
			</div>
		</Form>
	);
};

export default FormDotDangKyKTX;
