import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { exportBangDiemLopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiLogDiem,
	ELoaiLopHocPhan,
	ETrangThaiDiemLop,
	ETrangThaiDuyetDiem,
	ETrangThaiLopHocPhan,
	ETrangThaiThi,
	tooltipDuyetDiem,
	trangThaiDuyetDiem,
} from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import {
	CheckCircleOutlined,
	CloseOutlined,
	DiffOutlined,
	EditOutlined,
	ExportOutlined,
	ImportOutlined,
	PrinterOutlined,
	SaveOutlined,
	UnlockOutlined,
} from '@ant-design/icons';
import { Card, Checkbox, Empty, Form, InputNumber, Modal, Popconfirm, Segmented, Space, message } from 'antd';
import fileDownload from 'js-file-download';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import ViewDiemLopHocPhan from '../../DiemLopHocPhan/components/ViewDiemLopHocPhan';
import ModalLichSuNhapDiem from '../../LichSuNhapDiem';
import TitlePrintDiemThanhPhan from './TitlePrintDiemThanhPhan';

const CardDiemThanhPhan = (getData: () => void) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { record: recordLopHP, getThongKeTrangThaiDiemLopModel } = useModel('daotaov2.hocky.lophocphan');
	const {
		duyetDiemLopHocPhanModel,
		huyDuyetDiemLopHocPhanModel,
		getAllModel,
		danhSach,
		putDiemLopHocPhanModel,
		loading,
		setLoading,
		formSubmiting,
	} = useModel('daotaov2.hocky.sinhvienlophocphan');
	const { getModel: getDauDiem, danhSach: danhSachDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const { getImportTemplateModel } = useModel('daotaov2.ketquahoctap.importdiemthanhphan');
	const [editDiem, setEditDiem] = useState<boolean>();
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const [diemLopHocPhanId, setDiemLopHocPhanId] = useState<string>();
	const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [trangThaiDuyet, setTrangThaiDuyet] = useState<ETrangThaiDuyetDiem>(ETrangThaiDuyetDiem.CHUA_DUYET);
	const componentRef = useRef(null);
	const [form] = Form.useForm();

	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) => recordLopHP?.deCuong?.deCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan],
	);
	const dataHienThi = danhSach.filter(
		(item) =>
			(trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET && !item.trangThaiDuyetDiemThanhPhan) ||
			item.trangThaiDuyetDiemThanhPhan === trangThaiDuyet,
	);

	const getDataInternal = () => {
		setEditDiem(false);
		if (recordLopHP?._id) getAllModel(false, undefined, { lopHocPhanId: recordLopHP?._id });
	};

	useEffect(() => {
		getDataInternal();
	}, [recordLopHP?._id]);

	useEffect(() => {
		getDauDiem(); // Max 10 đầu điểm
	}, []);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => <ButtonExtend disabled={!danhSach.length || editDiem} icon={<PrinterOutlined />} tooltip='In bảng điểm' />,
		[danhSach.length, editDiem],
	);

	const onDuyetDiem = () => {
		if (trangThaiDuyet === ETrangThaiDuyetDiem.QUAN_LY_DUYET) return;
		const hasDiem = danhSach?.some((i) =>
			dauDiemCoTrongSo.some(
				(dauDiem) => i?.[`diemThanhPhan${dauDiem.field}` as keyof LopHocPhan.IRecordSinhVienLopHP] !== null,
			),
		);
		if (!hasDiem) {
			message.warning('Chưa nhập điểm cho sinh viên');
			return;
		}
		Modal.confirm({
			title: 'Xác nhận duyệt điểm học phần',
			width: 600,
			content: (
				<>
					Xác nhận duyệt điểm thành phần lớp <b>{recordLopHP?.ten}</b>
					<br />
					Lưu ý: Sau khi duyệt điểm, giảng viên sẽ không được chỉnh sửa điểm của sinh viên
				</>
			),
			okText: 'Xác nhận',
			onOk: () =>
				duyetDiemLopHocPhanModel(
					trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET ? 'chuyen-vien' : 'quan-ly',
					recordLopHP?._id ?? '',
				)
					.then(() => {
						getData();
						getThongKeTrangThaiDiemLopModel({
							loai: ELoaiLopHocPhan.CHINH,
							maHocKy: recHocKy?.ma,
							maHocPhan: recHocPhan?.ma,
							trangThaiLop: ETrangThaiLopHocPhan.MO,
						}); // Get lại số liệu thống kê
						setTrangThaiDuyet(
							trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET
								? ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET
								: ETrangThaiDuyetDiem.QUAN_LY_DUYET,
						);
					})
					.catch((er) => console.log(er)),
		});
	};

	const onHuyDuyet = (): void => {
		Modal.confirm({
			title: 'Xác nhận hủy trạng thái nộp điểm học phần',
			width: 600,
			content: (
				<>
					Xác nhận hủy trạng thái nộp điểm thành phần lớp <b>{recordLopHP?.ten}</b>
					<br />
					Lưu ý: Sau khi hủy, giảng viên có thể nhập điểm và nộp điểm trở lại
				</>
			),
			okText: 'Xác nhận',
			onOk: () =>
				huyDuyetDiemLopHocPhanModel(recordLopHP?._id ?? '')
					.then(() => {
						getDataInternal();
						getData();
						getThongKeTrangThaiDiemLopModel({
							loai: ELoaiLopHocPhan.CHINH,
							maHocKy: recHocKy?.ma,
							maHocPhan: recHocPhan?.ma,
							trangThaiLop: ETrangThaiLopHocPhan.MO,
						}); // Get lại số liệu thống kê
					})
					.catch((er) => console.log(er)),
		});
	};

	const onExportBangDiem = (): void => {
		if (recordLopHP?._id)
			exportBangDiemLopHocPhan(recordLopHP._id).then((res) =>
				fileDownload(res.data, `Danh sách điểm lớp ${recordLopHP.ten}.xlsx`),
			);
	};

	const handleEdit = () => {
		setEditDiem(true);
		form.setFieldsValue({
			data: danhSach.map((item) => ({ ...item, camThi: item.trangThaiThi === ETrangThaiThi.CAM_THI })),
		});
	};

	const onFinish = () => {
		setLoading(true);
		form
			.validateFields()
			.then((values) => {
				const hasDiem =
					Array.isArray(values.data) &&
					values.data?.some(
						(i: LopHocPhan.IDiemThanhPhan) =>
							i && Object.entries(i).some(([title, diem]) => title.includes('diemThanhPhan') && diem !== null),
					);
				if (!hasDiem) {
					message.warning('Chưa nhập điểm cho sinh viên');
					return;
				}
				const list = values.data
					?.filter((item: any) => !!item) // Lọc khác null
					?.map(({ camThi, lopHpSvId, ...item }: any) => ({
						lopHpSvId,
						update: {
							...item,
							trangThaiThi: camThi ? ETrangThaiThi.CAM_THI : ETrangThaiThi.DU_DIEU_KIEN,
						},
					}));

				putDiemLopHocPhanModel({ list })
					.then(() => getDataInternal())
					.catch((er) => console.log(er));
			})
			.catch((er) => {
				console.log(er);
				message.error('Có lỗi xảy ra');
			})
			.finally(() => setLoading(false));
	};

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setDiemLopHocPhanId(rec._id);
			setVisibleChiTietDiem(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP & { index: number }>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: ['sinhVien', 'ma'],
			align: 'center',
			width: 100,
			filterType: !editDiem ? 'string' : undefined,
			render: (val, rec) => (
				<>
					{val}
					<Form.Item name={['data', rec.index - 1, 'lopHpSvId']} hidden initialValue={rec._id} />
				</>
			),
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: ['sinhVien', 'ten'],
			width: 150,
			filterType: !editDiem ? 'string' : undefined,
			onCell,
		},
		{
			title: 'Cấm thi',
			dataIndex: 'trangThaiThi',
			align: 'center',
			width: 80,
			filterType: !editDiem ? 'select' : undefined,
			filterData: Object.values(ETrangThaiThi),
			render: (val, rec) =>
				editDiem ? (
					<Form.Item name={['data', rec.index - 1, 'camThi']} style={{ margin: 0 }} valuePropName='checked'>
						<Checkbox />
					</Form.Item>
				) : val === ETrangThaiThi.CAM_THI ? (
					<CloseOutlined style={{ color: 'red' }} />
				) : null,
			onCell: editDiem ? undefined : onCell,
		},
	];

	const cols: IColumn<any>[] = dauDiemCoTrongSo.map((item) => ({
		title: `${item.ten} (${recordLopHP?.deCuong?.deCuong?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan]}%)`,
		width: 80,
		dataIndex: `diemThanhPhan${item.field}`,
		align: 'center',
		sortable: !editDiem,
		render: (val, rec) =>
			editDiem ? (
				<Form.Item
					name={['data', rec.index - 1, `diemThanhPhan${item.field}`]}
					style={{ margin: 0 }}
					rules={[...rules.float(10, 0, 1)]}
				>
					<InputNumber style={{ width: '100%' }} min={0} max={10} />
				</Form.Item>
			) : (
				val
			),
		onCell: editDiem ? undefined : onCell,
	}));
	if (cols.length)
		columns.splice(2, 0, {
			title: 'Điểm thành phần',
			width: cols.length * 80,
			children: cols,
		});

	return (
		<>
			<Card
				title={'Danh sách sinh viên'}
				styles={{ padding: '8px 0 0' }}
				headStyle={{ padding: '0' }}
				bordered={false}
			>
				{recordLopHP?._id ? (
					<Form form={form} component={false}>
						<Space style={{ marginBottom: 8 }} wrap>
							<span>Trạng thái duyệt điểm</span>
							<Segmented
								options={Object.values(ETrangThaiDuyetDiem).map((item) => ({
									value: item,
									key: item,
									label: trangThaiDuyetDiem[item],
								}))}
								value={trangThaiDuyet}
								onChange={(val) => setTrangThaiDuyet(val as ETrangThaiDuyetDiem)}
							/>
						</Space>

						<TableStaticData
							columns={columns}
							data={dataHienThi}
							addStt
							otherProps={{ pagination: false, scroll: { y: 600 } }}
							size='small'
							loading={loading}
							hasTotal
						>
							<Space wrap>
								{editDiem ? (
									<>
										<Popconfirm onConfirm={onFinish} title='Xác nhận lưu điểm đã nhập?'>
											<ButtonExtend icon={<SaveOutlined />} type='primary' loading={formSubmiting} notHideText>
												Lưu lại
											</ButtonExtend>
										</Popconfirm>
										<ButtonExtend notHideText onClick={() => setEditDiem(false)} danger>
											Hủy
										</ButtonExtend>
									</>
								) : (
									<>
										<ButtonExtend
											icon={<EditOutlined />}
											notHideText
											type='primary'
											onClick={handleEdit}
											disabled={!dataHienThi.length || recordLopHP.trangThaiDiemLop === ETrangThaiDiemLop.DA_DUYET}
										>
											Nhập điểm
										</ButtonExtend>
										<ButtonExtend
											icon={<ImportOutlined />}
											disabled={
												editDiem || !danhSach.length || recordLopHP.trangThaiDiemLop === ETrangThaiDiemLop.DA_DUYET
											}
											onClick={() => setVisibleImport(true)}
										>
											Nhập dữ liệu
										</ButtonExtend>
									</>
								)}

								<ButtonExtend
									icon={<CheckCircleOutlined />}
									onClick={onDuyetDiem}
									loading={formSubmiting}
									disabled={
										editDiem ||
										!dataHienThi.length ||
										// recHocPhan.trangThaiDiem !== ETrangThaiDeCuongHPHK.CHUA_DUYET ||
										trangThaiDuyet === ETrangThaiDuyetDiem.QUAN_LY_DUYET
									}
									className='btn-success'
									tooltip={tooltipDuyetDiem[trangThaiDuyet]}
								>
									Duyệt điểm
								</ButtonExtend>

								{recordLopHP.trangThaiDiemLop !== ETrangThaiDiemLop.CHUA_NOP_DIEM ? (
									<ButtonExtend
										icon={<UnlockOutlined />}
										onClick={onHuyDuyet}
										disabled={editDiem || !danhSach.length}
										loading={formSubmiting}
									>
										Hủy nộp điểm
									</ButtonExtend>
								) : null}

								<ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} removeAfterPrint />
								<ButtonExtend
									icon={<ExportOutlined />}
									disabled={!danhSach.length || editDiem}
									onClick={onExportBangDiem}
									tooltip='Xuất bảng điểm'
								/>
								<ButtonExtend
									icon={<DiffOutlined />}
									disabled={!danhSach.length}
									onClick={() => setVisibleHistory(true)}
									tooltip='Lịch sử thao tác'
								/>
							</Space>
						</TableStaticData>
					</Form>
				) : (
					<Empty description='Vui lòng chọn lớp tín chỉ' />
				)}
			</Card>

			{diemLopHocPhanId ? (
				<ViewDiemLopHocPhan
					visible={visibleChiTietDiem}
					setVisible={setVisibleChiTietDiem}
					sinhVienLopHocPhanId={diemLopHocPhanId}
				/>
			) : null}

			<ModalLichSuNhapDiem
				visible={visibleHistory}
				setVisible={setVisibleHistory}
				lopHocPhanId={recordLopHP?._id}
				loaiLogDiems={[ELoaiLogDiem.TP, ELoaiLogDiem.DUYET_TP]}
			/>

			<ModalImport
				modelName='daotaov2.ketquahoctap.importdiemthanhphan'
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getDataInternal();
					setEditDiem(false);
				}}
				visible={visibleImport}
				extendData={{ lopHocPhanId: recordLopHP?._id ?? '' }}
				getTemplate={() => getImportTemplateModel(recordLopHP?._id ?? '')}
				titleTemplate={`Biểu mẫu nhập điểm thành phần lớp ${recordLopHP?.ten ?? ''}.xlsx`}
			/>

			<PrintTemplate ref={componentRef}>
				<TitlePrintDiemThanhPhan />
				<div className='to-print'>
					<TableStaticData
						columns={columns}
						data={danhSach}
						size='small'
						addStt
						otherProps={{ pagination: false, scroll: false }}
					/>
				</div>
			</PrintTemplate>
		</>
	);
};

export default CardDiemThanhPhan;
