import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import FormRender from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/FormRender';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormGiaoNopSanPham = (props: { isView?: boolean; getData: any; ssoId?: string }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record } = useModel('chedochinhsach.chedochinhsach');
	const {
		edit,
		formSubmiting,
		loading,
		setVisibleForm,
		record: recordQuyetDinh,
		putModel,
		postModel,
		visibleForm,
		setLoading,
	} = useModel('chedochinhsach.quyetdinhchedosinhvien');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');

	const [formValues, setFormValues] = useState<any>({
		...recordQuyetDinh,
		...recordQuyetDinh?.thongTinQuyetDinh,
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyetDinh?._id) {
			const buildRecSanPham: any = {};
			Object.keys(recordQuyetDinh.thongTinQuyetDinh).map((item) => {
				buildRecSanPham[item] = recordQuyetDinh.thongTinQuyetDinh[item]?.value;
			});

			const initValueForm = {
				...recordQuyetDinh,
				...buildRecSanPham,
			};
			form.setFieldsValue(initValueForm);
			setFormValues(initValueForm);
		}
	}, [recordQuyetDinh?._id, visibleForm]);

	const handleFinish = async () => {
		try {
			const formValuesFinal = form.getFieldsValue() || {};

			setLoading(true);
			for (const item in formValuesFinal) {
				const value = formValuesFinal[item];
				if (value?.fileList?.length) {
					formValuesFinal[item] = await buildUpLoadMultiFile(formValuesFinal, item);
				}
			}
			const thongTinQuyetDinh: any = {};

			const valuesForm = { ...(recordQuyetDinh?.thongTinQuyetDinh ?? {}), ...formValuesFinal };
			Object.keys(valuesForm).map((item) => {
				const cauHinh = record?.danhSachCauHinhThongTin?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				// const isDate = cauHinh?.kieuDuLieu === EKieuDuLieu.DATE;
				// const isMonth = cauHinh?.kieuDuLieu === EKieuDuLieu.MONTH;
				thongTinQuyetDinh[item] = {
					value:
						// (isDate || isMonth) && valuesForm
						// 	? dayjs(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY')
						// 	:
						valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});
			const payload = {
				...recordQuyetDinh,
				thongTinQuyetDinh,
				cheDoSinhVienId: record?._id ?? '',
				ssoId: props.ssoId || formValuesFinal?.ssoId || '',
			};

			let res;
			if (edit && recordQuyetDinh) {
				await putModel(recordQuyetDinh?._id, payload, props.getData);
			} else {
				res = await postModel(payload, props.getData);
			}
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card
			title={`${intl.formatMessage({ id: !edit ? 'global.title.themmoi' : 'global.title.chinhsua' })} ${record?.ten ?? ''}`}
		>
			<Form
				scrollToFirstError
				labelCol={{ span: 24 }}
				form={form}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={async (values) => {
					if (!record) return;
					handleFinish();
				}}
			>
				<Row gutter={[12, 0]}>
					{!props.ssoId && (
						<Col span={24}>
							<Form.Item
								rules={[...rules.required]}
								name='ssoId'
								label={intl.formatMessage({ id: 'kyluatkhenthuong.formgiaonopsp.sinhvien' })}
							>
								<SelectSinhVienDebounce />
							</Form.Item>
						</Col>
					)}
					{record?.danhSachCauHinhThongTin?.map((item) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>

				{!props.isView && (
					<div className='form-footer'>
						<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
							{intl.formatMessage({ id: 'global.button.huy' })}
						</Button>
					</div>
				)}
			</Form>
		</Card>
	);
};

export default FormGiaoNopSanPham;
