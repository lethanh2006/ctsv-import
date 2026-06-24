import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiLogDiem,
	ELoaiLopHocPhan,
	ETrangThaiDuyetDiem,
	ETrangThaiLopHocPhan,
	tooltipDuyetDiem,
	trangThaiDuyetDiem,
} from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import {
	CheckCircleOutlined,
	DiffOutlined,
	EditOutlined,
	ExportOutlined,
	ImportOutlined,
	PrinterOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Card, Dropdown, Empty, Form, InputNumber, Menu, Modal, Popconfirm, Segmented, Space, message } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import ViewDiemLopHocPhan from '../../DiemLopHocPhan/components/ViewDiemLopHocPhan';
import ModalLichSuNhapDiem from '../../LichSuNhapDiem';
import TitlePrintKTHP from './TitlePrintKTHP';

const CardDiemKTHP = (getData: () => void) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const {
		getAllService: getAllLopHP,
		loading: loadLop,
		setLoading: setLoadLop,
	} = useModel('daotaov2.hocky.lophocphan');
	const { duyetDiemKTHocPhanModel, getAllModel, danhSach, putDiemThiModel, loading, setLoading } = useModel(
		'daotaov2.hocky.sinhvienlophocphan',
	);
	const [editDiem, setEditDiem] = useState<number>(-1);
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const [diemLopHocPhanId, setDiemLopHocPhanId] = useState<string>();
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
	const [trangThaiDuyet, setTrangThaiDuyet] = useState<ETrangThaiDuyetDiem>(ETrangThaiDuyetDiem.CHUA_DUYET);
	const componentRef = useRef(null);
	const [form] = Form.useForm();
	const tongTrongSoTP = _.sumBy(
		_.range(1, 11),
		(field) => +(recHocPhan?.deCuong?.[`trongSo${field}` as keyof HocPhan.IDeCuongHocPhan] ?? 0),
	);
	const titlesDiem = ['Thi lần 1', 'Thẩm định', 'Phúc khảo', 'Thi lần 2'];
	const fieldsDiem: (keyof LopHocPhan.IRecordSinhVienLopHP)[] = [
		'diemThi1',
		'diemThamDinh',
		'diemPhucKhao',
		'diemThi2',
	];
	const dataHienThi = danhSach.filter(
		(item) =>
			(trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET && !item.trangThaiDuyet) ||
			item.trangThaiDuyet === trangThaiDuyet,
	);

	const getDataInternal = () => {
		setEditDiem(-1);
		if (recHocPhan?.maHocPhan && recHocKy?.ma) {
			setLoadLop(true);
			getAllLopHP({
				condition: {
					maHocPhan: recHocPhan.maHocPhan,
					maHocKy: recHocKy?.ma,
					loai: ELoaiLopHocPhan.CHINH,
					trangThaiLop: ETrangThaiLopHocPhan.MO,
				},
			})
				.then((res) =>
					getAllModel(
						false,
						undefined,
						undefined,
						[
							{
								active: true,
								field: 'lopHocPhanId',
								values: res.data?.data?.map((item: LopHocPhan.IRecord) => item._id),
								operator: EOperatorType.INCLUDE,
							},
						],
						undefined,
						undefined,
						[
							'diemThi1',
							'diemThi2',
							'_id',
							'diemThamDinh',
							'diemPhucKhao',
							'sinhVien.ten',
							'sinhVien.ma',
							'lopHocPhan.ten',
							'trangThaiDuyet',
						],
					),
				)
				.finally(() => {
					setLoadLop(false);
				});
		}
	};

	useEffect(() => {
		getDataInternal();
	}, [recHocPhan?.maHocPhan, recHocKy?.ma]);

	const handlePrint = useReactToPrint({ contentRef: componentRef });

	const onDuyetDiemHP = () => {
		if (trangThaiDuyet === ETrangThaiDuyetDiem.QUAN_LY_DUYET) return;
		const hasDiem = danhSach?.some((i) => i.diemThi1 !== null);
		if (!hasDiem) {
			message.warning('Chưa nhập điểm cho sinh viên');
			return;
		}
		Modal.confirm({
			title: 'Xác nhận duyệt điểm',
			width: 600,
			content: (
				<>
					Xác nhận duyệt điểm kết thúc học phần?
					<br />
					Lưu ý: Sau khi duyệt điểm, chuyên viên sẽ không được chỉnh sửa điểm của sinh viên
				</>
			),
			okText: 'Xác nhận',
			onOk: () =>
				duyetDiemKTHocPhanModel(
					trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET ? 'chuyen-vien' : 'quan-ly',
					recHocPhan?.maHocPhan ?? '',
					recHocKy?.ma ?? '',
				)
					.then(() => {
						getDataInternal();
						getData();
						setTrangThaiDuyet(
							trangThaiDuyet === ETrangThaiDuyetDiem.CHUA_DUYET
								? ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET
								: ETrangThaiDuyetDiem.QUAN_LY_DUYET,
						);
					})
					.catch((er) => console.log(er)),
		});
	};

	const handleEdit = (index: number) => {
		setEditDiem(index);
		const loaiDiem = fieldsDiem[index];
		form.setFieldsValue({
			data: danhSach.map((item) => ({ diem: item[loaiDiem] })),
		});
	};

	const onFinish = () => {
		setLoading(true);
		const loaiNhapDiem = titlesDiem[editDiem];
		form
			.validateFields()
			.then((values) => {
				const list = values.data?.filter(
					(item: any) => item !== null && item?.diem !== undefined && item?.diem !== null,
				);
				const hasDiem = list?.length > 0;
				if (!hasDiem) {
					message.warning('Chưa nhập điểm cho sinh viên');
					return;
				}

				putDiemThiModel({ list, loaiNhapDiem })
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
			filterType: editDiem < 0 ? 'string' : undefined,
			render: (val, rec) => (
				<>
					{val}
					<Form.Item name={['data', rec.index - 1, 'lopHpSvId']} initialValue={rec._id} hidden />
				</>
			),
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: ['sinhVien', 'ten'],
			width: 150,
			filterType: editDiem < 0 ? 'string' : undefined,
			onCell,
		},
		{
			title: 'Mã lớp',
			dataIndex: ['lopHocPhan', 'ten'],
			width: 150,
			filterType: editDiem < 0 ? 'string' : undefined,
			onCell,
		},

		// {
		// 	title: 'Điểm cuối',
		// 	dataIndex: 'diemKthp',
		// 	width: 80,
		// 	align: 'center',
		// 	sortable: true,
		// 	onCell,
		// 	hide: tongTrongSoTP >= 100,
		// },
		// {
		// 	title: 'Điểm tổng kết học phần',
		// 	width: 240,
		// 	children: [
		// 		{
		// 			title: 'Điểm thang 10',
		// 			width: 80,
		// 			dataIndex: 'diemTongKet',
		// 			align: 'center',
		// 			sortable: true,
		// 			onCell,
		// 		},
		// 		{
		// 			title: 'Điểm thang 4',
		// 			width: 80,
		// 			dataIndex: 'diemThang4',
		// 			align: 'center',
		// 			sortable: true,
		// 			onCell,
		// 		},
		// 		{
		// 			title: 'Điểm chữ',
		// 			width: 80,
		// 			dataIndex: 'diemChu',
		// 			align: 'center',
		// 			filterType: 'select',
		// 			filterData: Object.values(ELoaiDiemChu),
		// 			onCell,
		// 		},
		// 	],
		// },
		// {
		//   title: 'Thao tác',
		//   align: 'center',
		//   width: 70,
		//   fixed: 'right',
		//   render: (rec: LopHocPhan.IRecordSinhVienLopHP) => (
		//     <>
		//       {rec.khoa ? (
		//         <Tooltip title="Mở khóa">
		//           <Button
		//             type="link"
		//             icon={<UnlockOutlined />}
		//             onClick={() => onLock(rec._id, false)}
		//           />
		//         </Tooltip>
		//       ) : (
		//         <Tooltip title="Duyệt điểm">
		//           <Popconfirm
		//             title="Xác nhận duyệt điểm của sinh viên này?"
		//             placement="topRight"
		//             onConfirm={() => onLock(rec._id, true)}
		//           >
		//             <Button type="link" icon={<LockOutlined />} />
		//           </Popconfirm>
		//         </Tooltip>
		//       )}
		//     </>
		//   ),
		// },
	];

	const col: IColumn<LopHocPhan.IRecordSinhVienLopHP & { index: number }> = {
		title: 'Điểm thi kết thúc học phần',
		width: titlesDiem.length * 80,
		children: [],
	};
	titlesDiem.forEach((title, index) => {
		col.children?.push({
			title,
			width: 80,
			align: 'center',
			dataIndex: fieldsDiem[index],
			sortable: editDiem < 0,
			render: (val, rec) =>
				editDiem === index ? (
					<Form.Item name={['data', rec.index - 1, 'diem']} style={{ margin: 0 }} rules={[...rules.float(10, 0, 1)]}>
						<InputNumber style={{ width: '100%' }} min={0} max={10} />
					</Form.Item>
				) : (
					val
				),
			onCell: editDiem >= 0 ? undefined : onCell,
		});
	});
	if (tongTrongSoTP < 100) columns.splice(3, 0, col);

	return (
		<>
			<Card
				title={'Danh sách sinh viên'}
				styles={{ body: { padding: '8px 0 0' }, header: { padding: 0 } }}
				variant='borderless'
			>
				{recHocPhan?._id ? (
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
							hasTotal
							otherProps={{ pagination: false, scroll: { y: 600 } }}
							size='small'
							loading={loading || loadLop}
						>
							<Space wrap>
								{editDiem >= 0 ? (
									<>
										<Popconfirm onConfirm={onFinish} title='Xác nhận lưu điểm đã nhập?'>
											<ButtonExtend icon={<SaveOutlined />} type='primary' notHideText>
												Lưu lại
											</ButtonExtend>
										</Popconfirm>
										<ButtonExtend onClick={() => setEditDiem(-1)} danger notHideText>
											Hủy
										</ButtonExtend>
									</>
								) : tongTrongSoTP < 100 ? (
									<>
										<Dropdown
											overlay={
												<Menu
													items={titlesDiem.map((item, index) => ({
														label: `Nhập điểm ${item}`,
														key: item,
														onClick: () => handleEdit(index),
													}))}
												/>
											}
											disabled={!dataHienThi.length}
										>
											<ButtonExtend icon={<EditOutlined />} type='primary' disabled={!dataHienThi.length} notHideText>
												Nhập điểm
											</ButtonExtend>
										</Dropdown>
										<ButtonExtend
											icon={<ImportOutlined />}
											disabled={!danhSach.length}
											onClick={() => setVisibleImport(true)}
										>
											Nhập dữ liệu
										</ButtonExtend>
									</>
								) : null}

								<ButtonExtend
									icon={<CheckCircleOutlined />}
									onClick={onDuyetDiemHP}
									disabled={
										editDiem > 0 ||
										!dataHienThi.length ||
										// recHocPhan.trangThaiDiem !== ETrangThaiDeCuongHPHK.CHUA_DUYET ||
										trangThaiDuyet === ETrangThaiDuyetDiem.QUAN_LY_DUYET
									}
									className='btn-success'
									tooltip={tooltipDuyetDiem[trangThaiDuyet]}
								>
									Duyệt điểm
								</ButtonExtend>
								<ButtonExtend
									icon={<PrinterOutlined />}
									disabled={!danhSach.length || editDiem >= 0}
									tooltip='In bảng điểm'
									onClick={() => handlePrint()}
								/>
								<ButtonExtend
									icon={<ExportOutlined />}
									disabled={editDiem > 0 || !danhSach.length}
									onClick={() => message.warning('Đang phát triển...')}
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
					<Empty description='Vui lòng chọn học phần' />
				)}
			</Card>

			{diemLopHocPhanId ? (
				<ViewDiemLopHocPhan
					visible={visibleChiTietDiem}
					setVisible={setVisibleChiTietDiem}
					sinhVienLopHocPhanId={diemLopHocPhanId}
				/>
			) : null}

			<ModalImport
				modelName='daotaov2.ketquahoctap.importdiemaq'
				visible={visibleImport}
				onOk={() => getDataInternal()}
				onCancel={() => setVisibleImport(false)}
				extendData={{ maHocKy: recHocKy?.ma ?? '' }}
				titleTemplate={`Biểu mẫu nhập điểm kết thúc HP ${recHocPhan?.maHocPhan ?? ''}.xlsx`}
			/>

			<ModalLichSuNhapDiem
				visible={visibleHistory}
				setVisible={setVisibleHistory}
				maHocPhan={recHocPhan?.maHocPhan}
				loaiLogDiems={[ELoaiLogDiem.KTHP, ELoaiLogDiem.DUYET_KTHP]}
			/>

			<PrintTemplate ref={componentRef}>
				<TitlePrintKTHP />
				<div className='to-print'>
					<TableStaticData
						columns={columns}
						data={danhSach}
						size='small'
						addStt
						otherProps={{ pagination: false, scroll: undefined }}
					/>
				</div>
			</PrintTemplate>
		</>
	);
};

export default CardDiemKTHP;
