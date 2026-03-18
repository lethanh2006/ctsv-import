import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import FormThemMoiBieuMau from '@/pages/DiemRenLuyen/MinhChung/CauHinh/components/Form';
import {
	EDoiTuongNhap,
	ELoaiMinhChung,
	MapEDoiTuongNhap,
	MapELoaiMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/MauDon/constants';
import type { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal, Popconfirm, Space, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import PreviewForm from './components/MauDon/Preview';

const CauHinh = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, setRecord } = useModel('diemrenluyen.minhchung.cauhinh');
	const { setVisiblePreview, visiblePreview, setRecord: setRecordLoaiHinh } = useModel('formdong.loaihinh');
	const { getAllModel } = useModel('quytrinh.danhmuc');

	const onCell = (rec: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(rec);
			setRecordLoaiHinh({ cauHinhLoaiHinh: rec?.danhSachCauHinhMinhChung ?? [] } as LoaiHinh.IRecord);
			setVisiblePreview(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.column.tenminhchung' }),
			dataIndex: 'tenMinhChung',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.column.maminhchung' }),
			dataIndex: 'maMinhChung',
			align: 'center',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.column.loaiminhchung' }),
			dataIndex: 'loaiMinhChung',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiMinhChung)?.map((val) => ({
				value: val,
				label: MapELoaiMinhChung?.[val as ELoaiMinhChung],
			})),
			width: 150,
			onCell,
			render: (val) => MapELoaiMinhChung?.[val as ELoaiMinhChung],
		},
		{
			title: intl.formatMessage({ id: 'minhchung.column.doituong' }),
			dataIndex: 'doiTuongNhap',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EDoiTuongNhap)?.map((val) => ({
				value: val,
				label: MapEDoiTuongNhap?.[val as EDoiTuongNhap],
			})),
			onCell,
			width: 150,
			render: (val) => (
				<Space>
					{val?.map((item: any) => {
						return <Tag>{MapEDoiTuongNhap?.[item as EDoiTuongNhap]}</Tag>;
					})}
				</Space>
			),
		},
		{
			title: intl.formatMessage({ id: 'minhchung.column.dungchosukien' }),
			dataIndex: 'dungChoSuKien',
			align: 'center',
			filterType: 'select',
			filterData: [
				{
					value: true,
					label: intl.formatMessage({ id: 'minhchung.form.dungsk.option1' }),
				},
				{
					value: false,
					label: intl.formatMessage({ id: 'minhchung.form.dungsk.option2' }),
				},
			],
			onCell,
			width: 120,
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chitiet' })}
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							setRecord(rec);
							setRecordLoaiHinh({ cauHinhLoaiHinh: rec?.danhSachCauHinhMinhChung ?? [] } as LoaiHinh.IRecord);
							setVisiblePreview(true);
						}}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							handleEdit(rec);
						}}
					/>
					<Popconfirm
						title={intl.formatMessage({ id: 'minhchung.confirm.xoa' })}
						placement={'topLeft'}
						onConfirm={() => {
							deleteModel(rec?._id);
						}}
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							type='link'
							danger
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<>
			<TableBase
				Form={FormThemMoiBieuMau}
				title={intl.formatMessage({ id: 'minhchung.title' })}
				modelName={'diemrenluyen.minhchung.cauhinh'}
				columns={columns}
				widthDrawer={800}
				destroyModal
			/>

			<Modal
				zIndex={1000}
				styles={{ body: { padding: 0 } }}
				footer={
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={() => setVisiblePreview(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				}
				width={900}
				open={visiblePreview}
				onCancel={() => setVisiblePreview(false)}
			>
				<PreviewForm mode='quytrinh' isView getData={() => {}} />
			</Modal>
		</>
	);
};
export default CauHinh;
