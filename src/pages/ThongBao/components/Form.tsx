import FormWaiting from '@/components/Loading/FormWaiting';
import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import {
	EReceiverType,
	EVaiTroKhaoSat,
	LoaiDoiTuongThongBao,
	mapModuleKeyToSourceType,
	NotificationType,
	TenVaiTroKhaoSat,
} from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { buildUpLoadFile, buildUpLoadMultiFile } from '@/services/uploadFile';
import { currentRole } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, message, Modal, Row, Segmented, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTag from '../Tags/components/Select';
import GroupTagVaiTro from './GroupTagVaiTro';
import SelectKhoaSinhVien from './SelectKhoaSinhVien';
import SelectLopHanhChinhDebounce from './SelectLopHanhChinh';
import SelectLopHocPhanDebounce from './SelectLopHocPhan';
import SelectNganhCoSo from './SelectNganhCoSo';
import TableSelectUser from './TableSelect';

const FormThongBao = (props: any) => {
	const intl = useIntl();
	const { title, getData, notiType } = props;
	const [form] = Form.useForm();
	const { record, setFormSubmiting, setVisibleForm, edit, postModel, formSubmiting, visibleForm, putModel } =
		useModel('thongbao.thongbao');
	const { setDanhSachCanBo } = useModel('thongbao.nhansu');
	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<ThongBao.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<ThongBao.IUser[]>([]);
	const roles: EVaiTroKhaoSat[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) || EReceiverType.All;
	const loaiNguoiDung: EReceiverType = Form.useWatch('loaiNguoiDung', form);
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDanhSachCanBo([]);
		} else if (record?._id) form.setFieldsValue(record);
		else {
			setActiveKey(roles?.[0]);
			form.setFieldsValue({
				receiverType: EReceiverType.All,
				loaiNguoiDung: EReceiverType.All,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (formSubmiting) return;
		setFormSubmiting(true);
		try {
			FormWaiting(intl.formatMessage({ id: 'thongbao.form.handle.wait' }));
			const imageUrl = await buildUpLoadFile(values, 'imageUrl');
			const taiLieuDinhKem = await buildUpLoadMultiFile(values, 'taiLieuDinhKem');
			values.imageUrl = imageUrl;
			values.taiLieuDinhKem = taiLieuDinhKem;
			setFormSubmiting(false);

			if (receiverType !== EReceiverType.All) values.filter[`id${receiverType}`] = values.danhSachDoiTuong;
			delete values.danhSachDoiTuong;
			if (loaiNguoiDung === EReceiverType.User) {
				values.userList = [...danhSachNhanSu, ...danhSachSinhVien].map((item) => ({
					ssoId: item.ssoId,
					username: item.code,
					fullname: item.fullname,
					email: item.email,
					email365: item.email365,
				}));
				if (!values.userList?.length) {
					message.warning(intl.formatMessage({ id: 'thongbao.form.handle.chonnguoinhan' }));
					return;
				}
			}
			values.notificationInternal = false;

			values.type = notiType;
			values.sourceType = mapModuleKeyToSourceType[currentRole];
			delete values.loaiNguoiDung;

			if (edit) {
				putModel(record?._id ?? '', values, getData)
					.then()
					.catch((er) => console.log(er));
			} else {
				await postModel(values, () => {
					getData();
				})
					.then(() => {
						setDanhSachNhanSu([]);
						setDanhSachSinhVien([]);
					})
					.catch((er) => console.log(er));
			}
		} catch (er) {
			console.log(er);
		} finally {
			setFormSubmiting(false);
			Modal.destroyAll();
		}
	};

	return (
		<Card
			title={`${intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					{notiType === NotificationType.ONESIGNAL && (
						<Col span={24} md={6}>
							<Form.Item name='imageUrl' label={intl.formatMessage({ id: 'thongbao.form.id.avatar' })}>
								<UploadFile isAvatarSmall />
							</Form.Item>
						</Col>
					)}
					<Col span={24} md={notiType === NotificationType.ONESIGNAL ? 18 : 24}>
						<Row gutter={[12, 0]}>
							<Col span={notiType === NotificationType.ONESIGNAL ? 24 : 12}>
								<Form.Item
									name='title'
									label={intl.formatMessage({ id: 'thongbao.form.id.tieude' })}
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'thongbao.form.id.nhaptieude' })} />
								</Form.Item>
							</Col>
							{notiType === NotificationType.EMAIL && (
								<Col span={12}>
									<Form.Item
										name='idTagEmail'
										label={intl.formatMessage({ id: 'thongbao.form.id.nhandan' })}
										rules={[...rules.required]}
									>
										<SelectTag />
									</Form.Item>
								</Col>
							)}
							<Col span={24}>
								<Form.Item
									name='description'
									label={intl.formatMessage({ id: 'thongbao.form.id.mota' })}
									rules={[...rules.text, ...rules.length(500)]}
								>
									<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'thongbao.form.id.nhapmota' })} />
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							name='receiverType'
							label={intl.formatMessage({
								id:
									notiType === NotificationType.ONESIGNAL
										? 'thongbao.form.id.dtnhantb'
										: 'thongbao.form.id.dtnhanemail',
							})}
							rules={[...rules.required]}
						>
							<Select
								options={Object.entries(LoaiDoiTuongThongBao)
									.filter(([value]) => value !== EReceiverType.User)
									.map(([value, label]) => ({
										key: value,
										value,
										label,
									}))}
								placeholder={intl.formatMessage({ id: 'thongbao.form.id.nhomnguoinhan' })}
								onChange={() => {
									form.setFieldsValue({
										filter: { roles: [] },
										danhSachDoiTuong: [],
									});
									setDanhSachNhanSu([]);
									setDanhSachSinhVien([]);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name={['filter', 'roles']}
							label={intl.formatMessage({ id: 'thongbao.form.id.vaitro' })}
							rules={[...rules.required]}
						>
							<GroupTagVaiTro
								onChange={(arr) => {
									setActiveKey(
										arr?.length === 2 && loaiNguoiDung === EReceiverType.All ? EVaiTroKhaoSat.SINH_VIEN : arr?.[0],
									);
									if (!arr.includes(EVaiTroKhaoSat.SINH_VIEN)) setDanhSachSinhVien([]);
									if (!arr.includes(EVaiTroKhaoSat.NHAN_VIEN)) setDanhSachNhanSu([]);
								}}
								listVaiTro={
									[EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
										? [EVaiTroKhaoSat.SINH_VIEN]
										: receiverType === EReceiverType.Khoa
											? [EVaiTroKhaoSat.NHAN_VIEN]
											: undefined
								}
							/>
						</Form.Item>
					</Col>
					{roles?.length ? (
						<Col span={24} md={8}>
							<Form.Item name='loaiNguoiDung' label={intl.formatMessage({ id: 'thongbao.form.id.dsnguoidung' })}>
								<Segmented
									options={[
										{ value: EReceiverType.All, label: intl.formatMessage({ id: 'thongbao.form.id.tatca' }) },
										{ value: EReceiverType.User, label: intl.formatMessage({ id: 'thongbao.form.id.nguoidungcuthe' }) },
									]}
								/>
							</Form.Item>
						</Col>
					) : null}

					{/* Tùy chỉnh cho từng phân hệ */}
					{receiverType !== EReceiverType.All ? (
						<Col span={24}>
							<Form.Item name='danhSachDoiTuong' label={LoaiDoiTuongThongBao[receiverType]} rules={[...rules.required]}>
								{receiverType === EReceiverType.Khoa ? (
									<SelectDonVi multiple />
								) : receiverType === EReceiverType.KhoaSinhVien ? (
									<SelectKhoaSinhVien multiple />
								) : receiverType === EReceiverType.LopHanhChinh ? (
									<SelectLopHanhChinhDebounce multiple />
								) : receiverType === EReceiverType.LopHocPhan ? (
									<SelectLopHocPhanDebounce multiple />
								) : receiverType === EReceiverType.Nganh ? (
									<SelectNganhCoSo multiple />
								) : null}
							</Form.Item>
						</Col>
					) : null}

					{roles?.length ? (
						<>
							{loaiNguoiDung === EReceiverType.User ? (
								<Col span={24} style={{ marginBottom: 12 }}>
									<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
										{Object.values(EVaiTroKhaoSat).map((item) =>
											roles.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroKhaoSat[item]} /> : null,
										)}
									</Tabs>

									{activeKey === EVaiTroKhaoSat.SINH_VIEN ? (
										<TableSelectUser
											type={EVaiTroKhaoSat.SINH_VIEN}
											selectedUsers={danhSachSinhVien}
											setSelectedUsers={setDanhSachSinhVien}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
											receiverType={receiverType}
										/>
									) : activeKey === EVaiTroKhaoSat.NHAN_VIEN ? (
										<TableSelectUser
											type={EVaiTroKhaoSat.NHAN_VIEN}
											selectedUsers={danhSachNhanSu}
											setSelectedUsers={setDanhSachNhanSu}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
											receiverType={receiverType}
										/>
									) : null}
								</Col>
							) : null}
						</>
					) : null}

					<Col span={24}>
						<Form.Item
							name='content'
							label={intl.formatMessage({
								id:
									notiType === NotificationType.ONESIGNAL
										? 'thongbao.form.id.chitiettb'
										: 'thongbao.form.id.chitietemail',
							})}
							rules={[...rules.requiredHtml]}
						>
							<TinyEditor height={300} hideMenubar />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='taiLieuDinhKem' label={intl.formatMessage({ id: 'thongbao.form.id.tepdinhkem' })}>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='thoiGianHieuLuc' label={intl.formatMessage({ id: 'thongbao.form.id.hieuluctb' })}>
							<MyDatePicker />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: !edit ? 'global.button.themmoi' : 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongBao;
