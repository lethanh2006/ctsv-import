import ViewDetailDiemRenLuyen from '@/pages/DiemRenLuyen/BieuMau/components/FormViewDetailDiemRenLuyen';
import type { BieuMau } from '@/services/KhaoSat/BieuMau/typing';
import { resetFieldsForm } from '@/utils/utils';
import {
	ArrowDownOutlined,
	ArrowLeftOutlined,
	ArrowUpOutlined,
	CloseOutlined,
	EyeOutlined,
	PlusCircleOutlined,
	PlusOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import Block from './Block';
import styles from './block.css';

const FormCauHinhBieuMau = (props: { onBack: () => void; getData?: () => void }) => {
	const { loading, record, edit, postModel, putModel, setRecord, visibleForm } = useModel('khaosat.bieumau');
	const [visibleView, setVisibleView] = useState<boolean>(false);
	const intl = useIntl();

	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		if (edit)
			putModel(
				record?._id ?? '',
				{ ...record, ...values },
				props?.getData
					? () => {
							if (props?.getData) props?.getData();
						}
					: undefined,
			)
				.then()
				.catch((er) => console.log(er));
		else
			postModel(
				{
					...record,
					...values,
				},
				props?.getData
					? () => {
							if (props?.getData) props?.getData();
						}
					: undefined,
			)
				.then()
				.catch((er) => console.log(er));
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		}
	}, [visibleForm]);

	return (
		<>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Button
					style={{ marginBottom: 12 }}
					icon={<EyeOutlined />}
					type={'primary'}
					onClick={() => {
						setRecord({
							danhSachKhoi: form?.getFieldValue('danhSachKhoi') ?? [],
						} as BieuMau.IRecord);
						setVisibleView(true);
					}}
				>
					{intl.formatMessage({ id: 'bieumau.action.preview' })}
				</Button>
				<Form.List
					name='danhSachKhoi'
					initialValue={record?.danhSachKhoi ?? []}
					rules={[
						{
							validator: async (validate, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(new Error(intl.formatMessage({ id: 'bieumau.error.itnhat1khoi' })));
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
											headStyle={{ padding: '0px 24px' }}
											styles={{ padding: '8px 24px' }}
											className={styles.block}
											title={
												<>
													<div style={{ float: 'left' }}>
														{intl.formatMessage({ id: 'bieumau.khoi' })} {index + 1}
													</div>
													<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
														<CloseOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => remove(field.name)}
														/>
													</Tooltip>
													<Tooltip title={intl.formatMessage({ id: 'bieumau.action.up' })}>
														<ArrowUpOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => move(field.name, field.name - 1)}
														/>
													</Tooltip>
													<Tooltip title={intl.formatMessage({ id: 'bieumau.action.down' })}>
														<ArrowDownOutlined
															style={{ float: 'right', marginTop: 4 }}
															onClick={() => move(field.name, field.name + 1)}
														/>
													</Tooltip>
												</>
											}
										>
											<Block form={form} field={{ ...field }} index={index} />
										</Card>
										<br />
									</div>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
										{intl.formatMessage({ id: 'bieumau.action.themkhoi' })}
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						);
					}}
				</Form.List>

				<div className='form-footer'>
					<Button
						icon={edit ? <SaveOutlined /> : <PlusCircleOutlined />}
						loading={loading}
						htmlType='submit'
						type='primary'
					>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={() => {
							const valueView = form.getFieldsValue(true);
							setRecord({ ...record, ...valueView });
							props.onBack();
						}}
					>
						{intl.formatMessage({ id: 'bieumau.action.quaylai' })}
					</Button>
				</div>
			</Form>

			<Modal
				open={visibleView}
				footer={null}
				onCancel={() => setVisibleView(false)}
				styles={{ padding: 0 }}
				width={900}
			>
				<ViewDetailDiemRenLuyen hideClose />
			</Modal>
		</>
	);
};

export default FormCauHinhBieuMau;
