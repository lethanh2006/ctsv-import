import UploadFile from '@/components/Upload/UploadFile';
import type { NamHoc } from '@/services/DaoTaoV2/NamHoc/NamHoc/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalChotKeHoach = (props: {
	visible?: boolean;
	onCancel: () => void;
	onOk: () => void;
	tongKhoaNganh?: number;
}) => {
	const { onOk, visible, onCancel, tongKhoaNganh } = props;
	const [form] = Form.useForm();
	const {
		record: recNam,
		formSubmiting,
		chotKeHoachNamHocModel,
		setFormSubmiting,
	} = useModel('daotaov2.namhoc.namhoc');

	useEffect(() => {
		form.setFieldsValue(recNam);
	}, [recNam?._id]);

	const onFinish = async (values: NamHoc.IRecord) => {
		if (!recNam?._id) return;
		if (!!values.url && typeof values.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'url')
				.then((url) => (values.url = url))
				.catch(() => (values.url = null))
				.finally(() => setFormSubmiting(false));
		}

		chotKeHoachNamHocModel(recNam?._id ?? '', values)
			.then(() => {
				onCancel();
				if (onOk) onOk();
			})
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			open={visible}
			onCancel={() => onCancel()}
			title='Chốt kế hoạch năm học'
			footer={null}
			maskClosable={false}
			width={600}
		>
			{!recNam?.daChotKeHoachNamHoc ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
						alignItems: 'center',
						marginBottom: 24,
					}}
				>
					<div style={{ color: 'orange', fontSize: 48 }}>
						<ExclamationCircleFilled />
					</div>
					<div>
						Xác nhận chốt kế hoạch năm học <b>{recNam?.ten}</b>?
					</div>
					<div>
						Tổng số khóa ngành trong năm: <span className='fw500'>{tongKhoaNganh}</span>
					</div>
				</div>
			) : null}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='url' label='File kế hoạch đã ký, đóng dấu'>
					<UploadFile drag />
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						Xác nhận
					</Button>
					<Button onClick={() => onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalChotKeHoach;
