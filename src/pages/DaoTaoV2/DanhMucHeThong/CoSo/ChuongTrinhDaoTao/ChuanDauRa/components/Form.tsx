import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Form, InputNumber, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLoaiChungChi from '../../../LoaiChungChi/components/Select';

const FormChuanDauRa = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recChuongTrinhDaoTao } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { getModel: getChungChi, danhSach: danhSachChungChi } = useModel('daotaov2.danhmuc.chungchi');
	const { record, setVisibleForm, edit, formSubmiting, visibleForm, postChungChiCTDTManyModel, getModel } = useModel(
		'daotaov2.danhmuc.chungchidaura',
	);
	const {
		setRecord: setLoai,
		record: loaiChungChi,
		danhSach: danhSachLoai,
	} = useModel('daotaov2.danhmuc.loaichungchi');
	const { title } = props;
	const [maChungChiSelected, setMaChungChiSelected] = useState<string[]>();
	const maLoaiChungChi = Form.useWatch('maLoaiChungChi', form);

	const getData = () => getModel({ maChuongTrinhDaoTao: recChuongTrinhDaoTao?.ma });

	useEffect(() => {
		if (maLoaiChungChi)
			getChungChi({ maLoaiChungChi }).then((data) => {
				if (!edit) setMaChungChiSelected(data.map((item) => item.ma)); // Select all
				else if (record?.maLoaiChungChi === maLoaiChungChi) {
					// Map lại chuẩn đầu ra cho từng loại chứng chỉ của record có sẵn
					const danhSachChungChiCtdtCdr = data.map((item) => ({
						maChungChi: item.ma,
						chuanDauRa: record?.danhSachChungChiCtdtCdr?.find((j) => j.maChungChi === item.ma)?.chuanDauRa,
					}));
					form.setFieldsValue({ danhSachChungChiCtdtCdr });
				}
			});
		setLoai(danhSachLoai.find((item) => item.ma === maLoaiChungChi));
	}, [maLoaiChungChi]);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue(record);
			setMaChungChiSelected(record.danhSachChungChiCtdtCdr?.map((item) => item.maChungChi ?? ''));
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ChuongTrinhDaoTao.IChungChiCTDT) => {
		values.danhSachChungChiCtdtCdr = values.danhSachChungChiCtdtCdr?.filter((item) => item?.maChungChi);
		if (!values.danhSachChungChiCtdtCdr?.length) {
			message.warning('Chưa chọn chứng chỉ nào');
			return;
		}
		if (record?._id) values._id = record._id;

		const data = {
			...values,
			maChuongTrinhDaoTao: recChuongTrinhDaoTao?.ma ?? '',
		};

		postChungChiCTDTManyModel(data, getData)
			.then()
			.catch((er) => console.log(er));
	};

	const columns: IColumn<ChungChi.IRecord & { index: number }>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
		},
		{
			title: 'Tên chứng chỉ',
			dataIndex: 'ten',
			width: 160,
		},
		{
			title: 'Ngoại ngữ',
			dataIndex: 'maNgonNgu',
			width: 100,
			render: (val, rec) => rec.ngonNgu?.ten ?? val,
			hide: !loaiChungChi?.isNgoaiNgu,
		},
		{
			title: 'Điều kiện tối thiểu',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				maChungChiSelected?.includes(rec.ma) ? (
					<>
						<Form.Item name={['danhSachChungChiCtdtCdr', rec.index - 1, 'maChungChi']} initialValue={rec.ma} hidden />

						{rec.phuongThucTinhDiem === EPhuongThucTinhDiem.DAT ? (
							<CheckCircleOutlined className='text-success' />
						) : (
							<Form.Item
								name={['danhSachChungChiCtdtCdr', rec.index - 1, 'chuanDauRa']}
								rules={[...rules.required]}
								noStyle
							>
								{rec.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
									<InputNumber
										placeholder='Nhập điểm'
										style={{ width: '100%' }}
										min={rec.min}
										max={rec.max}
										step={rec.step}
									/>
								) : (
									<Select
										style={{ width: '100%', textAlign: 'left' }}
										placeholder='Chọn bậc'
										options={rec.bac?.map((item) => ({
											key: item.order,
											value: item.order,
											label: item.ten,
										}))}
									/>
								)}
							</Form.Item>
						)}
					</>
				) : null,
		},
	];

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
						<Descriptions.Item label='Mã chương trình'>{recChuongTrinhDaoTao?.ma}</Descriptions.Item>
						<Descriptions.Item label='Tên chương trình'>{recChuongTrinhDaoTao?.ten}</Descriptions.Item>
						<Descriptions.Item label='Trình độ'>{recChuongTrinhDaoTao?.trinhDoDaoTao?.ten}</Descriptions.Item>
						<Descriptions.Item label='Ngành'>{recChuongTrinhDaoTao?.nganh?.ten}</Descriptions.Item>
					</Descriptions>

					<Col xs={24} md={12}>
						<Form.Item name='maLoaiChungChi' label='Loại chứng chỉ' rules={[...rules.required]}>
							<SelectLoaiChungChi selectMa onChange={() => setMaChungChiSelected([])} />
						</Form.Item>
					</Col>

					{maLoaiChungChi ? (
						<Col span={24} className='ant-form-item-label'>
							<label className='ant-form-item-required'>Danh sách chứng chỉ</label>
							<TableStaticData
								columns={columns}
								data={danhSachChungChi}
								size='small'
								addStt
								otherProps={{
									scroll: { y: 380 },
									pagination: false,
									rowKey: (rec: ChungChi.IRecord) => rec.ma,
									rowSelection: {
										type: 'checkbox',
										selectedRowKeys: maChungChiSelected ?? [],
										onChange: (selectedRowKeys: string[]) => setMaChungChiSelected(selectedRowKeys),
										columnWidth: 40,
									},
								}}
							/>
						</Col>
					) : null}
				</Row>

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

export default FormChuanDauRa;
