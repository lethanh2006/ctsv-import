import FormWaiting from '@/components/Loading/FormWaiting';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import rules from '@/utils/rules';
import { Button, Col, Divider, Form, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const SoLuongSinhVienLhc = () => {
	const intl = useIntl();
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { record: recHinhThuc } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const { loading, reportSoLuongSinhVienLhcModel } = useModel('daotaov2.sinhvien.baocao');
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		if (values.maHocKy) {
			FormWaiting(intl.formatMessage({ id: 'thongkebaocao.card.wait' }));
			reportSoLuongSinhVienLhcModel({ ...values, maTrinhDo: recTrinhDo?.ma, maHinhThuc: recHinhThuc?.ma })
				.then()
				.catch((er: any) => console.log(er))
				.finally(() => Modal.destroyAll());
		}
	};

	return (
		<>
			<Divider>{intl.formatMessage({ id: 'thongkebaocao.card.divider' })}</Divider>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6} xxl={4}>
						<Form.Item
							name='maHocKy'
							label={intl.formatMessage({ id: 'thongkebaocao.id.kyhoctk' })}
							rules={[...rules.required]}
						>
							<SelectHocKy style={{ width: 400 }} selectMa />
						</Form.Item>
					</Col>
				</Row>

				<Button loading={loading} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'thongkebaocao.id.xacnhan' })}
				</Button>
			</Form>
		</>
	);
};

export default SoLuongSinhVienLhc;
