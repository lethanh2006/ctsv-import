import { ETrangThaiDuyetBienBanHopDiemRenLuyen } from '@/services/DiemRenLuyen/BienBanHop/constant';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useIntl, useModel } from 'umi';

const FormYeuCauChinhSua = (props: { getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleFormYeuCauChinhSua, putModel, loading } = useModel('diemrenluyen.bienbanhop');

	const onFinish = async (values: any) => {
		await putModel(
			record?._id ?? '',
			{
				...record,
				...values,
				trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
			},
			props.getData,
		);
		setVisibleFormYeuCauChinhSua(false);
	};

	return (
		<Card
			title={intl.formatMessage(
				{ id: 'lophanhchinh.bienban.button.yccs.form.title' },
				{
					tenLopHC: record?.tenLopHC,
				},
			)}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					initialValue={record?.noiDungYeuCauChinhSua}
					name='noiDungYeuCauChinhSua'
					label={intl.formatMessage({ id: 'lophanhchinh.bienban.button.yccs.form.noidung' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input.TextArea
						autoFocus
						placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.button.yccs.form.noidung.place' })}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'lophanhchinh.bienban.button.yccs.form.gui' })}
					</Button>
					<Button onClick={() => setVisibleFormYeuCauChinhSua(false)}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormYeuCauChinhSua;
