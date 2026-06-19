import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import { Button, Space, Table } from 'antd';
import { useState } from 'react';

const KhoaToaConfigTable = (props: {
	selectedKhoaNganh: Array<{
		ma: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: {
			ten?: string;
		};
	}>;
	value?: Record<string, string[]>;
	initialValue?: Record<string, string[]>;
	onlyAllowExpand?: boolean;
	disabled?: boolean;
	onChange?: (nextValue: Record<string, string[]>) => void;
}) => {
	const { selectedKhoaNganh, value = {}, initialValue = {}, onlyAllowExpand, disabled, onChange } = props;
	const [bulkToaNha, setBulkToaNha] = useState<string[]>([]);

	const updateValue = (maKhoaSinhVien: string, danhSachToaNha: string[]) => {
		const initialToaNha = initialValue[maKhoaSinhVien] ?? [];
		const nextDanhSachToaNha = onlyAllowExpand
			? Array.from(new Set([...initialToaNha, ...danhSachToaNha]))
			: danhSachToaNha;
		const nextValue = {
			...value,
			[maKhoaSinhVien]: nextDanhSachToaNha,
		};
		onChange?.(nextValue);
	};

	const applyToAll = () => {
		if (!bulkToaNha.length) return;
		const nextValue = { ...value };
		selectedKhoaNganh.forEach((row) => {
			const ma = row.maKhoaSinhVien ?? row.ma;
			nextValue[ma] = onlyAllowExpand ? Array.from(new Set([...(initialValue[ma] ?? []), ...bulkToaNha])) : bulkToaNha;
		});
		onChange?.(nextValue);
	};

	return (
		<div style={{ marginTop: 12 }}>
			{selectedKhoaNganh.length > 1 && (
				<div
					style={{
						padding: '12px 16px',
						background: '#f8fafc',
						border: '1px solid #f0f0f0',
						borderRadius: '8px',
						marginBottom: '16px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: '12px',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '280px' }}>
						<span style={{ fontWeight: 500, color: '#334155', whiteSpace: 'nowrap' }}>
							Áp dụng nhanh cho tất cả các khóa:
						</span>
						<div style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
							<SelectToaNha
								multiple
								selectMa
								allowClear
								disabled={disabled}
								value={bulkToaNha}
								onChange={(ids) => setBulkToaNha(Array.isArray(ids) ? (ids as string[]) : ids ? [ids as string] : [])}
							/>
						</div>
					</div>
					<Space>
						<Button type='primary' onClick={applyToAll} disabled={disabled || bulkToaNha.length === 0}>
							Áp dụng cho tất cả
						</Button>
					</Space>
				</div>
			)}

			<Table
				size='small'
				pagination={false}
				rowKey={(record) => record.maKhoaSinhVien ?? record.ma}
				dataSource={selectedKhoaNganh}
				columns={[
					{
						title: 'Khóa ngành',
						dataIndex: 'maKhoaSinhVien',
						width: 180,
						render: (_value, record) => record?.khoaSinhVien?.ten ?? record?.maKhoaSinhVien ?? record?.ma ?? '-',
					},
					{
						title: 'Tòa nhà áp dụng',
						dataIndex: 'danhSachToaNha',
						render: (_value, record: { maKhoaSinhVien?: string; ma?: string }) => {
							const maKhoaSinhVien = record?.maKhoaSinhVien ?? record?.ma ?? '';
							return (
								<SelectToaNha
									multiple
									selectMa
									allowClear={!onlyAllowExpand}
									disabled={disabled}
									value={value?.[maKhoaSinhVien] ?? []}
									onChange={(ids) => updateValue(maKhoaSinhVien, Array.isArray(ids) ? ids : ids ? [ids] : [])}
								/>
							);
						},
					},
				]}
			/>
		</div>
	);
};

export default KhoaToaConfigTable;
