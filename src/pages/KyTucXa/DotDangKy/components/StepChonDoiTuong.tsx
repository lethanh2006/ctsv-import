import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import KhoaToaConfigTable from '@/pages/KyTucXa/DotDangKy/components/KhoaToaConfigTable';
import RoomTable from '@/pages/KyTucXa/DotDangKy/components/RoomTable';
import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import SinhVienDangKySection from '@/pages/KyTucXa/DotDangKy/components/SinhVienDangKySection';
import rules from '@/utils/rules';
import type { FormInstance } from 'antd';
import { Col, Form, Row, message } from 'antd';
import React from 'react';
import { useModel } from 'umi';

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
}) => {
	const { record, visibleForm, edit } = useModel('kytucxa.dotdangky');
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
				{loaiDot === 'Theo khoa' ? (
					<Col xs={24}>
						<Form.Item name='maKhoaNganh' label='Khóa sinh viên áp dụng' rules={[...rules.required]}>
							<SelectKhoaSinhVien
								multiple
								selectMa
								allowClear={!isOngoing}
								disabled={isEnded}
								placeholder='Chọn khóa sinh viên'
								onChange={(value) => {
									const rawNextValue = Array.isArray(value) ? (value as string[]) : [];
									const nextValue = isOngoing
										? ensureKeepInitialValues(
												rawNextValue,
												initialKhoaNganh,
												'Không được xóa khóa sinh viên hiện có khi đợt đăng ký đang diễn ra',
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
								onlyAllowExpand={isOngoing}
								disabled={isEnded}
								onChange={(nextValue) => setKhoaToaConfig(nextValue)}
							/>
						)}
					</Col>
				) : null}
				{loaiDot === 'Theo danh sách' ? (
					<Col xs={24} md={12}>
						<Form.Item name='danhSachToaNha' label='Tòa nhà' rules={[...rules.required]}>
							<SelectToaNha
								multiple
								selectMa
								allowClear={!isOngoing}
								disabled={isEnded}
								onChange={(ids) => {
									const rawNextValue = Array.isArray(ids) ? ids : ids ? [ids] : [];
									const nextValue = isOngoing
										? ensureKeepInitialValues(
												rawNextValue,
												initialToaNhaIds,
												'Không được xóa tòa nhà hiện có khi đợt đăng ký đang diễn ra',
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

			{loaiDot === 'Theo danh sách' && selectedToaNhaIds.length ? (
				<div style={{ marginTop: 12 }}>
					<RoomTable
						toaNhaIds={selectedToaNhaIds}
						selectedRowKeys={selectedPhongRowKeys}
						disabled={isEnded}
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
			{loaiDot === 'Theo danh sách' ? (
				<SinhVienDangKySection
					form={form}
					dotId={record?._id}
					visible={visibleForm}
					isEnded={isEnded}
					isOngoing={isOngoing}
				/>
			) : null}
		</>
	);
};

export default StepChonDoiTuong;
