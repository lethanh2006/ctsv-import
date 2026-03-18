import SelectHocPhanRieng from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhanRieng';
import SelectLopHanhChinhDebounce from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	EHinhThucGiangDay,
	ELoaiLopHocPhan,
	ETenLoaiLopHocPhan,
	hinhThucGiangDay,
} from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLopHocPhan from './Select';
import { deleteLopHpLopHc, postLopHpLopHc } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import { EDoiTuongLopHanhChinh, doiTuongLopHanhChinh } from '@/services/DaoTaoV2/NamHoc/constant';

const FormLopHocPhan = (props: { afterAddNew: (rec: LopHocPhan.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { afterAddNew } = props;
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		setRecord,
		setEdit,
		getAllService,
		visibleForm,
	} = useModel('daotaov2.hocky.lophocphan');
	const {
		record: recLopSelect,
		danhSach: danhSachLopSelect,
		setRecord: setLopSelect,
	} = useModel('daotaov2.hocky.lopthuchanh');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const [maHocPhan, setMaHocPhan] = useState<string>();
	const [thuTu, setThuTu] = useState<number>();
	const [tenLop, setTenLop] = useState<string>();
	const [thuTuNhom, setThuTuNhom] = useState<number>();
	const loaiLop: ELoaiLopHocPhan = Form.useWatch('loai', form) || ELoaiLopHocPhan.CHINH;

	const resetFields = () => resetFieldsForm(form, { loai: ELoaiLopHocPhan.CHINH });

	// Thay đổi học phần => Gợi ý thứ tự lớp tiếp theo
	const onChangeHocPhan = (mahp?: string) => {
		setMaHocPhan(mahp);
		getAllService({
			condition: { maHocKy: recHocKy?.ma, maHocPhan: mahp, loai: ELoaiLopHocPhan.CHINH },
		}).then((res) => {
			const soThuTuLop = (_.maxBy(res.data?.data, (item: LopHocPhan.IRecord) => item.soThuTuLop)?.soThuTuLop ?? 0) + 1;
			form.setFieldsValue({ soThuTuLop });
			setThuTu(soThuTuLop);
		});
	};

	// Thay đổi học phần => Gợi ý thứ tự lớp tiếp theo
	const onChangeLopHocPhan = (ten?: string) => {
		setTenLop(ten);
		setLopSelect(danhSachLopSelect.find((item) => item.ten === ten));
		getAllService({ condition: { maHocKy: recHocKy?.ma, tenCha: ten } }).then((res) => {
			const soThuTuNhom =
				(_.maxBy(res.data?.data, (item: LopHocPhan.IRecord) => item.soThuTuNhom)?.soThuTuNhom ?? 0) + 1;
			form.setFieldsValue({ soThuTuNhom });
			setThuTuNhom(soThuTuNhom);
		});
	};

	useEffect(() => {
		if (!visibleForm) resetFields();
		else if (record?._id)
			form.setFieldsValue({ ...record, maLopHpHcList: record.lopHpHcList?.map((item) => item.maLopHc) });
		else {
			form.setFieldsValue({ loai: ELoaiLopHocPhan.CHINH });
			if (recHocPhan?.maHocPhan) {
				form.setFieldsValue({ maHocPhan: recHocPhan?.maHocPhan });
				onChangeHocPhan(recHocPhan?.maHocPhan);
			}
		}
	}, [record?._id, visibleForm]);

	// Tự động điền tên lớp tín chỉ khi thay đổi học phần, thứ tự lớp
	useEffect(() => {
		if (!record?._id) {
			const ten = maHocPhan && thuTu ? `${maHocPhan}-${recHocKy?.ma}-${thuTu.toString().padStart(2, '0')}` : '';
			form.setFieldsValue({ ten });
		}
	}, [maHocPhan, thuTu]);

	// Tự động điền tên nhóm khi thay đổi lớp tín chỉ, thứ tự nhóm
	useEffect(() => {
		if (!record?._id) {
			const ten = tenLop && thuTuNhom ? `${tenLop}-${thuTuNhom.toString().padStart(2, '0')}` : '';
			form.setFieldsValue({ ten });
		}
	}, [tenLop, thuTuNhom]);

	const getData = () =>
		getModel({
			maHocKy: recHocKy?.ma,
			loai: ELoaiLopHocPhan.CHINH,
			maHocPhan: recHocPhan?.maHocPhan,
		});

	const onFinish = async (values: LopHocPhan.IRecord) => {
		if (edit) {
			const lopHcHienTai = record?.lopHpHcList?.map((item) => item.maLopHc ?? '');
			const lopHcThem = values.maLopHpHcList?.filter((maLopHc) => !lopHcHienTai?.includes(maLopHc));
			const lopHcXoa = record?.lopHpHcList?.filter((lopHc) => !values.maLopHpHcList?.includes(lopHc.maLopHc ?? ''));
			// Thêm map Lớp tín chỉ - Lớp hành chính
			if (lopHcThem)
				Promise.allSettled(lopHcThem?.map((maLopHc) => postLopHpLopHc({ maLopHc, maLopHp: record?.ten ?? '' }))).catch(
					(er) => console.log(er),
				);
			// Xóa map
			if (lopHcXoa)
				Promise.allSettled(lopHcXoa.map((lopHc) => deleteLopHpLopHc(lopHc._id ?? ''))).catch((er) => console.log(er));
			// Update Thông tin lớp tín chỉ
			delete values.maLopHpHcList;
			delete values.lopHpHcList;
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(
				{
					...values,
					lopHpHcList: values.maLopHpHcList?.map((maLopHc) => ({ maLopHc })),
					maHocKy: recHocKy?.ma ?? '',
					...(values.loai === ELoaiLopHocPhan.THUC_HANH
						? { maHocPhan: recLopSelect?.maHocPhan, soThuTuLop: recLopSelect?.soThuTuLop }
						: {}),
				},
				getData,
				false,
			)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={8}>
					<Form.Item label='Học kỳ'>
						<Input value={recHocKy?.ten} disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='loai' label='Loại lớp' rules={[...rules.required]}>
						<Select
							placeholder='Chọn loại lớp'
							disabled={edit}
							options={[ELoaiLopHocPhan.CHINH, ELoaiLopHocPhan.THUC_HANH].map((item) => ({
								key: item,
								value: item,
								label: ETenLoaiLopHocPhan[item],
							}))}
						/>
					</Form.Item>
				</Col>

				{loaiLop === ELoaiLopHocPhan.CHINH ? (
					<>
						<Col span={24} md={8}>
							<Form.Item name='maHocPhan' label='Học phần' rules={[...rules.required]}>
								<SelectHocPhanRieng selectMa disabled={edit} onChange={onChangeHocPhan} />
								{/* maHocKy={recHocKy?.ma} */}
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='soThuTuLop' label='Số thứ tự lớp'>
								<InputNumber style={{ width: '100%' }} disabled />
							</Form.Item>
						</Col>
					</>
				) : (
					<>
						<Col span={24} md={8}>
							<Form.Item name='tenCha' label='Lớp tín chỉ' rules={[...rules.required]}>
								<SelectLopHocPhan
									condition={{ maHocKy: recHocKy?.ma }}
									selectMa
									onChange={onChangeLopHocPhan}
									disabled={edit}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='soThuTuNhom' label='Số thứ tự nhóm'>
								<InputNumber style={{ width: '100%' }} disabled />
							</Form.Item>
						</Col>
					</>
				)}

				<Col span={24} md={8}>
					<Form.Item name='ten' label={loaiLop === ELoaiLopHocPhan.THUC_HANH ? 'Mã nhóm thực hành' : 'Mã lớp tín chỉ'}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='siSoToiDa' label='Sĩ số tối đa' rules={[...rules.required, ...rules.number(200, 1, false)]}>
						<InputNumber placeholder='Sĩ số tối đa' min={1} max={200} style={{ width: '100%' }} />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='hinhThucGiangDay' label='Hình thức giảng dạy'>
						<Select
							options={Object.values(EHinhThucGiangDay).map((item) => ({
								value: item,
								key: item,
								label: hinhThucGiangDay[item],
							}))}
							placeholder='Chọn hình thức giảng dạy'
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='doiTuongLopHanhChinh' label='Đối tượng lớp hành chính'>
						<Select
							placeholder='Chọn đối tượng'
							options={Object.values(EDoiTuongLopHanhChinh).map((item) => ({
								value: item,
								key: item,
								label: doiTuongLopHanhChinh[item],
							}))}
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item
						name='moodleShortname'
						label='Mã khóa học LMS (Moodle)'
						rules={[...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập mã khóa học' />
					</Form.Item>
				</Col>

				{loaiLop === ELoaiLopHocPhan.CHINH ? (
					<Col span={24}>
						<Form.Item
							name='maLopHpHcList'
							label='Lớp hành chính liên quan'
							extra='Nhập từ khóa để tìm kiếm theo tên lớp'
						>
							<SelectLopHanhChinhDebounce multiple selectMa allowClear />
						</Form.Item>
					</Col>
				) : null}
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormLopHocPhan;
