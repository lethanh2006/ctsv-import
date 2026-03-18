import { Button, Form, message, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { userUpdateBuoc } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import FormRender from '../../components/MauDon/FormRender';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import dayjs from 'dayjs';

const FormQuyTrinh = (props: { getData: () => void }) => {
	const {
		currentFormKhaiBao,
		setVisibleFormKhaiBaoQuyTrinh,
		current,
		dataQuyTrinh,
		editFormKhaiBao,
		recordFormKhaiBao,
	} = useModel('quytrinh.khaibaoquytrinh');
	const {
		record: recordSanPham,
		setRecord: setRecordSanPham,
		recordQuyTrinhForm,
	} = useModel('quytrinh.quanlyquytrinh');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const [formValues, setFormValues] = useState<any>({});
	const [loadingKhaiBao, setLoadingKhaiBao] = useState<boolean>(false);
	const [danhSachDonViXuLy, setDanhSachDonViXuLy] = useState<KhaiBaoQuyTrinh.IDonViXuLy[]>([]);
	const [form] = Form.useForm();
	const onFinish = async (values: any) => {
		try {
			setLoadingKhaiBao(true);
			const maBoPhanXuLy = values?.maBoPhanXuLy ?? current?.maBoPhanXuLy;
			for (const item in values) {
				const value = values[item];
				if (value?.fileList?.length) {
					values[item] = await buildUpLoadMultiFile(values, item);
				}
			}
			delete values.maBoPhanXuLy;

			const valuesFinal: any = {};
			const valuesForm = { ...(recordQuyTrinhForm?.thongTinKhaiBao ?? {}), ...values };
			Object.keys(valuesForm).map((item) => {
				const cauHinh = currentFormKhaiBao?.cauHinhLoaiHinh?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				const isDate = cauHinh?.kieuDuLieu === EKieuDuLieu.DATE;
				const isMonth = cauHinh?.kieuDuLieu === EKieuDuLieu.MONTH;
				valuesFinal[item] = {
					value:
						(isDate || isMonth) && valuesForm
							? dayjs(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY')
							: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});
			const payload = {
				thongTinKhaiBao: { ...recordSanPham?.thongTinKhaiBao, ...recordQuyTrinhForm?.thongTinKhaiBao, ...valuesFinal },
				maBoPhanXuLy: maBoPhanXuLy,
			};

			const res = await userUpdateBuoc(dataQuyTrinh?._id ?? '', current?.ma ?? '', payload);

			if (res) {
				message.success('Khai báo thành công');
				props?.getData();
				setVisibleFormKhaiBaoQuyTrinh(false);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingKhaiBao(false);
		}
	};
	useEffect(() => {
		if (dataQuyTrinh) {
			const currentBuocXuLy = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === current?.ma);
			if (currentBuocXuLy) {
				const arr: KhaiBaoQuyTrinh.IDonViXuLy[] = [];
				dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.map((val) => {
					if (currentBuocXuLy?.danhSachMaBoPhanXuLy?.includes(val?.ma)) {
						arr.push(val);
					}
				});
				setDanhSachDonViXuLy(arr);
			}
		}
	}, [dataQuyTrinh]);
	useEffect(() => {
		if (editFormKhaiBao && recordFormKhaiBao) {
			const recordFormKhaiBaoFinal: any = {};
			Object.keys(recordFormKhaiBao).map((key) => {
				const cauHinh = currentFormKhaiBao?.cauHinhLoaiHinh?.find((item) => item.ma === key);
				const isDate = cauHinh.kieuDuLieu === EKieuDuLieu.DATE;
				const isMonth = cauHinh.kieuDuLieu === EKieuDuLieu.MONTH;
				const khaiBao = recordFormKhaiBao[key];
				recordFormKhaiBaoFinal[key] = isDate || isMonth ? khaiBao?.split('/')?.reverse()?.join('-') : khaiBao;
			});

			form.setFieldsValue(recordFormKhaiBaoFinal);
		}
	}, [editFormKhaiBao, recordFormKhaiBao]);
	useEffect(() => {
		return () => {
			setRecordSanPham(undefined);
		};
	}, []);
	return (
		<Spin spinning={loadingKhaiBao}>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				labelCol={{ span: 24 }}
				form={form}
				onFinish={onFinish}
				layout={'vertical'}
			>
				<Row gutter={[12, 0]}>
					{currentFormKhaiBao?.cauHinhLoaiHinh?.map((item) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>
				{!current?.maBoPhanXuLy && (
					<Form.Item name={'maBoPhanXuLy'} label={'Bộ phận xử lý'} rules={[...rules.required]}>
						<Select
							style={{ width: '100%' }}
							placeholder={'Chọn bộ phận xử lý'}
							onChange={() => {}}
							options={danhSachDonViXuLy?.map((val) => {
								return {
									value: val?.ma,
									label: val?.ten,
								};
							})}
						/>
					</Form.Item>
				)}

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
						Khai báo
					</Button>
					<Button
						onClick={() => {
							setVisibleFormKhaiBaoQuyTrinh(false);
						}}
					>
						Đóng
					</Button>
				</div>
			</Form>
		</Spin>
	);
};
export default FormQuyTrinh;
