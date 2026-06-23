import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { Alert, Col, Form, Input, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';

const StepThongTin = (props: { isOngoing?: boolean; isEnded?: boolean; isPublished?: boolean }) => {
	const { isOngoing, isEnded, isPublished } = props;
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const form = Form.useFormInstance();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record } = useModel('kytucxa.dotdangkyktx');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const ngayChuyenVao = Form.useWatch('ngayChuyenVao', form);
	const disabledAll = isOngoing || isEnded || isPublished;
	const lockCoreInfo = isOngoing || isEnded || isPublished;

	return (
		<Row gutter={[12, 0]}>
			{isPublished && (
				<Col span={24}>
					<Alert
						message={t('kytucxa.dotdangky.message.publishedCannotEdit')}
						type='warning'
						showIcon
						style={{ marginBottom: 12 }}
					/>
				</Col>
			)}
			<Col span={24} md={12}>
				<Form.Item
					name='tenDot'
					label={t('kytucxa.dotdangky.tenDot')}
					rules={[...rules.required, ...rules.text, ...rules.length(250)]}
				>
					<Input disabled={lockCoreInfo} placeholder={t('kytucxa.dotdangky.nhapTenDot')} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='maHocKy' hidden rules={[...rules.required]}>
					<Input />
				</Form.Item>
				<Form.Item label={t('kytucxa.dotdangky.hocKy')}>
					<Input disabled value={recHocKy?.ten} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='thoiGianBatDau' label={t('kytucxa.dotdangky.thoiGianBatDau')} rules={[...rules.required]}>
					<MyDatePicker disabled={lockCoreInfo} format='DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='thoiGianKetThuc'
					label={t('kytucxa.dotdangky.thoiGianKetThuc')}
					dependencies={['thoiGianBatDau']}
					rules={[
						...rules.required,
						...rules.sauNgay(thoiGianBatDau, t('kytucxa.dotdangky.thoiGianBatDauLower')),
						{
							validator: async (_, value) => {
								if (isOngoing && value && dayjs(value).endOf('day').isBefore(dayjs())) {
									throw new Error(t('kytucxa.dotdangky.validation.endTimeAfterNow'));
								}
							},
						},
					]}
				>
					<MyDatePicker
						disabled={disabledAll}
						format='DD/MM/YYYY'
						disabledDate={(cur) => {
							if (thoiGianBatDau && dayjs(cur).isBefore(thoiGianBatDau, 'day')) return true;
							if (isOngoing && dayjs(cur).isBefore(dayjs(), 'day')) return true;
							return false;
						}}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='ngayChuyenVao'
					label={t('kytucxa.dotdangky.ngayChuyenVao')}
					rules={[
						...rules.required,
						{
							validator: async (_, value) => {
								if (thoiGianBatDau && value && dayjs(value).isBefore(dayjs(thoiGianBatDau).startOf('month'))) {
									throw new Error(
										intl.formatMessage(
											{ id: 'global.validation.sauNgay.before' },
											{ label: t('kytucxa.dotdangky.thoiGianBatDauLower') },
										),
									);
								}
							},
						},
					]}
				>
					<MyDatePicker
						disabled={disabledAll}
						pickerStyle='month'
						format='MM/YYYY'
						disabledDate={thoiGianBatDau ? (cur) => dayjs(cur).isBefore(thoiGianBatDau, 'month') : undefined}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='ngayChuyenRa'
					label={t('kytucxa.dotdangky.ngayChuyenRa')}
					dependencies={['ngayChuyenVao']}
					rules={[
						...rules.required,
						{
							validator: async (_, value) => {
								if (thoiGianBatDau && value && dayjs(value).isBefore(dayjs(thoiGianBatDau).startOf('month'))) {
									throw new Error(
										intl.formatMessage(
											{ id: 'global.validation.sauNgay.before' },
											{ label: t('kytucxa.dotdangky.thoiGianBatDauLower') },
										),
									);
								}
								if (ngayChuyenVao && value && dayjs(value).isBefore(dayjs(ngayChuyenVao).startOf('month'))) {
									throw new Error(
										intl.formatMessage(
											{ id: 'global.validation.sauNgay.before' },
											{ label: t('kytucxa.dotdangky.ngayChuyenVaoLower') },
										),
									);
								}
							},
						},
					]}
				>
					<MyDatePicker
						disabled={disabledAll}
						pickerStyle='month'
						format='MM/YYYY'
						disabledDate={(cur) => {
							if (thoiGianBatDau && dayjs(cur).isBefore(thoiGianBatDau, 'month')) return true;
							if (ngayChuyenVao && dayjs(cur).isBefore(ngayChuyenVao, 'month')) return true;
							return false;
						}}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='loaiDot' label={t('kytucxa.dotdangky.loaiDot')} rules={[...rules.required]}>
					<Select
						disabled={lockCoreInfo}
						options={[
							{ label: t('kytucxa.dotdangky.loaiDot.theoKhoa'), value: ELoaiDotDangKyKTX.THEO_KHOA },
							{ label: t('kytucxa.dotdangky.loaiDot.theoDanhSach'), value: ELoaiDotDangKyKTX.THEO_DANH_SACH },
						]}
						placeholder={t('kytucxa.dotdangky.chonLoaiDot')}
					/>
				</Form.Item>
			</Col>
			<Col xs={24}>
				<Form.Item name='ghiChu' label={t('kytucxa.dotdangky.ghiChu')} rules={[...rules.text, ...rules.length(2000)]}>
					<Input.TextArea disabled={disabledAll} rows={3} placeholder={t('kytucxa.dotdangky.nhapGhiChu')} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default StepThongTin;
