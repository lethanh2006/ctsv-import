import { TrangThaiKhaiBao } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { useModel } from 'umi';
import { Card, Form, Tag } from 'antd';
import { useEffect, useState } from 'react';
import FormRender from '../../components/MauDon/FormRender';

const ViewResult = (props: { danhSachKhaiBao: any; modelName: any; type?: 'dieu_phoi' | 'tiep_nhan' }) => {
	const { danhSachKhaiBao, modelName } = props;
	const model = useModel(modelName);
	const { setRecord: setRecordSanPham } = useModel('quytrinh.quanlyquytrinh');
	const { currentFormKhaiBao, current } = model;
	const [formValues, setFormValues] = useState<any>({});
	const [form] = Form.useForm();
	useEffect(() => {
		if (danhSachKhaiBao) {
			form.setFieldsValue(danhSachKhaiBao?.thongTinKhaiBao);
			setRecordSanPham(danhSachKhaiBao);
		}
	}, [danhSachKhaiBao]);
	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex' }}>
				<div style={{ marginRight: 8 }}>
					<b>Khai báo: </b>
					{danhSachKhaiBao?.ten}
					{danhSachKhaiBao?.ma ? ` (${danhSachKhaiBao?.ma})` : ''}
				</div>
				<div style={{ marginRight: 8 }}>
					<Tag color={current?.coKhaiBao ? 'green' : 'yellow'}>
						{current?.coKhaiBao ? TrangThaiKhaiBao.DA_KHAI_BAO : TrangThaiKhaiBao.CHUA_KHAI_BAO}
					</Tag>
				</div>
			</div>
			<Card>
				<Form
					form={form}
					layout={'vertical'}
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					disabled={true}
				>
					{currentFormKhaiBao?.cauHinhLoaiHinh?.map((item: LoaiHinh.TruongThongTin | LoaiHinh.Cot) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Form>
			</Card>
		</div>
	);
};
export default ViewResult;
