import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { EValidateKetQuaHocTap, validateKetQuaHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCauHinhHocVu from './Form';

const CauHinhHocVuPage = (props: { isThoiHoc?: boolean }) => {
	const { isThoiHoc } = props;
	const intl = useIntl();
	const { record, formSubmiting, putModel, getByIdModel, setVisibleForm, getModel } = useModel('daotaov2.hocky.hocky');
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');

	const [viewXuLy, setViewXuLy] = useState<boolean>(false);
	const [editXuLy, setEditXuLy] = useState<boolean>(false);
	const [recordCanhBao, setRecordCanhBao] = useState<HocKy.TValidateKetQuaHocTap>();
	const [danhSachCanhBao, setDanhSachCanhBao] = useState<HocKy.TValidateKetQuaHocTap[]>();

	const getData = () => (getByIdModel(record?._id ?? ''), getModel({ namHocId: recNamHoc?._id }));

	const deleteCauHinh = (rec: HocKy.TValidateKetQuaHocTap) => {
		const validateCanhBao = record?.validateCanhBao?.filter((item) => item.functionValidate !== rec?.functionValidate);

		const validateBuocThoiHoc = record?.validateBuocThoiHoc?.filter(
			(item) => item.functionValidate !== rec?.functionValidate,
		);

		putModel(record?._id ?? '', isThoiHoc ? { validateBuocThoiHoc } : { validateCanhBao }, getData, undefined, false)
			.then()
			.catch((er) => console.log(er));
	};

	const columns: IColumn<HocKy.TValidateKetQuaHocTap>[] = [
		{
			title: 'Nội dung',
			width: 120,
			render: (val, rec) => validateKetQuaHocTap[rec?.functionValidate],
		},
		{
			title: 'Thông số',
			width: 180,
			render: (val, rec) => {
				switch (rec?.functionValidate) {
					case EValidateKetQuaHocTap.TONG_SO_TIN_CHI_KHONG_DAT:
						return (
							<>
								Không quá: <b>{Math.round((rec.thamSo?.phanTramTinChiKhongDat ?? 0) * 100)} %</b>
							</>
						);
					case EValidateKetQuaHocTap.TONG_SO_TIN_CHI_NO_TOAN_KHOA:
						return (
							<>
								Vượt quá: <b>{rec.thamSo?.soTinChiNo}</b> tín
							</>
						);
					case EValidateKetQuaHocTap.DIEM_TRUNG_BINH_HOC_KY:
						return (
							<>
								Học kỳ đầu dưới: <b>{rec.thamSo?.diemTbHocKy1}</b> điểm <br />
								Học kỳ tiếp theo dưới: <b>{rec.thamSo?.diemTbHocKyKhacKy1}</b> điểm
							</>
						);
					case EValidateKetQuaHocTap.DIEM_TRUNG_BINH_TICH_LUY:
						return (
							<>
								Sinh viên năm nhất dưới: <b>{rec.thamSo?.diemTrungBinhTichLuyNam1}</b> điểm <br />
								Sinh viên năm hai dưới: <b>{rec.thamSo?.diemTrungBinhTichLuyNam2}</b> điểm <br />
								Sinh viên năm ba dưới: <b>{rec.thamSo?.diemTrungBinhTichLuyNam3}</b> điểm <br />
								Sinh viên các năm tiếp theo dưới: <b>{rec.thamSo?.diemTrungBinhTichLuyNamTiepTheo}</b> điểm
							</>
						);
					case EValidateKetQuaHocTap.SO_LAN_CANH_BAO:
						return (
							<>
								Vượt quá: <b>{rec.thamSo?.soLan}</b> lần
							</>
						);
					case EValidateKetQuaHocTap.CANH_BAO_LIEN_TIEP:
						return (
							<>
								Số lần: <b>{rec.thamSo?.soLanCanhBaoLienTiep}</b> lần
							</>
						);
					case EValidateKetQuaHocTap.KY_LUAT:
						<>
							Số lần: <b>{rec.thamSo?.soLan}</b> lần
						</>;
					case EValidateKetQuaHocTap.KHONG_HOAN_THANH_HOC_PHI:
						return (
							<>
								Số lần: <b>{rec.thamSo?.soLan}</b> lần
							</>
						);
					default:
						return null;
				}
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						onClick={() => (setRecordCanhBao(rec), setViewXuLy(true), setEditXuLy(true))}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteCauHinh(rec)}
						title='Bạn có chắc chắn muốn xóa cấu hình này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<div style={{ marginBottom: 12 }}>
				Sinh viên sẽ bị xem xét &quot;
				<span className='fw500 text-error'>{isThoiHoc ? 'Cho thôi học' : 'Cảnh báo học tập'}</span>&quot; nếu thuộc một
				trong các trường hợp sau
			</div>

			<ButtonExtend
				onClick={() => (
					setRecordCanhBao(undefined),
					setEditXuLy(false),
					setDanhSachCanhBao(isThoiHoc ? record?.validateBuocThoiHoc : record?.validateCanhBao),
					setViewXuLy(true)
				)}
				icon={<PlusCircleOutlined />}
				type='primary'
				notHideText
				tooltip='Thêm mới dữ liệu'
			>
				Thêm mới
			</ButtonExtend>

			<TableStaticData
				columns={columns}
				data={isThoiHoc ? (record?.validateBuocThoiHoc ?? []) : (record?.validateCanhBao ?? [])}
				loading={formSubmiting}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>

			<Modal
				title={`${editXuLy ? 'Chỉnh sửa' : 'Thêm mới'} cấu hình ${
					isThoiHoc
						? intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.thongtincauhinh.tab3' }).toLocaleLowerCase()
						: intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.thongtincauhinh.tab2' }).toLocaleLowerCase()
				}`}
				open={viewXuLy}
				onCancel={() => setViewXuLy(false)}
				footer={null}
				width={600}
				destroyOnClose
			>
				<FormCauHinhHocVu
					edit={editXuLy}
					recordCanhBao={recordCanhBao}
					danhSachCanhBao={danhSachCanhBao}
					setVisible={setViewXuLy}
					isThoiHoc={isThoiHoc}
				/>
			</Modal>
		</>
	);
};

export default CauHinhHocVuPage;
