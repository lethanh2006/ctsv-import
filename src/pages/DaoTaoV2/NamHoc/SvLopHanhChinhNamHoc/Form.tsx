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
import SelectLopHanhChinhCondition from '../LopHanhChinh/components/SelectLopHanhChinhCondition';
import SelectNamHoc from '../NamHoc/components/Select';
import SelectSinhVienLopHC from '../SvLopHanhChinh/components/Select';

const FormBanCanSuLop = (props: { getData: any; lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, edit, postModel, putModel, formSubmiting } = useModel(
		'daotaov2.lophcsvnamhoc.lophcsvnamhoc',
	);
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const lopHanhChinhId = Form.useWatch('lopHanhChinhId', form);
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				lopHanhChinhId: recLopHanhChinh?._id,
				maNamHoc: record?.maNamHoc || recNamHoc?.ma,
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
					? intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.themmoi' })
					: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.chinhsua' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required]}
					name='maNamHoc'
					label={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.namhoc' })}
				>
					<SelectNamHoc selectMa />
				</Form.Item>
				{!props?.lopHanhChinh?._id && (
					<Form.Item
						rules={[...rules.required]}
						name='lopHanhChinhId'
						label={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.lop' })}
					>
						<SelectLopHanhChinhCondition
							onChange={(val) => {
								form.setFieldsValue({
									lopHcSvId: undefined,
								});
							}}
						/>
					</Form.Item>
				)}
				<Form.Item
					rules={[...rules.required]}
					name='lopHcSvId'
					label={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.sv' })}
				>
					<SelectSinhVienLopHC
						keyName='_id'
						hasCreate={false}
						lopHanhChinhId={props?.lopHanhChinh?._id || lopHanhChinhId}
					/>
				</Form.Item>
				<Form.Item
					rules={[...rules.required]}
					name='vaiTro'
					label={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.vaitro' })}
				>
					<Select
						placeholder={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.vaitro.place' })}
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
