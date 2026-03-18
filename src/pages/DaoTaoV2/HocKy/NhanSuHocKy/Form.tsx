import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLopHanhChinhCondition from '../../NamHoc/LopHanhChinh/components/SelectLopHanhChinhCondition';
import SelectHocKy from '../HocKy/components/SelectHocKy';

const FormNhanSuHocKy = (props: { getData: any; lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, edit, postModel, putModel, formSubmiting } =
		useModel('daotaov2.hocky.nhansuhocky');
	const { danhSach: danhSachNhanSu } = useModel('tochucnhansu.nhansu');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				tenLopHc: record?.tenLopHc || recLopHanhChinh?.ten,
				maHocKy: record?.maHocKy || recHocKy?.ma,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const recNhanSu = danhSachNhanSu.find((item) => item.ssoId === values?.nhanSuSsoId);
		const payload = {
			...values,
			maNhanSu: recNhanSu?.maCanBo,
			hoTenNhanSu: recNhanSu?.hoTen,
			tenLopHc: props?.lopHanhChinh?.ten || values?.tenLopHc,
		};
		if (edit) {
			putModel(
				record?._id ?? '',
				payload,
				props.getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel(payload, props.getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	return (
		<Card
			title={
				!edit
					? intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.form.themmoi' })
					: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.form.chinhsua' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required]}
					name='maHocKy'
					label={intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.form.hocky' })}
				>
					<SelectHocKy selectMa />
				</Form.Item>
				{!props.lopHanhChinh?._id && (
					<Form.Item
						rules={[...rules.required]}
						name='tenLopHc'
						label={intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.form.lhc' })}
					>
						<SelectLopHanhChinhCondition keyName='ten' />
					</Form.Item>
				)}
				<Form.Item
					rules={[...rules.required]}
					name='nhanSuSsoId'
					label={intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.form.canbo' })}
				>
					<SelectNhanSuDebounce />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNhanSuHocKy;
