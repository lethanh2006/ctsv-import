import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import KhoaToaConfigTable from '@/pages/KyTucXa/DotDangKy/components/KhoaToaConfigTable';
import RoomTable from '@/pages/KyTucXa/DotDangKy/components/RoomTable';
import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import SinhVienDangKySection from '@/pages/KyTucXa/DotDangKy/components/SinhVienDangKySection';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import rules from '@/utils/rules';
import type { FormInstance } from 'antd';
import { Col, Form, Row, message } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';

interface StepChonDoiTuongProps {
	form: FormInstance;
	loaiDot: string;
	selectedKhoaNganh: string[];
	setSelectedKhoaNganh: (value: string[]) => void;
	initialKhoaNganh?: string[];
	selectedKhoaRows: Array<{
		ma: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: { ten?: string };
	}>;
	khoaToaConfig: Record<string, string[]>;
	setKhoaToaConfig: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
	initialKhoaToaConfig?: Record<string, string[]>;
	selectedToaNhaIds: string[];
	setSelectedToaNhaIds: (value: string[]) => void;
	initialToaNhaIds?: string[];
	selectedPhongIds: string[];
	setSelectedPhongIds: React.Dispatch<React.SetStateAction<string[]>>;
	isOngoing?: boolean;
	isEnded?: boolean;
	isPublished?: boolean;
}

const StepChonDoiTuong: React.FC<StepChonDoiTuongProps> = ({
	form,
	loaiDot,
	selectedKhoaNganh,
	setSelectedKhoaNganh,
	initialKhoaNganh = [],
	selectedKhoaRows,
	khoaToaConfig,
	setKhoaToaConfig,
	initialKhoaToaConfig = {},
	selectedToaNhaIds,
	setSelectedToaNhaIds,
	initialToaNhaIds = [],
	selectedPhongIds,
	setSelectedPhongIds,
	isOngoing,
	isEnded,
	isPublished,
}) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { record, visibleForm, edit } = useModel('kytucxa.dotdangkyktx');
	const { danhSach: allPhong } = useModel('theodoitaisanvattu.phong');

	const selectedPhongRowKeys = allPhong
		.filter((phong: any) => selectedPhongIds.includes(phong.ma))
		.map((phong: any) => phong._id);

	const ensureKeepInitialValues = (nextValue: string[], initialValue: string[], warningMessage: string) => {
		const removed = initialValue.some((item) => !nextValue.includes(item));
		if (removed) {
			message.warning(warningMessage);
			return Array.from(new Set([...initialValue, ...nextValue]));
		}
		return nextValue;
	};

	return (
		<>
			<Row gutter={[12, 0]}>
				{loaiDot === ELoaiDotDangKyKTX.THEO_KHOA ? (
					<Col xs={24}>
						<Form.Item name='maKhoaNganh' label={t('kytucxa.dotdangky.khoaSinhVienApDung')} rules={[...rules.required]}>
							<SelectKhoaSinhVien
								multiple
								selectMa
								allowClear={!isOngoing && !isPublished}
								disabled={isEnded || isPublished}
								placeholder={t('kytucxa.dotdangky.chonKhoaSinhVien')}
								onChange={(value) => {
									const rawNextValue = Array.isArray(value) ? (value as string[]) : [];
									const nextValue = isOngoing
										? ensureKeepInitialValues(
												rawNextValue,
												initialKhoaNganh,
												t('kytucxa.dotdangky.message.keepCurrentStudentCohorts'),
											)
										: rawNextValue;
									setSelectedKhoaNganh(nextValue);
									form.setFieldValue('maKhoaNganh', nextValue);
									setKhoaToaConfig((currentValue) => {
										const nextValueConfig = nextValue.reduce<Record<string, string[]>>(
											(accumulator, maKhoaSinhVien) => {
												accumulator[maKhoaSinhVien] = currentValue[maKhoaSinhVien] ?? [];
												return accumulator;
											},
											{},
										);
										return nextValueConfig;
									});
								}}
							/>
						</Form.Item>
						{selectedKhoaRows.length > 0 && (
							<KhoaToaConfigTable
								selectedKhoaNganh={selectedKhoaRows}
								value={khoaToaConfig}
								initialValue={initialKhoaToaConfig}
								onlyAllowExpand={isOngoing && !isPublished}
								disabled={isEnded || isPublished}
								onChange={(nextValue) => setKhoaToaConfig(nextValue)}
							/>
						)}
					</Col>
				) : null}
				{loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH ? (
					<Col xs={24} md={12}>
						<Form.Item name='danhSachToaNha' label={t('kytucxa.dotdangky.toaNha')} rules={[...rules.required]}>
							<SelectToaNha
								multiple
								selectMa
								allowClear={!isOngoing && !isPublished}
								disabled={isEnded || isPublished}
								onChange={(ids) => {
									const rawNextValue = Array.isArray(ids) ? ids : ids ? [ids] : [];
									const nextValue = isOngoing
										? ensureKeepInitialValues(
												rawNextValue,
												initialToaNhaIds,
												t('kytucxa.dotdangky.message.keepCurrentBuildings'),
											)
										: rawNextValue;
									setSelectedToaNhaIds(nextValue);
									form.setFieldValue('danhSachToaNha', nextValue);
									if (edit) {
										setSelectedPhongIds((prev) => {
											const filtered = prev.filter((phongMa) => {
												const phong = allPhong.find((p: any) => p.ma === phongMa);
												if (!phong) return true;
												const maToaNha = phong.maToaNha ?? phong.toaNha?.ma;
												return maToaNha && nextValue.includes(maToaNha);
											});
											if (JSON.stringify(filtered) === JSON.stringify(prev)) return prev;
											return filtered;
										});
									}
								}}
							/>
						</Form.Item>
					</Col>
				) : null}
			</Row>

			{loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH && selectedToaNhaIds.length ? (
				<div style={{ marginTop: 12 }}>
					<RoomTable
						toaNhaIds={selectedToaNhaIds}
						selectedRowKeys={selectedPhongRowKeys}
						disabled={isEnded || isPublished}
						onChangeSelectedKeys={(keys) => {
							setSelectedPhongIds(
								keys
									.map((key) => allPhong.find((phong: any) => phong._id === key)?.ma)
									.filter((ma): ma is string => !!ma),
							);
						}}
					/>
				</div>
			) : null}
			{loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH ? (
				<SinhVienDangKySection
					form={form}
					dotId={record?._id}
					visible={visibleForm}
					isEnded={isEnded || isPublished}
					isOngoing={isOngoing}
				/>
			) : null}
		</>
	);
};

export default StepChonDoiTuong;
