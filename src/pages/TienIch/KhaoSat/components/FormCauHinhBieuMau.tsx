import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import { resetFieldsForm } from '@/utils/utils';
import {
	ArrowDownOutlined,
	ArrowLeftOutlined,
	ArrowUpOutlined,
	CloseOutlined,
	PlusCircleOutlined,
	PlusOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import Block from './Block';
import styles from './block.css';

const FormCauHinhBieuMau = (props: { onBack: () => void; getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const { formSubmiting, record, edit, postModel, putModel, setRecord, visibleForm, setVisibleForm } =
		useModel('tienich.bieumau');
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const cleanCauHoi = (cauHoi: any) => {
			const { loai } = cauHoi;
			return {
				...cauHoi,
				luaChon: [ELoaiCauHoiPublic.SINGLE_CHOICE, ELoaiCauHoiPublic.MULTIPLE_CHOICE].includes(loai)
					? cauHoi.luaChon
					: null,
				luaChonHang: [ELoaiCauHoiPublic.GRID_SINGLE_CHOICE, ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE].includes(loai)
					? cauHoi.luaChonHang
					: null,
				luaChonCot: [ELoaiCauHoiPublic.GRID_SINGLE_CHOICE, ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE].includes(loai)
					? cauHoi.luaChonCot
					: null,
				gioiHanDuoiTuyenTinh: [ELoaiCauHoiPublic.NUMERIC_RANGE, ELoaiCauHoiPublic.RENDER_INPUT_RATING].includes(loai)
					? cauHoi.gioiHanDuoiTuyenTinh
					: null,
				gioiHanTrenTuyenTinh: [ELoaiCauHoiPublic.NUMERIC_RANGE, ELoaiCauHoiPublic.RENDER_INPUT_RATING].includes(loai)
					? cauHoi.gioiHanTrenTuyenTinh
					: null,
			};
		};

		const updatedDanhSachKhoi = (values?.danhSachKhoi || []).map((khoi: any) => {
			const newKhoi = {
				...khoi,
				danhSachCauHoi: (khoi?.danhSachCauHoi || []).map(cleanCauHoi),
			};

			if (!khoi.isDanhGiaChuanDauRa) {
				delete newKhoi.cauHinh;
			} else {
				delete newKhoi.danhSachCauHoi;
			}

			return newKhoi;
		});

		const finalData = {
			...record,
			...values,
			danhSachKhoi: updatedDanhSachKhoi,
		};

		if (edit)
			putModel(
				record?._id ?? '',
				finalData,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		else
			postModel(finalData, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Form.List
				name='danhSachKhoi'
				initialValue={record?.danhSachKhoi ?? []}
				rules={[
					{
						validator: async (validate, names) => {
							if (!names || names.length < 1) {
								return Promise.reject(new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.vali' })));
							}
							return '';
						},
					},
				]}
			>
				{(fields, { add, remove, move }, { errors }) => {
					return (
						<>
							{fields.map((field, index) => (
								<div key={field.key}>
									<Card
										size='small'
										className={styles.block}
										title={
											<>
												<div style={{ float: 'left' }}>
													{intl.formatMessage({ id: 'questionsmanagement.cauhinh.khoi' })} {index + 1}
												</div>
												<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
													<CloseOutlined
														style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
														onClick={() => remove(field.name)}
													/>
												</Tooltip>
												<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.dichuyenlen' })}>
													<ArrowUpOutlined
														style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
														onClick={() => move(field.name, field.name - 1)}
													/>
												</Tooltip>
												<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.dichuyenxuong' })}>
													<ArrowDownOutlined
														style={{ float: 'right', marginTop: 4 }}
														onClick={() => move(field.name, field.name + 1)}
													/>
												</Tooltip>
											</>
										}
									>
										<Block field={{ ...field }} form={form} />
									</Card>
									<br />
								</div>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
									{intl.formatMessage({ id: 'questionsmanagement.cauhinh.themkhoi' })}
								</Button>
								<Form.ErrorList errors={errors} />
							</Form.Item>
						</>
					);
				}}
			</Form.List>

			<div className='form-footer'>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => {
						const valueView = form.getFieldsValue(true);
						setRecord({ ...record, ...valueView });
						props.onBack();
					}}
				>
					{intl.formatMessage({ id: 'questionsmanagement.cauhinh.quaylai' })}
				</Button>
				<Button
					icon={edit ? <SaveOutlined /> : <PlusCircleOutlined />}
					loading={formSubmiting}
					htmlType='submit'
					type='primary'
				>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormCauHinhBieuMau;
