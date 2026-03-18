import { Card, Form, Tag } from 'antd';
import { useEffect, useState } from 'react';

import { useModel } from 'umi';
import { TrangThaiKhaiBao } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/constants';
import FormRender from '../../QuanLyQuyTrinh/components/MauDon/FormRender';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';

const ViewResult = (props: { danhSachKhaiBao: any }) => {
	const { danhSachKhaiBao } = props;
	const { currentFormKhaiBao, current } = useModel('quytrinh.donquytrinh');

	const [formValues, setFormValues] = useState<any>({});
	console.log('currentFormKhaiBao', currentFormKhaiBao);
	const [form] = Form.useForm();
	useEffect(() => {
		if (danhSachKhaiBao) {
			form.setFieldsValue(danhSachKhaiBao?.thongTinKhaiBao);
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
				<Tag color={current?.coKhaiBao ? 'green' : 'yellow'}>
					{current?.coKhaiBao ? TrangThaiKhaiBao.DA_KHAI_BAO : TrangThaiKhaiBao.CHUA_KHAI_BAO}
				</Tag>
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
