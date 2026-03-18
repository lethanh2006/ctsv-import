import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { ELoaiSoLuong, EPhanBoNguon } from '@/services/SuKienV2/constant';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { nanoid } from 'nanoid';
import { inputFormat, inputParse } from '@/utils/utils';

interface Props {
	hideCard?: boolean;
	setData: any;
	setVisibleForm: any;
}

const FormDuTruKinhPhi = ({ hideCard, setData, setVisibleForm }: Props) => {
	const [form] = Form.useForm();
	const { editKinhPhi, recordKinhPhi, dataKinhPhi } = useModel('sukienv2');
	const currentPhanBoNguon = Form.useWatch('phanBoNguon', form);
	const onFinish = async (values: any) => {
		if (editKinhPhi) {
			const arr = [...dataKinhPhi];
			arr?.forEach((val, i) => {
				if (val?.id === recordKinhPhi?.id) {
					arr?.splice(i, 1, {
						...values,
						duToan: values.soLuong * values.luot * values.dinhMuc,
						id: recordKinhPhi?.id ?? nanoid(),
					});
				}
			});
			setData(arr);
		} else {
			const arr = [...dataKinhPhi];
			arr.push({ ...values, duToan: values.soLuong * values.luot * values.dinhMuc, id: nanoid() });
			setData(arr);
		}
		// setData([{ ...values, duToan: values.soLuong * values.luot * values.dinhMuc, id: nanoid() }]);
		setVisibleForm(false);
	};
	useEffect(() => {
		if (editKinhPhi) {
			form.setFieldsValue({ ...recordKinhPhi });
		} else {
			form.setFieldsValue(form);
		}
	}, [recordKinhPhi, editKinhPhi]);
	const renderContent = () => {
		return (
			<>
				<Form id='FormDuTruKinhPhi' form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='noiDung'
								label='Nội dung'
							>
								<Input.TextArea placeholder='Nội dung' autoFocus />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='dvTinh'
								label='Đơn vị tính'
							>
								<Input placeholder='Đơn vị tính' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='phong' label='Phòng'>
								<Input placeholder='Phòng' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='loaiSoLuong' label='Loại số lượng'>
								<Select
									placeholder={'Chọn loại số lượng'}
									options={Object.values(ELoaiSoLuong)?.map((val) => ({
										value: val,
										label: val,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='soLuong' label='Số lượng'>
								<InputNumber
									formatter={inputFormat}
									parser={inputParse}
									style={{ width: '100%' }}
									min={1}
									placeholder='Số lượng'
								/>
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='luot' label='Lượt'>
								<InputNumber
									formatter={inputFormat}
									parser={inputParse}
									style={{ width: '100%' }}
									min={1}
									placeholder='Lượt'
								/>
							</Form.Item>
						</Col>{' '}
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='dinhMuc' label='Định mức'>
								<InputNumber
									formatter={inputFormat}
									parser={inputParse}
									style={{ width: '100%' }}
									min={1}
									placeholder='Định mức'
								/>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='phanBoNguon' label='Phân bổ nguồn'>
								<Select
									mode={'multiple'}
									placeholder='Phân bổ nguồn'
									options={Object.values(EPhanBoNguon)?.map((val) => ({ value: val, label: val }))}
								/>
							</Form.Item>
						</Col>
						{currentPhanBoNguon?.includes(EPhanBoNguon.NGAN_SACH) && (
							<Col xs={12}>
								<Form.Item rules={[...rules.required]} name='nguonNSNN' label='Số tiền nguồn NSNN'>
									<InputNumber
										addonAfter='VNĐ'
										formatter={inputFormat}
										parser={inputParse}
										style={{ width: '100%' }}
										min={1}
										placeholder='Số tiền nguồn NSNN'
									/>
								</Form.Item>
							</Col>
						)}
						{currentPhanBoNguon?.includes(EPhanBoNguon.TU_CHU) && (
							<Col xs={12}>
								<Form.Item rules={[...rules.required]} name='nguonTuChu' label='Số tiền nguồn tự chủ'>
									<InputNumber
										addonAfter='VNĐ'
										formatter={inputFormat}
										parser={inputParse}
										style={{ width: '100%' }}
										min={1}
										placeholder='Số tiền nguồn tự chủ'
									/>
								</Form.Item>
							</Col>
						)}
						{currentPhanBoNguon?.includes(EPhanBoNguon.TAI_TRO) && (
							<Col xs={12}>
								<Form.Item rules={[...rules.required]} name='nguonTaiTro' label='Số tiền nguồn tài trợ'>
									<InputNumber
										addonAfter='VNĐ'
										formatter={inputFormat}
										parser={inputParse}
										style={{ width: '100%' }}
										min={1}
										placeholder='Số tiền nguồn tài trợ'
									/>
								</Form.Item>
							</Col>
						)}
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='hoanThanh' label='Tiến độ hoàn thành'>
								<Input.TextArea placeholder={'Tiến độ hoàn thành'} rows={2} />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='chungTuYeuCau'
								label='Chứng từ yêu cầu'
							>
								<Input.TextArea placeholder='Chứng từ yêu cầu' />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='yKienTCKT'
								label='Ý kiến TCKT'
							>
								<Input.TextArea placeholder='Ý kiến TCKT' />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className='form-footer'>
					<Button form='FormDuTruKinhPhi' loading={false} htmlType='submit' type='primary'>
						{'Lưu lại'}
					</Button>

					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</>
		);
	};

	if (hideCard) {
		return <div>{renderContent()}</div>;
	}

	return <Card title={'Thêm mới'}>{renderContent()}</Card>;
};

export default FormDuTruKinhPhi;
