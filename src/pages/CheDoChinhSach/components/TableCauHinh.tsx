import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCauHinh from './FormCauHinh';

const TableCauHinh = (props: { form: FormInstance; formValues: any; dataState?: string; dataSetState?: string }) => {
	const intl = useIntl();
	const { record, setRecord, setRecordCauHinh, loading, setEditCauHinh, setVisibleViewForm } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	const onCancelFormCauHinh = () => {
		setVisibleCauHinh(false);
	};

	const onSortEndCauHinh = (recordTemp: LoaiHinh.TruongThongTin, newIndex: number): void => {
		if (!record) return;
		const danhSachCauHinhThongTin =
			record?.danhSachCauHinhThongTin?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		danhSachCauHinhThongTin?.splice(newIndex, 0, recordTemp);
		setRecord({ ...record, danhSachCauHinhThongTin });
	};

	const columns: IColumn<LoaiHinh.TruongThongTin>[] = [
		{
			title: intl.formatMessage({ id: 'chedochinhsach.cauhinh.column.ma' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'chedochinhsach.cauhinh.column.ten' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'chedochinhsach.cauhinh.column.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 100,
		},

		{
			title: intl.formatMessage({ id: 'chedochinhsach.cauhinh.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.TruongThongTin) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.cauhinh.tooltip.chinhsua' })}>
						<Button
							onClick={() => {
								setVisibleCauHinh(true);
								setRecordCauHinh(rec);
								setEditCauHinh(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.cauhinh.tooltip.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								if (record) {
									setRecord({
										...record,
										danhSachCauHinhThongTin: record?.danhSachCauHinhThongTin?.filter(
											(item: { ma: string }) => item.ma !== rec.ma,
										),
									});
									props.form.setFieldsValue({
										danhSachCotHienThi: props.formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title={intl.formatMessage({ id: 'chedochinhsach.cauhinh.tooltip.confirm.delete' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	useEffect(() => {
		if (!record) {
			// @ts-ignore
			setRecord({
				danhSachCauHinhThongTin: [],
			} as CheDoSinhVien.IRecord);
		}
	}, []);
	return (
		<div>
			<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
				{intl.formatMessage({ id: 'chedochinhsach.cauhinh.dsthongtin.title' })}
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={record?.danhSachCauHinhThongTin ?? []}
				addStt
				hasTotal
				loading={loading}
			>
				<Space wrap>
					<Button
						size='small'
						type='primary'
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecordCauHinh(undefined);
							setEditCauHinh(false);
							setVisibleCauHinh(true);
						}}
					>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
					<Button
						icon={<EyeOutlined />}
						size='small'
						onClick={() => {
							setRecord(record);
							setVisibleViewForm(true);
						}}
					>
						{intl.formatMessage({ id: 'chedochinhsach.cauhinh.button.xemtruoc' })}
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				destroyOnClose
				width={700}
				footer={null}
				styles={{ padding: 0 }}
				open={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh onCancel={onCancelFormCauHinh} dataSetState={props?.dataSetState} dataState={props?.dataState} />
			</Modal>
		</div>
	);
};

export default TableCauHinh;
