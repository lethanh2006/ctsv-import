import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import {
	ELoaiBoLoc,
	arrSpecialColumn,
	arrSpecialDataIndex,
	type ELoaiCheDoSinhVien,
} from '@/services/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Modal, Popconfirm, Select, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ViewRender from '../QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/ViewRender';
import { buildFilter } from './components/BuildFilter';
import FormGiaoNopSanPham from './components/FormGiaoNopSanPham';
import FormImport from './components/FormImport';
import SelectCheDoChinhSach from './components/SelectCheDoChinhSach';
import ViewQuyetDinh from './components/ViewQuyetDinh';

const QuyetDinh = (props: {
	title: string;
	loaiCheDoSinhVien: ELoaiCheDoSinhVien;
	ssoId?: string;
	filterWidth?: number;
}) => {
	const intl = useIntl();
	const {
		handleEdit,
		deleteModel,
		setVisibleView,
		visibleView,
		setRecord: setRecordQuyetDinh,
		getModel,
		page,
		limit,
		setDanhSach,
		filters,
		setFilters,
		exportCheDoSinhVienModel,
	} = useModel('chedochinhsach.quyetdinhchedosinhvien');
	const { danhSach, getAllModel: getAllDanhMuc } = useModel('quytrinh.danhmuc');
	const {
		record: recordCheDoChinhSach,
		loading,
		getTemplateImportCheDoSinhVienModel,
		visibleImport,
		setVisibleImport,
		setRecord: setRecordCheDoChinhSach,
		danhSach: danhSachCheDoChinhSach,
	} = useModel('chedochinhsach.chedochinhsach');

	const getData = () => {
		if (recordCheDoChinhSach?._id) {
			getModel({ cheDoSinhVienId: recordCheDoChinhSach?._id, ssoId: props?.ssoId });
		} else setDanhSach([]);
	};

	const onCancelView = () => {
		setVisibleView(false);
	};

	const onCell = (record: CheDoSinhVien.QuyetDinhCheDoSinhVien) => ({
		onClick: () => {
			setVisibleView(true);
			setRecordQuyetDinh(record);
		},
		style: { cursor: 'pointer' },
	});

	useEffect(() => {
		getAllDanhMuc(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	}, []);

	const columns: IColumn<CheDoSinhVien.QuyetDinhCheDoSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.hovaten' }),
			dataIndex: 'hoVaTen',
			width: 150,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.masv' }),
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.lop' }),
			dataIndex: 'lop.ten',
			width: 100,
			align: 'center',
			filterType: 'string',
			onCell,
			render: (val, rec) => rec?.lop?.ten,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.nganh' }),
			dataIndex: 'nganh.ten',
			width: 200,
			align: 'center',
			onCell,
			filterType: 'string',
			render: (val, rec) => rec?.nganh?.ten,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			render: (val) => (val ? dayjs(val).format('DD/MM/YYYY') : ''),
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.gioitinh' }),
			dataIndex: 'gioiTinh',
			width: 100,
			align: 'center',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.column.dantoc' }),
			dataIndex: 'danToc',
			width: 100,
			align: 'center',
			onCell,
			filterType: 'string',
			hide: props.ssoId ? true : false,
		},
	];

	recordCheDoChinhSach?.danhSachCauHinhThongTin?.map((item) => {
		if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
		if (
			arrSpecialColumn.includes(item.ten) &&
			columns.map((ele) => ele.title).includes(intl.formatMessage({ id: 'kyluatkhenthuong.column.doituongmiengiam' }))
		)
			return;
		if (arrSpecialColumn.includes(item.ten)) {
			columns.push({
				title: intl.formatMessage({ id: 'kyluatkhenthuong.column.doituongmiengiam' }),
				// dataIndex: `thongTinQuyetDinh.${item.ma}.value`,
				width: 200,
				// align: 'center',
				// specialFilter: true,
				onCell,
				render: (val, rec) => (
					<div>{arrSpecialDataIndex?.map((ele) => rec?.thongTinQuyetDinh?.[ele]?.value)?.filter((ele) => ele)}</div>
				),
				// filterType: 'string',
			});
		} else
			columns.push({
				title: item.ten,
				dataIndex: ['thongTinQuyetDinh', item.ma, 'value'],
				width: 200,
				align: 'center',
				specialFilter: true,
				onCell,
				render: (val, rec) => <ViewRender cauHinh={item} recordSanPham={{ thongTinKhaiBao: rec.thongTinQuyetDinh }} />,
				...buildFilter(item, danhSach),
			});
	});

	columns.push({
		title: intl.formatMessage({ id: 'kyluatkhenthuong.column.thaotac' }),
		align: 'center',
		width: 120,
		fixed: 'right',
		render: (record: CheDoSinhVien.QuyetDinhCheDoSinhVien) => {
			return (
				<>
					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.column.edit' })}>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.column.delete' })}>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title={intl.formatMessage({ id: 'kyluatkhenthuong.column.confirm.delete' })}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			);
		},
	});

	const Form = useCallback(
		() => <FormGiaoNopSanPham ssoId={props.ssoId} getData={getData} />,
		[recordCheDoChinhSach?._id, props.ssoId, props.loaiCheDoSinhVien],
	);

	return (
		<>
			<TableBase
				hideCard={props.ssoId ? true : false}
				buttons={{ create: recordCheDoChinhSach?._id ? true : false }}
				otherButtons={[
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={() => getTemplateImportCheDoSinhVienModel(recordCheDoChinhSach?._id ?? '')}>
										{intl.formatMessage({ id: 'kyluatkhenthuong.button.downloadtemplate' })}
									</Menu.Item>
									<Menu.Item onClick={() => setVisibleImport(true)}>
										{intl.formatMessage({ id: 'kyluatkhenthuong.button.import' })}
									</Menu.Item>
								</Menu>
							}
						>
							<ButtonExtend loading={loading} icon={<ImportOutlined />}>
								{intl.formatMessage({ id: 'kyluatkhenthuong.button.import' })}
							</ButtonExtend>
						</Dropdown>
						<ButtonExtend
							onClick={() => exportCheDoSinhVienModel(props.title, recordCheDoChinhSach?._id ?? '')}
							loading={loading}
							icon={<ExportOutlined />}
						>
							{intl.formatMessage({ id: 'kyluatkhenthuong.button.export' })}
						</ButtonExtend>
						{recordCheDoChinhSach?.danhSachBoLoc?.map((item) => (
							<>
								{item.loai === ELoaiBoLoc.GIA_TRI ? (
									<Input.Search placeholder={item.ten} />
								) : (
									<Select
										mode='multiple'
										onChange={(val) => {
											if (!val?.length) {
												setFilters(filters?.filter((ft) => ft.field !== item.path) ?? []);
											} else
												setFilters([
													...(filters?.filter((ft) => ft.field !== item.path) ?? []),
													{ field: item.path, active: true, values: val, operator: EOperatorType.INCLUDE },
												] as any);
										}}
										style={{ width: 250 }}
										allowClear
										placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.filter.placeholder' }, { ten: item.ten })}
										options={
											item.loai === ELoaiBoLoc.MANG
												? item.danhSachGiaTri.map((gt) => ({ value: gt, label: gt }))
												: danhSach
														.find((dm) => dm.maDanhMuc === item.maDanhMuc && dm.maModule === item.maModule)
														?.danhSachGiaTri.map((gt) => ({ value: gt?.value, label: gt?.value }))
										}
									/>
								)}
							</>
						))}
						<SelectCheDoChinhSach
							onChange={(val) => {
								setRecordCheDoChinhSach(danhSachCheDoChinhSach.find((item) => item._id === val));
							}}
							style={{ width: props?.filterWidth ?? 400 }}
							isSetRecord
							value={recordCheDoChinhSach?._id}
							condition={{ loaiCheDoSinhVien: props.loaiCheDoSinhVien }}
							key='filter'
						/>
					</>,
				]}
				getData={getData}
				widthDrawer={800}
				Form={Form}
				dependencies={[page, limit, recordCheDoChinhSach?._id, props.loaiCheDoSinhVien]}
				title={props.title || intl.formatMessage({ id: 'kyluatkhenthuong.title' })}
				modelName={'chedochinhsach.quyetdinhchedosinhvien'}
				columns={columns}
			/>
			<Modal
				destroyOnClose
				width={900}
				title={intl.formatMessage({ id: 'kyluatkhenthuong.modal.chitiet' })}
				footer={null}
				open={visibleView}
				onCancel={onCancelView}
			>
				<ViewQuyetDinh />
			</Modal>
			<Modal
				onCancel={() => setVisibleImport(false)}
				footer={null}
				open={visibleImport}
				title={intl.formatMessage({ id: 'kyluatkhenthuong.modal.import' })}
			>
				<FormImport getData={getData} />
			</Modal>
		</>
	);
};

export default QuyetDinh;
