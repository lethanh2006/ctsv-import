import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row, type FormInstance } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TabTrongSoHocPhan = (props: { form: FormInstance<any>; setDiemKTHP: (val: number) => void }) => {
	const { form, setDiemKTHP } = props;
	const { record, visibleForm } = useModel('daotaov2.hocphan.decuonghocphan');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [trongSo, setTrongSo] = useState<number[]>([]);

	useEffect(() => {
		// Max 10 đầu điểm
		getDauDiem();
	}, []);

	useEffect(() => {
		if (visibleForm) {
			const ts = danhSachDauDiem.map(
				(i) => (record?.[`trongSo${i.field}` as keyof HocPhan.IDeCuongHocPhan] as number) ?? 0,
			);
			setTrongSo(ts);
			const sum = _.sum(ts);
			setDiemKTHP(100 - sum);
			form.setFieldsValue({ diemKTHP: 100 - sum });
		}
	}, [visibleForm, record?._id]);

	const onChangeTrongSo = (value: number, index: number) => {
		const ts = [...trongSo];
		ts[index] = value;
		setTrongSo(ts);
		const sum = _.sum(ts);
		setDiemKTHP(100 - sum);
		form.setFieldsValue({ diemKTHP: 100 - sum });
	};

	return (
		<Row gutter={[12, 0]}>
			{danhSachDauDiem.map((dd, index) => (
				<Col span={24} md={12} key={dd._id}>
					<Form.Item
						name={`trongSo${dd.field}`}
						label={dd.ten}
						rules={[...rules.required, ...rules.number(100, 0, false)]}
					>
						<InputNumber
							placeholder={`Nhập ${dd.ten.toLowerCase()}`}
							max={100}
							min={0}
							step={1}
							style={{ width: '100%' }}
							onChange={(val) => onChangeTrongSo(val as number, index)}
							addonAfter='%'
						/>
					</Form.Item>
				</Col>
			))}

			<Col span={24} md={12}>
				<Form.Item name='diemKTHP' label='Điểm kết thúc học phần'>
					<InputNumber style={{ width: '100%' }} disabled addonAfter='%' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default TabTrongSoHocPhan;
