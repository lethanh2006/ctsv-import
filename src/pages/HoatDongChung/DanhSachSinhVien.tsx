import formWaiting from '@/components/Loading/FormWaiting';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { importDanhSachSinhVien, importDanhSachSinhVienThamGia } from '@/services/HoatDongChung';
import { TrangThaiThamGia } from '@/services/HoatDongChung/constants';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import rules from '@/utils/rules';
import { DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Tabs } from 'antd';
import { useCallback, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormDanhSachSinhVien from './FormDanhSachSinhVien';

interface IProps {
	hoatDongCtsvId: string;
}

const DanhSachSinhVien = (props: IProps) => {
	const intl = useIntl();
	const { hoatDongCtsvId } = props;
	const { getModel, condition, page, limit, loading, deleteModel } = useModel('danhsachsinhvienhoatdong');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [currentTabs, setCurrentTabs] = useState<string>('dang-ky');

	const getData = async () => {
		try {
			getModel({
				hoatDongCtsvId: hoatDongCtsvId,
				trangThaiThamGia: currentTabs === 'tham-gia' ? TrangThaiThamGia.THAM_GIA : undefined,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleImportData = async (id: string, file: any) => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await importDanhSachSinhVien(id, file);
			if (res) {
				message.success('Nhập dữ liệu thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	const handleImportDataThamGia = async (id: string, file: any) => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await importDanhSachSinhVienThamGia(id, 'Tham gia', file);
			if (res) {
				message.success('Nhập dữ liệu thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	const column: IColumn<HoatDongChung.DanhSachSinhVienThamGia>[] = [
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.column.mssv' }),
			dataIndex: 'ma',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.column.hoten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.column.manganh' }),
			dataIndex: 'maNganh',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.column.tennganh' }),
			dataIndex: 'tenNganh',
			width: 250,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.column.thaotac' }),
			width: 80,
			align: 'center',
			fixed: 'right',
			render: (rec) => (
				<Popconfirm
					title={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.confirm.xoa' })}
					onConfirm={() =>
						deleteModel(rec._id, getData, {
							messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
						})
					}
				>
					<Button type='link' icon={<DeleteOutlined />} danger />
				</Popconfirm>
			),
		},
	];

	const FormSV = useCallback(
		() => <FormDanhSachSinhVien trangThai={currentTabs} hoatDongCtsvId={props.hoatDongCtsvId} getData={getData} />,
		[props.hoatDongCtsvId, currentTabs],
	);

	return (
		<>
			<Spin spinning={loading}>
				<TableBase
					params={{ hoatDongCtsvId: props.hoatDongCtsvId }}
					Form={FormSV}
					hideCard
					getData={getData}
					dependencies={[condition, limit, page, hoatDongCtsvId, currentTabs]}
					modelName={'danhsachsinhvienhoatdong'}
					columns={column}
					title={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.title' })}
					buttons={{ create: true, export: true }}
					otherButtons={[
						<>
							<ButtonExtend
								// type='primary'
								icon={<ImportOutlined />}
								onClick={() => {
									setVisibleImport(true);
								}}
							>
								{intl.formatMessage({ id: 'global.button.nhapdulieu' })}
							</ButtonExtend>
						</>,
					]}
				>
					<Tabs
						activeKey={currentTabs}
						onChange={(val) => {
							setCurrentTabs(val);
						}}
					>
						<Tabs.TabPane tab={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.khongthamgia' })} key='dang-ky' />
						<Tabs.TabPane tab={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.thamgia' })} key='tham-gia' />
					</Tabs>
				</TableBase>
			</Spin>
			<Modal
				open={visibleImport}
				onCancel={() => {
					setVisibleImport(false);
				}}
				title={intl.formatMessage({ id: 'global.button.nhapdulieu' })}
				footer={null}
				destroyOnClose
			>
				<Form
					onFinish={(values: any) => {
						try {
							if (currentTabs === 'dang-ky') {
								handleImportData(hoatDongCtsvId, values?.file?.fileList?.[0]?.originFileObj);
							} else {
								handleImportDataThamGia(hoatDongCtsvId, values?.file?.fileList?.[0]?.originFileObj);
							}
						} catch (e) {
							console.log(e);
						}
					}}
				>
					<Form.Item
						extra={
							<div>
								{intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.xemfile' })}{' '}
								<a
									target='_blank'
									href='https://ais.aisenote.com/slink/file/6686d9120b258de8a715f4f9/DSSV.xlsx'
									rel='noreferrer'
								>
									{intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.taiday' })}
								</a>
							</div>
						}
						name='file'
						rules={[...rules.required, ...rules.fileRequired]}
					>
						<UploadFile accept='.xlsx' drag />
					</Form.Item>
					<div className='form-footer'>
						<Form.Item>
							<Space>
								<Button type={'primary'} htmlType='submit'>
									{intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.button.luudulieu' })}
								</Button>
								<Button
									onClick={() => {
										setVisibleImport(false);
									}}
								>
									{intl.formatMessage({ id: 'global.button.dong' })}
								</Button>
							</Space>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default DanhSachSinhVien;
