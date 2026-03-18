import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import {
	ELoaiThaoTacRaSoatCtdt,
	ETrangThaiCtdt,
	colorLoaiThaoTacRaSoatCtdt,
	loaiThaoTacRaSoatCtdt,
} from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import {
	CheckOutlined,
	DeleteOutlined,
	EyeOutlined,
	PlusCircleOutlined,
	RetweetOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import { Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import PreviewKhungCTDT from '../XemTruoc/PreviewKhungCTDT';
import ConfirmChuyenDoiKhoiHocPhan from './ConfirmChuyenDoi';
import ConfirmXoaKhoiHocPhan from './ConfirmXoa';

const TableSoSanhHocPhan = (props: { getData?: () => void }) => {
	const { combineChuongTrinh, getSoSanhChuongTrinhModel, record, postDuyetChuongTrinhModel, formSubmiting } = useModel(
		'chuongtrinhdaotao.dotchuongtrinh',
	);
	const { deleteModel } = useModel('daotaov2.chuongtrinhdaotao.thaotacrasoat');
	const {
		setRecord: setKhoi,
		setVisibleForm: setVisibleKhoi,
		getAllModel,
		loading,
	} = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const [selectedMas, setSelectedMas] = useState<string[]>([]);
	const [visibleXoa, setVisibleXoa] = useState<boolean>(false);
	const [visibleKhung, setVisibleKhung] = useState(false);

	const getDataSoSanh = () => record?.ma && getSoSanhChuongTrinhModel(record.ma);

	const columns: IColumn<ChuongTrinhDaoTao.IThaoTacRaSoat & { index: number }>[] = [
		{
			title: 'Tên học phần / khối học phần',
			width: 250,
			render: (val, rec) =>
				rec.listKhoiHpCtGoc?.map((item) => (
					<div key={item._id}>
						{(rec.listKhoiHpCtGoc?.length ?? 0) > 1 ? '- ' : ''}
						{item.khoiHpCt?.ten ?? `${item.khoiHpCt?.maHocPhan} - ${item.khoiHpCt?.hocPhan?.ten}`} -{' '}
						{item.khoiHpCt?.soTinChiTuChonPhaiHoc ?? item.khoiHpCt?.hocPhan?.soTinChi}TC
					</div>
				)),
		},
		{
			title: 'Thao tác',
			align: 'center',
			dataIndex: 'loai',
			filterType: 'select',
			filterData: Object.values(ELoaiThaoTacRaSoatCtdt).map((value) => ({
				value,
				label: loaiThaoTacRaSoatCtdt[value],
			})),
			width: 120,
			render: (val: ELoaiThaoTacRaSoatCtdt) => (
				<Tag color={colorLoaiThaoTacRaSoatCtdt[val]}>{loaiThaoTacRaSoatCtdt[val]}</Tag>
			),
		},
		{
			title: 'Học phần tương đương',
			width: 250,
			render: (val, rec) =>
				rec.khoiHpCt?._id ? (
					<>
						{rec.khoiHpCt?.maHocPhan} - {rec.khoiHpCt?.hocPhan?.ten} - {rec.khoiHpCt?.hocPhan?.soTinChi}TC
					</>
				) : null,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 90,
			hide: record?.trangThai !== ETrangThaiCtdt.RA_SOAT,
			render: (val, rec) =>
				rec._id ? (
					<>
						<Popconfirm
							title='Xác nhận hủy bỏ thao tác này?'
							placement='topRight'
							onConfirm={() => deleteModel(rec._id, getDataSoSanh)}
						>
							<ButtonExtend icon={<RollbackOutlined />} tooltip='Hoàn tác' type='link' />
						</Popconfirm>
					</>
				) : (
					<>
						<ButtonExtend
							icon={<RetweetOutlined />}
							tooltip='Chuyển đổi tương đương'
							type='link'
							onClick={() => {
								setSelectedMas([(rec.index - 1).toString()]);
								setVisibleKhoi(true);
							}}
						/>
						<ButtonExtend
							icon={<DeleteOutlined />}
							tooltip='Xóa khối'
							type='link'
							danger
							onClick={() => {
								setSelectedMas([(rec.index - 1).toString()]);
								setVisibleXoa(true);
							}}
						/>
					</>
				),
		},
	];

	const handlePreview = () => {
		if (record?.ma)
			getAllModel(undefined, { soThuTuKy: 1 }, { maChuongTrinhDaoTao: record.ma }).then(() => setVisibleKhung(true));
	};

	const handleDuyet = () =>
		record?._id &&
		postDuyetChuongTrinhModel(record._id)
			.then(() => {
				if (props.getData) props.getData();
			})
			.catch((er) => console.log(er));

	return (
		<>
			<TableStaticData
				addStt
				data={combineChuongTrinh}
				columns={columns}
				size='small'
				hasTotal
				loading={loading}
				otherProps={{
					pagination: false,
					scroll: { y: 600 },
					rowSelection:
						record?.trangThai === ETrangThaiCtdt.RA_SOAT
							? {
									type: 'checkbox',
									hideSelectAll: true,
									getCheckboxProps: (rec: any) => (rec._id ? { disabled: true } : undefined),
									selectedRowKeys: selectedMas,
									preserveSelectedRowKeys: true,
									onChange: (selectedRowKeys: string[]) => setSelectedMas(selectedRowKeys),
									columnWidth: 40,
							  }
							: undefined,
				}}
			>
				<Space wrap>
					<Popconfirm title='Xác nhận duyệt chỉnh sửa phiên bản chương trình này?' onConfirm={handleDuyet}>
						<ButtonExtend
							icon={<CheckOutlined />}
							type='primary'
							className='btn-success'
							loading={formSubmiting}
							disabled={record?.trangThai !== ETrangThaiCtdt.RA_SOAT}
						>
							Duyệt chương trình
						</ButtonExtend>
					</Popconfirm>

					<ButtonExtend
						icon={<EyeOutlined />}
						onClick={handlePreview}
						tooltip='Xem trước khung chương trình đã chỉnh sửa'
					>
						Xem trước
					</ButtonExtend>
					<ButtonExtend
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setKhoi(undefined);
							setVisibleKhoi(true);
						}}
						disabled={record?.trangThai !== ETrangThaiCtdt.RA_SOAT}
					>
						Thêm học phần
					</ButtonExtend>
					{selectedMas.length ? (
						<>
							<ButtonExtend
								tooltip={`Chuyển đổi tương đương cho ${selectedMas.length} HP`}
								icon={<RetweetOutlined />}
								onClick={() => setVisibleKhoi(true)}
							>
								Chuyển đổi ({selectedMas.length})
							</ButtonExtend>

							<ButtonExtend
								tooltip={`Xóa ${selectedMas.length} HP`}
								type='link'
								danger
								onClick={() => setVisibleXoa(true)}
							>
								Xóa ({selectedMas.length})
							</ButtonExtend>
						</>
					) : null}
				</Space>
			</TableStaticData>

			<ConfirmChuyenDoiKhoiHocPhan
				onCancel={() => setSelectedMas([])}
				onOk={() => {
					setSelectedMas([]);
					getDataSoSanh();
				}}
				selectedMas={selectedMas}
			/>

			<ConfirmXoaKhoiHocPhan
				visible={visibleXoa}
				onCancel={() => {
					setSelectedMas([]);
					setVisibleXoa(false);
				}}
				onOk={() => {
					setSelectedMas([]);
					setVisibleXoa(false);
					getDataSoSanh();
				}}
				selectedMas={selectedMas}
			/>

			<PreviewKhungCTDT setVisible={setVisibleKhung} visble={visibleKhung} />
		</>
	);
};

export default TableSoSanhHocPhan;
