import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { EValidateKetQuaHocTap, validateKetQuaHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { Button, Form, InputNumber, Select } from 'antd';
import { useIntl, useModel } from 'umi';

const FormCauHinhHocVu = (props: {
	edit?: boolean;
	recordCanhBao?: HocKy.TValidateKetQuaHocTap;
	danhSachCanhBao?: HocKy.TValidateKetQuaHocTap[];
	setVisible: (val: boolean) => void;
	isThoiHoc?: boolean;
}) => {
	const { recordCanhBao, setVisible, isThoiHoc, danhSachCanhBao, edit } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, putModel, getByIdModel, formSubmiting, getModel } = useModel('daotaov2.hocky.hocky');
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const functionValidate = Form.useWatch('functionValidate', form);

	const getData = () => (getByIdModel(record?._id ?? ''), getModel({ namHocId: recNamHoc?._id }));

	const onFinish = async (values: HocKy.TValidateKetQuaHocTap) => {
		const data = {
			...recordCanhBao,
			...values,
			thamSo: {
				...values.thamSo,
				phanTramTinChiKhongDat: !isThoiHoc ? (values.thamSo.phanTramTinChiKhongDat ?? 0) / 100 : undefined,
			},
		};

		const validateBuocThoiHoc =
			record?.validateBuocThoiHoc !== null
				? record?.validateBuocThoiHoc?.filter((item) => item.functionValidate !== recordCanhBao?.functionValidate)
				: [];
		validateBuocThoiHoc?.push(data);

		const validateCanhBao =
			record?.validateCanhBao !== null
				? record?.validateCanhBao?.filter((item) => item.functionValidate !== recordCanhBao?.functionValidate)
				: [];
		validateCanhBao?.push(data);

		putModel(record?._id ?? '', !isThoiHoc ? { validateCanhBao } : { validateBuocThoiHoc }, getData, undefined, false)
			.then(() => setVisible(false))
			.catch((er) => console.log(er));
	};

	return (
		<>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{isThoiHoc ? (
					<Form.Item
						initialValue={recordCanhBao?.functionValidate}
						name={'functionValidate'}
						label='Nội dung'
						rules={[...rules.required]}
					>
						<Select
							disabled={edit}
							options={Object.values(EValidateKetQuaHocTap)
								.splice(4, 10)
								.filter((item) => !danhSachCanhBao?.map((items) => items.functionValidate)?.includes(item))
								.map((item) => ({
									key: item,
									value: item,
									label: validateKetQuaHocTap[item],
								}))}
							placeholder='Chọn nội dung'
						/>
					</Form.Item>
				) : (
					<Form.Item
						initialValue={recordCanhBao?.functionValidate}
						name={'functionValidate'}
						label='Nội dung'
						rules={[...rules.required]}
					>
						<Select
							disabled={edit}
							options={Object.values(EValidateKetQuaHocTap)
								.splice(0, 4)
								.filter((item) => !danhSachCanhBao?.map((items) => items.functionValidate)?.includes(item))
								.map((item) => ({
									key: item,
									value: item,
									label: validateKetQuaHocTap[item],
								}))}
							placeholder='Chọn nội dung'
						/>
					</Form.Item>
				)}

				{functionValidate === EValidateKetQuaHocTap.TONG_SO_TIN_CHI_KHONG_DAT ? (
					<Form.Item
						initialValue={Math.round((recordCanhBao?.thamSo?.phanTramTinChiKhongDat ?? 0) * 100)}
						name={['thamSo', 'phanTramTinChiKhongDat']}
						label='Phần trăm số tín chỉ không đạt'
						rules={[...rules.required]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							max={100}
							placeholder='Nhập phần trăm'
							formatter={(value) => `${value}%`}
						/>
					</Form.Item>
				) : functionValidate === EValidateKetQuaHocTap.TONG_SO_TIN_CHI_NO_TOAN_KHOA ? (
					<Form.Item
						initialValue={recordCanhBao?.thamSo?.soTinChiNo}
						name={['thamSo', 'soTinChiNo']}
						label='Số tín chỉ nợ toàn khóa'
						rules={[...rules.required]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số tín chỉ nợ toàn khóa' />
					</Form.Item>
				) : functionValidate === EValidateKetQuaHocTap.DIEM_TRUNG_BINH_HOC_KY ? (
					<>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTbHocKy1}
							name={['thamSo', 'diemTbHocKy1']}
							label='Điểm tối thiểu học kỳ đầu'
							rules={[...rules.required]}
						>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={10}
								step={0.1}
								placeholder='Nhập điểm tối thiểu học kỳ đầu'
							/>
						</Form.Item>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTbHocKyKhacKy1}
							name={['thamSo', 'diemTbHocKyKhacKy1']}
							label='Điểm tối thiểu học kỳ tiếp theo'
							rules={[...rules.required]}
						>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={10}
								step={0.1}
								placeholder='Nhập điểm tối thiểu học kỳ tiếp theo'
							/>
						</Form.Item>
					</>
				) : functionValidate === EValidateKetQuaHocTap.DIEM_TRUNG_BINH_TICH_LUY ? (
					<>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTrungBinhTichLuyNam1}
							name={['thamSo', 'diemTrungBinhTichLuyNam1']}
							label='Điểm trung bình tích lũy SV năm nhất không dưới'
							rules={[...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} min={0} max={10} step={0.1} placeholder='Nhập điểm trung bình' />
						</Form.Item>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTrungBinhTichLuyNam2}
							name={['thamSo', 'diemTrungBinhTichLuyNam2']}
							label='Điểm trung bình tích lũy SV hai nhất không dưới'
							rules={[...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} min={0} max={10} step={0.1} placeholder='Nhập điểm trung bình' />
						</Form.Item>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTrungBinhTichLuyNam3}
							name={['thamSo', 'diemTrungBinhTichLuyNam3']}
							label='Điểm trung bình tích lũy SV ba nhất không dưới'
							rules={[...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} min={0} max={10} step={0.1} placeholder='Nhập điểm trung bình' />
						</Form.Item>
						<Form.Item
							initialValue={recordCanhBao?.thamSo?.diemTrungBinhTichLuyNamTiepTheo}
							name={['thamSo', 'diemTrungBinhTichLuyNamTiepTheo']}
							label='Điểm trung bình tích lũy SV năm tiếp theo không dưới'
							rules={[...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} min={0} max={10} step={0.1} placeholder='Nhập điểm trung bình' />
						</Form.Item>
					</>
				) : functionValidate === EValidateKetQuaHocTap.SO_LAN_CANH_BAO ? (
					<Form.Item
						initialValue={recordCanhBao?.thamSo?.soLan}
						name={['thamSo', 'soLan']}
						label='Số lần cảnh báo'
						rules={[...rules.required]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số lần cảnh báo' />
					</Form.Item>
				) : functionValidate === EValidateKetQuaHocTap.CANH_BAO_LIEN_TIEP ? (
					<Form.Item
						initialValue={recordCanhBao?.thamSo?.soLanCanhBaoLienTiep}
						name={['thamSo', 'soLanCanhBaoLienTiep']}
						label='Số lần cảnh báo liên tiếp'
						rules={[...rules.required]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số lần cảnh báo liên tiếp' />
					</Form.Item>
				) : functionValidate === EValidateKetQuaHocTap.TU_BO_HOC ? (
					<></>
				) : functionValidate === EValidateKetQuaHocTap.KY_LUAT ? (
					<Form.Item
						initialValue={recordCanhBao?.thamSo?.soLan}
						name={['thamSo', 'soLan']}
						label='Số lần kỳ luật'
						rules={[...rules.required]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số lần kỷ luật' />
					</Form.Item>
				) : functionValidate === EValidateKetQuaHocTap.KHONG_HOAN_THANH_HOC_PHI ? (
					<Form.Item
						initialValue={recordCanhBao?.thamSo?.soLan}
						name={['thamSo', 'soLan']}
						label='Số lần nợ học phí'
						rules={[...rules.required]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập số lần nợ học phí' />
					</Form.Item>
				) : null}

				<Form.Item hidden initialValue={true} name={['thamSo', 'isCoVanHocTap']} />
				<Form.Item hidden initialValue={''} name={['thamSo', 'maDonVi']} />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormCauHinhHocVu;
