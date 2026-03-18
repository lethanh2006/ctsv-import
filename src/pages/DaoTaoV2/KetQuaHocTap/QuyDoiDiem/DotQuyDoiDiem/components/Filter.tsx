import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ETrangThaiDot } from '@/services/DaoTaoV2/constant';
import { Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import FormDotQuyDoiDiem from './Form';
import SelectDotQuyDoiDiem from './Select';

const FilterDotQuyDoi = () => {
	const {
		record: recDot,
		setRecord: setRecDot,
		danhSach: danhSachDot,
		handleEdit,
		visibleForm,
		setVisibleForm,
		getAllModel,
	} = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	return (
		<>
			<Space wrap style={{ marginBottom: 12 }}>
				<FilterHocKy isSetHocKy>
					<SelectDotQuyDoiDiem
						condition={{ trangThai: ETrangThaiDot.DA_BAN_HANH, maHocKy: recHocKy?.ma }}
						onChange={(val) => setRecDot(danhSachDot.find((item) => item._id === val))}
						value={recDot?._id}
						style={{ width: 200 }}
						isSetRecord
					/>
				</FilterHocKy>

				{recDot?.thoiGianBatDauLayYKien && recDot.thoiGianKetThuc ? (
					<a href='#!' onClick={() => handleEdit(recDot)}>
						Thời gian xin ý kiến phòng ban từ {dayjs(recDot.thoiGianBatDauLayYKien).format('DD/MM/YYYY')} đến{' '}
						{dayjs(recDot.thoiGianKetThucLayYKien).format('DD/MM/YYYY')}
					</a>
				) : null}
			</Space>

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
				styles={{ padding: 0 }}
				width={600}
			>
				<FormDotQuyDoiDiem
					title='đợt quy đổi điểm'
					getData={() => {
						getAllModel(undefined, undefined, { trangThai: ETrangThaiDot.DA_BAN_HANH, maHocKy: recHocKy?.ma });
					}}
				/>
			</Modal>
		</>
	);
};

export default FilterDotQuyDoi;
