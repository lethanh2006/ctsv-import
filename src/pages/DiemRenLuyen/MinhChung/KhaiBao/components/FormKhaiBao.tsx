import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { EKieuDuLieu, ETextDisplay } from '@/services/FormDong/LoaiHinh/constants';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Divider, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormRender from '../../CauHinh/components/MauDon/FormRender';
import ViewRender from '../../CauHinh/components/MauDon/ViewRender';
const FormKhaiBao = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const [formValues, setFormValues] = useState<any>({});
	const { record: recordCauHinh } = useModel('diemrenluyen.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyen.dot');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const { edit, formSubmiting, setVisibleForm, record, postModel, putModel, visibleForm, isView } = useModel(
		'diemrenluyen.minhchung.khaibao',
	);

	const onFinish = async (values: any) => {
		try {
			const hoTen = values?.hoTen;
			const ssoId = values?.ssoId;
			const maSinhVien = values?.maSinhVien;
			const lopHanhChinh = values?.lopHanhChinh;
			const diemQuyDoi = recordCauHinh?.isDanhMucDiemQuyDoi ? values?.diemQuyDoi : recordCauHinh?.diemQuyDoi;

			delete values?.hoTen;
			delete values?.ssoId;
			delete values?.maSinhVien;
			delete values?.lopHanhChinh;
			delete values?.diemQuyDoi;

			const valuesFinal: any = {};
			const valuesForm = { ...(record?.thongTinKhaiBao ?? {}), ...values };
			// const formValuesFinal = form.getFieldsValue() || {};

			for (const item in valuesForm) {
				const value = valuesForm[item];
				if (value?.fileList?.length) {
					valuesForm[item] = await buildUpLoadMultiFile(valuesForm, item);
				}
			}

			Object.keys(valuesForm).map((item) => {
				const cauHinh = recordCauHinh?.danhSachCauHinhMinhChung?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				valuesFinal[item] = {
					value: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});

			const payload = {
				thongTinKhaiBao: { ...valuesFinal },
				cauHinhMinhChungId: recordCauHinh?._id,
				dotChamDiemId: recordDot?._id,
				hoTen: hoTen,
				ssoId: ssoId,
				maSinhVien: maSinhVien,
				lopHanhChinh: lopHanhChinh,
				diemQuyDoi: diemQuyDoi,
			};
			if (edit) {
				putModel(record?._id ?? '', { ...payload }, getData);
			} else {
				postModel({ ...payload }, getData);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const valuesFormKhaiBao: any = {};
			Object.keys(record?.thongTinKhaiBao ?? {}).map((key) => {
				valuesFormKhaiBao[key] = record?.thongTinKhaiBao[key]?.value;
			});
			form.setFieldsValue({
				...record,
				...valuesFormKhaiBao,
			});
		}
	}, [record?._id, visibleForm]);

	if (isView) {
		return (
			<Card title={`${recordCauHinh?.tenMinhChung ?? intl.formatMessage({ id: 'minhchung.khaibao.title.khaibao' })}`}>
				<Divider orientation={'center'}>{intl.formatMessage({ id: 'minhchung.khaibao.thongtinchung' })}</Divider>
				<Row gutter={[0, 10]}>
					<Col xs={24} sm={24} md={12}>
						<div
							style={{
								display: 'flex',
							}}
						>
							<div style={{ marginRight: 4 }}>
								<b>{intl.formatMessage({ id: 'minhchung.khaibao.sinhvien' })}: </b>
							</div>
							<div>{record?.hoTen}</div>
						</div>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<div
							style={{
								display: 'flex',
							}}
						>
							<div style={{ marginRight: 4 }}>
								<b>{intl.formatMessage({ id: 'minhchung.khaibao.masv' })}: </b>
							</div>
							<div>{record?.maSinhVien}</div>
						</div>
					</Col>
					{recordCauHinh?.isDanhMucDiemQuyDoi && (
						<Col xs={24} sm={24} md={24}>
							<div
								style={{
									display: 'flex',
								}}
							>
								<div style={{ marginRight: 4 }}>
									<b>{recordCauHinh?.tenDanhMucQuyDoi}: </b>
								</div>
								<div>
									{recordCauHinh?.danhMucDiemQuyDoi?.find((item) => item?.diemQuyDoi === record?.diemQuyDoi)?.tieuDe}
								</div>
							</div>
						</Col>
					)}
					<Divider orientation={'center'}>{intl.formatMessage({ id: 'minhchung.khaibao.thongtinkhaibao' })}</Divider>
					{recordCauHinh?.danhSachCauHinhMinhChung.map((item) => {
						if (
							!item?.truongThongTinLienQuan ||
							item?.truongThongTinLienQuan
							// (dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value ===
							//   item?.giaTriLienQuan ||
							//   (item.giaTriLienQuan.includes &&
							//     item?.giaTriLienQuan?.includes(
							//       dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value,
							//     ))))
						) {
							const isTable = item?.kieuDuLieu === EKieuDuLieu.TABLE || item?.kieuDuLieu === EKieuDuLieu.DANHSACH;
							const isHtml = item?.kieuDuLieu === EKieuDuLieu.TEXT && item?.textDisplay === ETextDisplay?.TEXT_EDITOR;
							return (
								<Col key={item.ma} xs={24} sm={24} md={item.colspan || 24} lg={item.colspan || 24}>
									<div
										style={{
											display: 'flex',
											flexDirection: isHtml || isTable ? 'column' : 'row',
										}}
									>
										<div style={{ marginRight: 4, flexShrink: 0 }}>
											<b>{item.ten}: </b>
										</div>
										<div>
											<ViewRender
												cauHinh={item}
												recordSanPham={{
													thongTinKhaiBao: record?.thongTinKhaiBao,
												}}
											/>
										</div>
									</div>
								</Col>
							);
						} else return null;
					})}
				</Row>
			</Card>
		);
	} else {
		return (
			<Card title={`${recordCauHinh?.tenMinhChung ?? intl.formatMessage({ id: 'minhchung.khaibao.title.khaibao' })}`}>
				<Form
					style={{ position: 'relative' }}
					scrollToFirstError
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					labelCol={{ span: 24 }}
					form={form}
					onFinish={onFinish}
					layout={'vertical'}
				>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name={'ssoId'} hidden />
							<Form.Item name={'hoTen'} hidden />
							<Form.Item name={'lopHanhChinh'} hidden />
							<Form.Item
								name={'maSinhVien'}
								label={intl.formatMessage({ id: 'minhchung.khaibao.sinhvien' })}
								rules={[...rules.required]}
							>
								<SelectSinhVienDebounce
									selectMa
									onChange={(val, option) => {
										const rawData: SinhVien.IRecord = option?.rawData as SinhVien.IRecord;
										form.setFieldsValue({
											ssoId: rawData?.ssoId,
											hoTen: rawData?.ten,
											lopHanhChinh: rawData?.lopHanhChinhList?.[0]?.ten,
										});
									}}
								/>
							</Form.Item>
						</Col>
						{recordCauHinh?.isDanhMucDiemQuyDoi && (
							<Col span={24}>
								<Form.Item
									name={'diemQuyDoi'}
									label={recordCauHinh?.tenDanhMucQuyDoi ?? intl.formatMessage({ id: 'minhchung.khaibao.hangmuc' })}
									rules={[...rules.required]}
								>
									<Select
										placeholder={
											recordCauHinh?.tenDanhMucQuyDoi ?? intl.formatMessage({ id: 'minhchung.khaibao.chonhangmuc' })
										}
										options={recordCauHinh?.danhMucDiemQuyDoi?.map((val) => ({
											value: val?.diemQuyDoi,
											label: `${val?.tieuDe}`,
										}))}
									/>
								</Form.Item>
							</Col>
						)}
						{recordCauHinh?.danhSachCauHinhMinhChung?.map((item) => (
							<FormRender
								danhSachCauHinh={recordCauHinh?.danhSachCauHinhMinhChung}
								formValues={formValues}
								key={item.ma}
								cauHinh={item}
								form={form}
							/>
						))}
					</Row>
					<div className='form-footer'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Card>
		);
	}
};
export default FormKhaiBao;
