import {
	EVaiTroBanCanSuLop,
	MapKeyNameVaiTroBanCanSuLop,
} from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/constants';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLopHanhChinhCondition from '../../NamHoc/LopHanhChinh/components/SelectLopHanhChinhCondition';
import SelectSinhVienLopHC from '../../NamHoc/SvLopHanhChinh/components/Select';
import SelectHocKy from '../HocKy/components/SelectHocKy';

const FormBanCanSuLop = (props: { getData: any; lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, edit, postModel, putModel, formSubmiting } =
		useModel('daotaov2.hocky.sinhvienhocky');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const lopHanhChinhId = Form.useWatch('lopHanhChinhId', form);
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				lopHanhChinhId: record?.lopHanhChinhId || recLopHanhChinh?._id,
				maHocKy: record?.maHocKy || recHocKy?.ma,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			lopHanhChinhId: props?.lopHanhChinh?._id || values?.lopHanhChinhId,
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
					? intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.themmoi' })
					: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.chinhsua' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required]}
					name='maHocKy'
					label={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.hocky' })}
				>
					<SelectHocKy selectMa />
				</Form.Item>
				{!props?.lopHanhChinh?._id && (
					<Form.Item
						rules={[...rules.required]}
						name='lopHanhChinhId'
						label={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.lhc' })}
					>
						<SelectLopHanhChinhCondition
							onChange={(val) => {
								form.setFieldsValue({
									sinhVienSsoId: undefined,
								});
							}}
						/>
					</Form.Item>
				)}
				<Form.Item
					rules={[...rules.required]}
					name='sinhVienSsoId'
					label={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.sv' })}
				>
					<SelectSinhVienLopHC
						// keyName='_id'
						hasCreate={false}
						lopHanhChinhId={props?.lopHanhChinh?._id || lopHanhChinhId}
					/>
				</Form.Item>
				<Form.Item
					rules={[...rules.required]}
					name='vaiTro'
					label={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.vaitro' })}
				>
					<Select
						placeholder={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.form.vaitro.place' })}
						options={Object.values(EVaiTroBanCanSuLop).map((item) => ({
							value: item,
							label: MapKeyNameVaiTroBanCanSuLop[item],
						}))}
					/>
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

export default FormBanCanSuLop;
