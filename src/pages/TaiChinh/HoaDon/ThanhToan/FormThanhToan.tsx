import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan, ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat, inputParse } from '@/utils/utils';
import { Button, Col, Form, InputNumber, Popconfirm, Row, Table } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import HuongDanThanhToan from './HuongDanThanhToan';

const FormThanhToan = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const { danhSach, visibleThanhToan, setVisibleThanhToan, getAllModel } = useModel('taichinh.hoadonchitiet');
	const {
		formSubmiting,
		getSoDuViSinhVienModel,
		soDuVi,
		thanhToanFullBillModel,
		paymentType,
		setVisibleHuongDan,
		thanhToanMomoModel,
		setRecord,
	} = useModel('taichinh.giaodich');
	const [form] = Form.useForm();
	const dataHienThi = danhSach.filter((item) =>
		[EMaTrangThaiThanhToan.CHUA_THANH_TOAN, EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU].includes(item.status),
	);
	const totalUuDai = _.sumBy(dataHienThi, (item) => item.amountDiscount);
	const payList: Record<string, number> = Form.useWatch('payList', form);
	const totalPay = _.sum(Object.values(payList ?? {})) ?? 0;
	const topupAmount = totalPay > (soDuVi?.totalRemain ?? 0) ? totalPay - (soDuVi?.totalRemain ?? 0) : 0;
	const totalSauThanhToan = (soDuVi?.totalRemain ?? 0) + topupAmount - totalPay;

	/** Get lại chi tiết các bill items */
	const getBillItems = () =>
		recHoaDon?.identityCode && getAllModel(undefined, undefined, { billIdentityCode: recHoaDon?.identityCode });

	useEffect(() => {
		if (visibleThanhToan) {
			const pay: any = {};
			dataHienThi.forEach((item) => {
				const payItem = item.amountRemaining;
				pay[item._id] = payItem;
			});
			form.setFieldsValue({ payList: pay });

			getSoDuViSinhVienModel();
		}
	}, [visibleThanhToan]);

	const onFinish = () => {
		const data: GiaoDich.TThanhToan = {
			billIdentityCode: recHoaDon?.identityCode ?? '',
			paymentType,
			fullBill: true,
			topupAmount,
		};

		thanhToanFullBillModel(data)
			.then((rec) => {
				if (getData) getData(); // Get data từ Thông tin thanh toán
				getBillItems();
				setVisibleThanhToan(false);

				if (rec.giaoDichTopup?.paymentType === ETransactionPaymentType.BANK) {
					setRecord(rec.giaoDichTopup);
					setVisibleHuongDan(true);
				} else if (
					rec.giaoDichTopup?.paymentType === ETransactionPaymentType.MOMO_WALLET &&
					rec.giaoDichTopup?.identityCode
				)
					thanhToanMomoModel(rec.giaoDichTopup.identityCode);
			})
			.catch((err) => console.log(err));
	};

	const columns: IColumn<HoaDon.IBillItem & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.noidung' }),
			dataIndex: 'ten',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.thanhtien' }),
			dataIndex: 'amountDue',
			width: 110,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.uudai' }),
			dataIndex: 'amountDiscount',
			width: 110,
			align: 'right',
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.danop' }),
			dataIndex: 'amountPaid',
			width: 110,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.conlai' }),
			dataIndex: 'amountRemaining',
			width: 110,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.thanhtoan' }),
			width: 140,
			align: 'right',
			render: (val, rec) => (
				<Form.Item noStyle name={['payList', rec?._id]}>
					<InputNumber
						step={1000}
						min={0}
						max={rec.amountRemaining}
						formatter={inputFormat}
						parser={inputParse}
						style={{ width: '100%' }}
						placeholder={intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.nhapsotien' })}
						addonAfter='VND'
						disabled
					/>
				</Form.Item>
			),
		},
	];

	return (
		<>
			<Form layout='vertical' form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col span={24} md={8}>
						<Form.Item label={intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.sodu' })}>
							<InputNumber
								value={soDuVi?.totalRemain ?? 0}
								disabled
								addonAfter='VND'
								formatter={inputFormat}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={[12, 8]}>
					<Col span={24}>
						<div className='fw500' style={{ marginTop: 12 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.dskhoanphi' })}
						</div>
						<TableStaticData
							data={dataHienThi}
							addStt
							columns={columns}
							size='small'
							otherProps={
								{
									pagination: false,
									summary: (pageData: HoaDon.IBillItem[]) => {
										const totalDue = _.sumBy(pageData, (item) => item.amountDue);
										const totalPaid = _.sumBy(pageData, (item) => item.amountPaid);
										const totalRemain = _.sumBy(pageData, (item) => item.amountRemaining);

										return (
											<Table.Summary.Row>
												<Table.Summary.Cell index={0} colSpan={2}>
													<b>{intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.tongso' })}</b>
												</Table.Summary.Cell>
												<Table.Summary.Cell align={'right'} index={1}>
													<b> {inputFormat(totalDue ?? 0)} VND</b>
												</Table.Summary.Cell>
												<Table.Summary.Cell align={'right'} index={2}>
													<b>{inputFormat(totalUuDai ?? 0)} VND</b>
												</Table.Summary.Cell>
												<Table.Summary.Cell align={'right'} index={3}>
													<b>{inputFormat(totalPaid ?? 0)} VND</b>
												</Table.Summary.Cell>
												<Table.Summary.Cell align={'right'} index={4}>
													<b>{inputFormat(totalRemain ?? 0)} VND</b>
												</Table.Summary.Cell>
												<Table.Summary.Cell align={'right'} index={5}>
													<b>{inputFormat(totalPay ?? 0)} VND</b>
												</Table.Summary.Cell>
											</Table.Summary.Row>
										);
									},
								} as any
							}
						/>
					</Col>

					<Col span={24}>
						<div className='fw500' style={{ marginTop: 12 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.hinhthuc' })}
						</div>
					</Col>
					<Col span={24}>
						<HuongDanThanhToan
							thanhToan={totalPay + totalUuDai}
							tongUuDai={totalUuDai}
							amount={topupAmount}
							duNo={totalSauThanhToan}
						/>
					</Col>
				</Row>

				<div className='form-footer' style={{ marginTop: 18 }}>
					<Popconfirm
						title={intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.confirm.thanhtoan' })}
						onConfirm={() => form.submit()}
					>
						<Button loading={formSubmiting} type='primary' htmlType='submit'>
							{intl.formatMessage({ id: 'taichinh.hoadon.formthanhtoan.button.thanhtoan' })}
						</Button>
					</Popconfirm>

					<Button onClick={() => setVisibleThanhToan(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormThanhToan;
