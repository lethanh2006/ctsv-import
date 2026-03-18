import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { DanhSachCaNhan } from './components/DanhSachCaNhan';

export type FormValues = Omit<QuyetDinhKhenThuong.IRecord, 'danhSachCaNhan'> & {
	danhSachCaNhan: Partial<Required<QuyetDinhKhenThuong.IRecord>['danhSachCaNhan'][number]>[];
};

export interface FormKhenThuongTheoQuyetDinhProps {
	getModel?: () => void;
	onFinishProps: (values: FormValues) => void;
}

export const FormKhenThuongTheoQuyetDinh = ({ onFinishProps }: FormKhenThuongTheoQuyetDinhProps) => {
	const intl = useIntl();
	const {
		edit,
		record,
		loading,
		visibleForm,
		setFormSubmiting,
		setVisibleForm,
		formSubmiting,
		// postModel,
		// putModel,
		// getModel: getModelQuyetDinhKhenThuong,
		setEdit,
		setIsView,
		isView,
	} = useModel('khenthuongkyluat.khenthuong.quyetdinhkhenthuong');

	// const getModel = getModelProps ?? getModelQuyetDinhKhenThuong;

	const [form] = useForm<FormValues>();

	useEffect(() => {
		if (edit || isView) {
			resetFieldsForm(form, visibleForm ? record : undefined);
		} else {
			resetFieldsForm(form);
		}

		if (!visibleForm) {
			setEdit(false);
			setIsView(false);
		}
	}, [record?._id, visibleForm, loading]);

	const onFinish = async (values: FormValues) => {
		try {
			setFormSubmiting(true);
			// const url = await buildUpLoadFile(values, 'fileDinhKem');
			setFormSubmiting(false);

			// const body: any = {
			// 	...values,
			// 	// fileDinhKem: url,
			// };
			onFinishProps?.(values);
			setVisibleForm(false);
			if (edit) {
				message.success(intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.message.updatesuccess' }));
			} else {
				message.success(intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.message.createsuccess' }));
			}
			// if (edit) {
			// 	await putModel(record?._id ?? '', body, getModel)
			// 		.then()
			// 		.catch((er) => console.log(er));
			// } else {
			// 	await postModel(body, getModel)
			// 		.then(() => resetFieldsForm(form))
			// 		.catch((er) => console.log(er));
			// }
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Card
			title={intl.formatMessage({
				id: isView
					? 'kyluatkhenthuong.quyetdinh.title.view'
					: edit
						? 'kyluatkhenthuong.quyetdinh.title.edit'
						: 'kyluatkhenthuong.quyetdinh.title.create',
			})}
			loading={loading}
		>
			<Form id='FormKhenThuongTheoDotKhenThuong' onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={12}>
					<Col span={24}>
						<Form.Item
							name='soQuyetDinh'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.soquyetdinh' })}
							rules={[...rules.required, ...rules.text, ...rules.length(255)]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.soquyetdinh' })}
							/>
						</Form.Item>
					</Col>
					{/* <Col span={24} md={12}>
						<Form.Item name='coQuanQuyetDinh' label='Cơ quan quyết định'>
							<Input placeholder='Cơ quan quyết định' />
						</Form.Item>
					</Col> */}
					<Col span={24} md={12}>
						<Form.Item
							name='ngayQuyetDinh'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.ngayquyetdinh' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.ngayquyetdinh' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='ngayKy' label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.ngayky' })}>
							<MyDatePicker
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.ngayky' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='nguoiKy' label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.nguoiky' })}>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.nguoiky' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='noiDung' label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.noidung' })}>
							<Input.TextArea
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.noidung' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='fileDinhKem'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.quyetdinh.id.filedinhkem' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile
								maxCount={1}
								otherProps={{
									maxCount: 1,
									multiple: false,
									disabled: isView,
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<DanhSachCaNhan form={form} isXemDanhSach={isView} />
					</Col>
				</Row>
			</Form>

			<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
				{!isView && (
					<Button
						form='FormKhenThuongTheoDotKhenThuong'
						loading={formSubmiting}
						style={{ marginRight: 8 }}
						htmlType='submit'
						type='primary'
					>
						{intl.formatMessage({ id: !edit ? 'global.button.themmoi' : 'global.button.luulai' })}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
						form.resetFields();
					}}
				>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			</Form.Item>
		</Card>
	);
};
