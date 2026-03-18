import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	EChucVuThanhVienCauLacBo,
	ELoaiThanhVienCauLacBo,
	ETrangThaiThanhVien,
	MapKeyChucVuThanhVienCLB,
	MapKeyVaiTroThanhVienPhongBanCLB,
} from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormThanhVienCLB from './Form';

const ThanhVienCauLacBo = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, getModel, putModel } = useModel('caulacbo.thanhvien');
	const { danhSach, getAllModel } = useModel('caulacbo.phongban');
	const { record: recCLB } = useModel('caulacbo.caulacbo');
	const getData = () => {
		getModel({ cauLacBoId: recCLB?._id });
	};
	useEffect(() => {
		getAllModel(false, undefined, { cauLacBoId: recCLB?._id });
	}, [recCLB?._id]);

	const columns: IColumn<CauLacBo.ThanhVien>[] = [
		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.trangthai' }),
			dataIndex: 'trangThai',
			width: 150,
			filterType: 'select',
			align: 'center',
			filterData: Object.values(ETrangThaiThanhVien).map((item) => ({ value: item, label: item })),
			render: (val, rec) => (
				<Switch
					size='small'
					checkedChildren={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.hoatdong' })}
					unCheckedChildren={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.hoatdong' })}
					checked={val === ETrangThaiThanhVien.DANG_HOAT_DONG ? true : false}
					onChange={(checked) =>
						putModel(rec._id, {
							...rec,
							trangThai: checked ? ETrangThaiThanhVien.DANG_HOAT_DONG : ETrangThaiThanhVien.NGUNG_HOAT_DONG,
						} as CauLacBo.ThanhVien)
					}
				/>
			),
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.hoten' }),
			dataIndex: 'hoTen',
			width: 200,
			align: 'center',
			filterType: 'string',
		},

		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.masv' }),
			dataIndex: 'maSinhVien',
			width: 150,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.vaitro' }),
			width: 200,
			align: 'center',
			dataIndex: 'chucVuThanhVienCauLacBo',
			render: (val, rec: CauLacBo.ThanhVien) => (
				<div>
					{rec.chucVuThanhVienCauLacBo ? (
						<div>{MapKeyChucVuThanhVienCLB[rec.chucVuThanhVienCauLacBo]}</div>
					) : (
						<div>{intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.thanhvien' })}</div>
					)}
				</div>
			),
			filterType: 'select',
			filterData: Object.values(EChucVuThanhVienCauLacBo).map((item) => ({
				value: item,
				label: MapKeyChucVuThanhVienCLB[item],
			})),
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.loai' }),
			width: 200,
			align: 'center',
			dataIndex: 'loaiThanhVien',
			filterType: 'select',
			filterData: Object.values(ELoaiThanhVienCauLacBo).map((item) => ({
				value: item,
				label: item,
			})),
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.banbophan' }),
			width: 200,
			dataIndex: 'danhSachBanBoPhan.banBoPhanId',
			render: (val, rec: CauLacBo.ThanhVien) => (
				<div>
					{rec?.danhSachBanBoPhan?.map((item) => (
						<div key={item.banBoPhanId}>
							{`- ${[
								danhSach.find((ele) => ele._id === item.banBoPhanId)?.ten,
								MapKeyVaiTroThanhVienPhongBanCLB?.[item?.vaiTroThanhVienBanBoPhan ?? ''],
							]
								.filter((ele) => ele)
								.join(': ')}`}
						</div>
					))}
				</div>
			),
			filterType: 'select',
			filterData: danhSach.map((item) => ({
				value: item._id,
				label: item.ten,
			})),
		},

		{
			title: intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.ThanhVien) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getData);
							}}
							title={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.confirm.xoa' })}
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			params={{ cauLacBoId: recCLB?._id }}
			buttons={{ import: true }}
			getData={getData}
			otherProps={{ size: 'small' }}
			hideCard
			widthDrawer={600}
			Form={FormThanhVienCLB}
			title={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv.title' })}
			modelName={'caulacbo.thanhvien'}
			columns={columns}
			dependencies={[recCLB?._id]}
		/>
	);
};

export default ThanhVienCauLacBo;
