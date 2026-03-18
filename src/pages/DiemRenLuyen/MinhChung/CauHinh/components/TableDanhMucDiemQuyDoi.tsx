import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, InputNumber, message, Modal, Popconfirm } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';

interface Iprop {
	value?: any;
	formProps: FormInstance;
}

const TableDanhMucDiemQuyDoi = (props: Iprop) => {
	const intl = useIntl();
	const { value, formProps } = props;
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<any>();
	const [edit, setEdit] = useState<boolean>(false);

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.danhmuc.noidung' }),
			dataIndex: 'tieuDe',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.danhmuc.diemquydoi' }),
			dataIndex: 'diemQuyDoi',
			align: 'center',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setRecord(rec);
							setEdit(true);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm
						title={intl.formatMessage({ id: 'minhchung.danhmuc.confirm.xoa' })}
						onConfirm={() => {
							const dataOrigin = formProps.getFieldValue('danhMucDiemQuyDoi') ?? [];
							formProps.setFieldsValue({
								danhMucDiemQuyDoi: dataOrigin?.filter((item: any) => item?.tieuDe !== rec?.tieuDe),
							});
						}}
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							type='link'
							danger
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				otherProps={{ size: 'small', pagination: false }}
				size={'small'}
				hasCreate
				addStt
				setShowEdit={(val) => {
					setVisibleForm(val);
					setRecord(undefined);
					setEdit(false);
				}}
				data={value}
				columns={columns}
			/>

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${intl.formatMessage({ id: 'minhchung.danhmuc.title' })}`}
				footer={null}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				destroyOnClose
			>
				<Form
					layout={'vertical'}
					onFinish={(values) => {
						const dataOrigin = formProps.getFieldValue('danhMucDiemQuyDoi') ?? [];

						if (dataOrigin?.find((item: any) => item?.tieuDe === values?.tieuDe) && !edit) {
							message.warning(intl.formatMessage({ id: 'minhchung.danhmuc.error.trungtieude' }));
							return;
						}

						if (edit) {
							dataOrigin?.forEach((item: any, index: number) => {
								if (item?.tieuDe === values?.tieuDe) {
									dataOrigin?.splice(index, index, { ...values });
								}
							});
						} else {
							dataOrigin?.push({ ...values });
						}

						formProps.setFieldsValue({ danhMucDiemQuyDoi: dataOrigin });
						setVisibleForm(false);
					}}
					initialValues={record}
				>
					<Form.Item name={'tieuDe'} label={intl.formatMessage({ id: 'minhchung.danhmuc.noidung' })}>
						<Input disabled={edit} placeholder={intl.formatMessage({ id: 'minhchung.danhmuc.noidung' })} />
					</Form.Item>
					<Form.Item name={'diemQuyDoi'} label={intl.formatMessage({ id: 'minhchung.danhmuc.diemquydoi' })}>
						<InputNumber
							placeholder={intl.formatMessage({ id: 'minhchung.danhmuc.nhapdiem' })}
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button
							onClick={() => {
								setVisibleForm(false);
							}}
						>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default TableDanhMucDiemQuyDoi;
