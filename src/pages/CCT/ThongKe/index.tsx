import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { highlightColor, primaryColor } from '@/services/base/constant';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	BarChartOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	PieChartOutlined,
	RiseOutlined,
	TeamOutlined,
	ThunderboltOutlined,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Progress, Row, Space, Spin, Tag, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useModel } from 'umi';

const { Text } = Typography;

const COLORS = {
	primary: primaryColor,
	highlight: highlightColor,
	success: '#10b981',
	warning: '#f59e0b',
	textDark: '#1f2937',
	textGray: '#6b7280',
	border: '#f0f0f0',
	bgLight: '#f8fafc',
	white: '#ffffff',
	gradientStart: '#f0f9ff',
	gradientEnd: '#e6f0fa',
	participant: '#3b82f6',
	organizer: '#8b5cf6',
	leader: '#ec489a',
};

const styles = {
	statCard: {
		borderRadius: 20,
		boxShadow: '0 8px 20px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
		border: 'none',
		transition: 'all 0.3s ease',
		overflow: 'hidden',
		position: 'relative' as const,
		background: COLORS.white,
	},
	customCard: {
		borderRadius: 20,
		border: `1px solid ${COLORS.border}`,
		background: COLORS.white,
		boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
		transition: 'transform 0.2s, box-shadow 0.2s',
		overflow: 'hidden',
	},
	gradientCard: {
		borderRadius: 20,
		background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1e3a8a 100%)`,
		color: COLORS.white,
		border: 'none',
		boxShadow: '0 12px 24px rgba(19, 77, 139, 0.2)',
	},
	iconWrapper: (bgColor: string) => ({
		padding: 10,
		borderRadius: 16,
		background: `${bgColor}15`,
		color: bgColor,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 20,
	}),
};

const ThongKeCCT = () => {
	const {
		loadingThoiGianDuyet,
		dataThongKeThoiGianDuyet,
		thongKeThoiGianDuyetModel,

		loadingTiLeHoanThanh,
		dataThongKeTiLeHoanThanh,
		thongKeTiLeHoanThanhModel,

		loadingPhanBoLevel,
		dataThongKePhanBoLevel,
		thongKePhanBoLevelModel,

		loadingPhanBoVali,
		dataThongKePhanBoVali,
		thongKeTiLePhanBoValiModel,

		loadingHeatmap,
		dataThongKeHeatmap,
		thongKeHeatmapModel,

		loadingPhanBoHoatDong,
		dataThongKePhanBoHoatDong,
		thongKePhanBoHoatDongModel,

		loadingPhanBoVaiTro,
		dataThongKePhanBoVaiTro,
		thongKePhanBoVaiTroModel,

		loadingSinhVien,
		dataThongKeSinhVien,
		thongKeSinhVienModel,

		loadingTopHoatDong,
		dataThongKeTopHoatDong,
		thongKeTopHoatDongModel,
	} = useModel('cct.activityoutcome');

	useEffect(() => {
		const fetchAll = async () => {
			try {
				await Promise.all([
					thongKeThoiGianDuyetModel(),
					thongKeTiLeHoanThanhModel(),
					thongKePhanBoLevelModel(),
					thongKeTiLePhanBoValiModel(),
					thongKeHeatmapModel(),
					thongKePhanBoHoatDongModel(),
					thongKePhanBoVaiTroModel(),
					thongKeSinhVienModel(),
					thongKeTopHoatDongModel(),
				]);
			} catch (error) {
				console.error('Fetch statistics error:', error);
			}
		};

		fetchAll();
	}, []);

	const funnelData = useMemo(() => {
		if (!dataThongKeTiLeHoanThanh) return [0, 0, 0];
		return [
			dataThongKeTiLeHoanThanh.totalRegistered || 0,
			dataThongKeTiLeHoanThanh.hasEvidence || 0,
			dataThongKeTiLeHoanThanh.totalApproved || 0,
			dataThongKeTiLeHoanThanh.evidenceRate || 0,
			dataThongKeTiLeHoanThanh.approvalRate || 0,
		];
	}, [dataThongKeTiLeHoanThanh]);

	const levelData = useMemo(() => {
		if (!dataThongKePhanBoLevel) return { series: [0, 0, 0, 0], labels: ['Lvl 1', 'Lvl 2', 'Lvl 3', 'Lvl 4'] };
		return {
			series: dataThongKePhanBoLevel?.map((l: any) => l.count || 0),
			labels: dataThongKePhanBoLevel?.map((l: any) => l.name || l.code),
		};
	}, [dataThongKePhanBoLevel]);

	const validationData = useMemo(() => {
		if (!dataThongKePhanBoVali) return { series: [0, 0, 0], labels: ['Verified', 'Endorsed', 'Featured'] };
		return {
			series: dataThongKePhanBoVali?.map((v: any) => v.count || 0),
			labels: dataThongKePhanBoVali?.map((v: any) => v.validation),
		};
	}, [dataThongKePhanBoVali]);

	const attributeData = useMemo(() => {
		if (!dataThongKeHeatmap) return [0, 0, 0, 0, 0];

		const attrMap = new Map<string, number>();

		dataThongKeHeatmap.forEach((attr: any) => {
			const prev = attrMap.get(attr.code) || 0;
			attrMap.set(attr.code, prev + (attr.count || 0));
		});

		return ['E', 'X', 'C', 'E', 'L'].map((code) => attrMap.get(code) || 0);
	}, [dataThongKeHeatmap]);

	const roleData = useMemo(() => {
		if (!dataThongKePhanBoVaiTro) return { series: [0, 0, 0], labels: ['Participant', 'Organizer', 'Leader'] };
		return {
			series: dataThongKePhanBoVaiTro?.map((r: any) => r.count || 0),
			labels: dataThongKePhanBoVaiTro?.map((r: any) => r.name || r.code),
		};
	}, [dataThongKePhanBoVaiTro]);

	const topActivitiesData = useMemo(() => {
		if (!dataThongKeTopHoatDong) return { names: [], counts: [] };
		const top5 = dataThongKeTopHoatDong?.slice(0, 5);
		return {
			names: top5.map((item: any) => item.activity?.name?.substring(0, 20) || 'Unknown'),
			counts: top5.map((item: any) => item.count || 0),
		};
	}, [dataThongKeTopHoatDong]);

	const activityDistributionData = useMemo(() => {
		if (!dataThongKePhanBoHoatDong || dataThongKePhanBoHoatDong.length === 0) {
			return { series: [], labels: [] };
		}

		const sorted = [...dataThongKePhanBoHoatDong].sort((a, b) => b.count - a.count);

		let series = sorted.map((item) => item.count);
		let labels = sorted.map((item) => (item.name?.length > 20 ? `${item.name.substring(0, 18)}...` : item.name));

		return { series, labels };
	}, [dataThongKePhanBoHoatDong]);

	const activityColumns: IColumn<any>[] = [
		{
			title: 'Activity Name',
			dataIndex: 'name',
			width: 250,
		},
		{
			title: 'Count',
			dataIndex: 'count',
			width: 120,
			render: (count: number) => (
				<Text strong style={{ color: COLORS.primary }}>
					{count.toLocaleString()}
				</Text>
			),
		},
		{
			title: 'Percentage (%)',
			dataIndex: 'percentage',
			width: 180,
			render: (percentage: number) => (
				<Progress
					percent={percentage}
					size='small'
					strokeColor={COLORS.primary}
					format={() => `${percentage?.toFixed(1) || 0}%`}
				/>
			),
		},
	];

	const ROLE_ICONS: Record<string, any> = {
		participant: <UserOutlined />,
		organizer: <TeamOutlined />,
		leader: <TrophyOutlined />,
	};

	const ROLE_COLORS: Record<string, string> = {
		participant: COLORS.participant,
		organizer: COLORS.organizer,
		leader: COLORS.leader,
	};

	const roleColumns: IColumn<any>[] = [
		{
			title: 'Role',
			dataIndex: 'code',
			width: 200,
			render: (code: string, record: any) => {
				const roleName = record.name || code;
				const color = ROLE_COLORS[code?.toLowerCase()] || COLORS.primary;
				const icon = ROLE_ICONS[code?.toLowerCase()] || <UserOutlined />;
				return (
					<Tag color={color} style={{ padding: '4px 12px', borderRadius: 20 }}>
						<Space size={6}>
							{icon}
							<span>{roleName}</span>
						</Space>
					</Tag>
				);
			},
		},
		{
			title: 'Count',
			dataIndex: 'count',
			align: 'center',
			width: 90,
			render: (count: number) => (
				<Text strong style={{ fontSize: 16, color: COLORS.primary }}>
					{count?.toLocaleString() || 0}
				</Text>
			),
		},
		{
			title: 'Percentage',
			dataIndex: 'percentage',
			width: 120,
			render: (percentage: number) => (
				<Progress
					percent={percentage || 0}
					strokeColor={{
						'0%': COLORS.participant,
						'100%': COLORS.leader,
					}}
					format={() => `${percentage?.toFixed(1) || 0}%`}
				/>
			),
		},
	];

	const commonOptions = {
		chart: {
			toolbar: { show: false },
			fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
			animations: { enabled: true, easing: 'easeinout', speed: 800 },
		},
		states: { hover: { filter: { type: 'darken', value: 0.95 } } },
		tooltip: { theme: 'light', style: { fontSize: '12px' } },
	};

	const funnelOptions = {
		...commonOptions,
		chart: { ...commonOptions.chart, type: 'bar' },
		plotOptions: {
			bar: {
				borderRadius: 8,
				horizontal: true,
				distributed: true,
				barHeight: '55%',
				dataLabels: { position: 'top' },
			},
		},
		dataLabels: { enabled: true, formatter: (val: number) => `${val}`, offsetX: 20, style: { fontWeight: 600 } },
		colors: [COLORS.primary, '#3b82f6', COLORS.success],
		xaxis: {
			categories: ['Registered', 'Evidence Submitted', 'Approved', 'Evidence Rate', 'Approval Rate'],
			labels: { style: { fontWeight: 500 } },
		},
		grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: false } } },
		legend: { show: false },
	};

	const donutOptions = (labels: string[], colors: string[]) => ({
		...commonOptions,
		labels,
		colors,
		stroke: { show: false, width: 0 },
		legend: {
			position: 'bottom',
			horizontalAlign: 'center' as const,
			fontSize: '12px',
			markers: { radius: 8, width: 10, height: 10 },
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
					labels: {
						show: true,
						total: { show: true, label: 'Total', fontSize: '14px', fontWeight: 600, color: COLORS.textDark },
						value: { fontSize: '20px', fontWeight: 'bold', color: COLORS.primary },
					},
				},
			},
		},
	});

	const attributeOptions = {
		...commonOptions,
		chart: { ...commonOptions.chart, type: 'radar' },
		colors: [COLORS.highlight],
		stroke: { width: 2, colors: [COLORS.highlight] },
		fill: { opacity: 0.15, colors: [COLORS.highlight] },
		markers: { size: 4, colors: [COLORS.highlight], strokeColors: COLORS.white, strokeWidth: 2 },
		xaxis: {
			categories: ['E', 'X', 'C', 'E', 'L'],
			labels: { style: { fontWeight: 500, fontSize: '12px' } },
		},
		yaxis: { show: false, max: Math.max(...attributeData, 100) },
		grid: { show: true, borderColor: '#e2e8f0', padding: { top: 10, bottom: 10 } },
	};

	const barOptions = {
		...commonOptions,
		plotOptions: { bar: { borderRadius: 8, columnWidth: '50%', horizontal: false, dataLabels: { position: 'top' } } },
		xaxis: {
			categories: topActivitiesData.names.length ? topActivitiesData.names : ['No Data'],
			labels: { rotate: -15, style: { fontWeight: 500 } },
		},
		colors: [COLORS.primary],
		grid: { borderColor: '#f1f5f9', yaxis: { lines: { show: true } } },
		tooltip: { y: { formatter: (val: number) => `${val} records` } },
	};

	const activityDonutOptions = {
		...commonOptions,
		labels: activityDistributionData.labels,
		colors: ['#134d8b', '#3b82f6', '#8b5cf6', '#ec489a', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6b7280'],
		stroke: { show: false, width: 0 },
		formatter: (name: string, opts: any) => {
			let percent = opts?.w?.globals?.seriesPercent?.[opts.seriesIndex];

			if (Array.isArray(percent)) {
				percent = percent[0];
			}

			percent = Number(percent);

			return `${name} (${isNaN(percent) ? 0 : percent.toFixed(1)}%)`;
		},
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng số',
							fontSize: '13px',
							fontWeight: 600,
							color: COLORS.textDark,
							formatter: () => {
								const total = activityDistributionData.series.reduce((a, b) => a + b, 0);
								return `${total?.toLocaleString() || 0}`;
							},
						},
						value: { fontSize: '18px', fontWeight: 'bold', color: COLORS.primary },
					},
				},
			},
		},
		tooltip: {
			y: { formatter: (val: number) => `${val?.toLocaleString() || 0} hoạt động` },
		},
	};

	const roleDonutOptions = {
		...commonOptions,
		labels: roleData.labels,
		colors: [COLORS.participant, COLORS.organizer, COLORS.leader],
		stroke: { show: false, width: 0 },
		legend: {
			position: 'bottom',
			horizontalAlign: 'center' as const,
			fontSize: '13px',
			markers: { radius: 8, width: 12, height: 12 },
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Total',
							fontSize: '14px',
							fontWeight: 600,
							color: COLORS.textDark,
							formatter: () => {
								const total = roleData.series.reduce((a, b) => a + b, 0);
								return total?.toLocaleString() || '0';
							},
						},
						value: { fontSize: '22px', fontWeight: 'bold', color: COLORS.primary },
					},
				},
			},
		},
		tooltip: {
			y: { formatter: (val: number) => `${val?.toLocaleString() || 0} participation` },
		},
	};

	const CustomCard = ({ title, icon, children, height = 'auto', extra = null, loading = false }: any) => (
		<Card
			title={
				<Space size={12}>
					<Avatar
						shape='square'
						size={32}
						style={{
							background: `${COLORS.primary}10`,
							color: COLORS.primary,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{icon}
					</Avatar>
					<span style={{ fontWeight: 600, fontSize: '16px', color: COLORS.textDark }}>{title}</span>
				</Space>
			}
			extra={extra}
			variant='outlined'
			style={styles.customCard}
			headStyle={{ borderBottom: `1px solid ${COLORS.border}`, padding: '16px 24px' }}
			bodyStyle={{ padding: '20px 24px', height: height }}
		>
			<Spin spinning={loading}>{children}</Spin>
		</Card>
	);

	const StatCard = ({ title, value, suffix, icon, color, trend, trendValue, loading = false }: any) => (
		<Card style={styles.statCard} hoverable>
			<Spin spinning={loading}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<div style={{ flex: 1 }}>
						<Text type='secondary' style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>
							{title}
						</Text>
						<div style={{ marginTop: 8, marginBottom: 4 }}>
							<Text style={{ fontSize: 32, fontWeight: 700, color: COLORS.textDark }}>
								{value?.toLocaleString() || 0}
							</Text>
							{suffix && (
								<Text style={{ fontSize: 16, fontWeight: 500, color: COLORS.textGray, marginLeft: 4 }}>{suffix}</Text>
							)}
						</div>
						{trend && (
							<Space size={4} style={{ marginTop: 8 }}>
								{trend === 'up' ? (
									<ArrowUpOutlined style={{ color: COLORS.success, fontSize: 12 }} />
								) : (
									<ArrowDownOutlined style={{ color: COLORS.highlight, fontSize: 12 }} />
								)}
								<Text
									style={{ fontSize: 13, color: trend === 'up' ? COLORS.success : COLORS.highlight, fontWeight: 500 }}
								>
									{trendValue}
								</Text>
								<Text type='secondary' style={{ fontSize: 12 }}>
									vs last month
								</Text>
							</Space>
						)}
					</div>
					<div style={styles.iconWrapper(color)}>{icon}</div>
				</div>
			</Spin>
		</Card>
	);

	return (
		<div style={{ marginTop: 12 }}>
			<Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
				<Col xs={24} sm={12} lg={6}>
					<StatCard
						title='Students Using System'
						value={dataThongKeSinhVien?.totalStudents || 0}
						icon={<UserOutlined />}
						color={COLORS.primary}
						loading={loadingSinhVien}
					/>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<StatCard
						title='Approved Records'
						value={dataThongKeTiLeHoanThanh?.totalApproved || 0}
						icon={<CheckCircleOutlined />}
						color={COLORS.success}
						loading={loadingTiLeHoanThanh}
					/>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<StatCard
						title='Avg. Turnaround'
						value={dataThongKeThoiGianDuyet?.averageTurnaroundHours?.toFixed(1) || 0}
						suffix='hours'
						icon={<ClockCircleOutlined />}
						color={COLORS.warning}
						loading={loadingThoiGianDuyet}
					/>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<StatCard
						title='Avg Records / Student'
						value={dataThongKeSinhVien?.averageRecordsPerStudent?.toFixed(1) || 0}
						suffix='rec/std'
						icon={<ThunderboltOutlined />}
						color={COLORS.highlight}
						loading={loadingSinhVien}
					/>
				</Col>
			</Row>

			<Row gutter={[24, 24]}>
				<Col xs={24}>
					<Row gutter={[24, 24]}>
						<Col span={24} md={16}>
							<CustomCard title='Student Funnel Analysis' icon={<BarChartOutlined />} loading={loadingTiLeHoanThanh}>
								<ReactApexChart
									options={{
										...commonOptions,
										chart: {
											...commonOptions.chart,
											type: 'bar',
											toolbar: { show: false },
										},

										plotOptions: {
											bar: {
												borderRadius: 8,
												horizontal: true,
												distributed: true,
												barHeight: '55%',
												dataLabels: { position: 'top' },
											},
										},

										colors: [COLORS.primary, '#F7981D', COLORS.success],

										dataLabels: {
											enabled: true,
											formatter: (val: number) => `${val}`,
											offsetX: 20,
											style: {
												fontWeight: 600,
												colors: ['#1e293b'],
											},
										},

										xaxis: {
											categories: ['Registered', 'Evidence Submitted', 'Approved'],
											labels: { style: { fontWeight: 500 } },
										},

										grid: {
											borderColor: '#f1f5f9',
											xaxis: { lines: { show: false } },
										},

										legend: { show: false },
									}}
									series={[
										{
											data: [
												dataThongKeTiLeHoanThanh?.totalRegistered || 0,
												dataThongKeTiLeHoanThanh?.hasEvidence || 0,
												dataThongKeTiLeHoanThanh?.totalApproved || 0,
											],
										},
									]}
									type='bar'
									height={280}
								/>

								<div
									style={{
										marginTop: 16,
										display: 'flex',
										gap: 12,
									}}
								>
									<div
										style={{
											flex: 1,
											background: '#f8fafc',
											padding: '10px 12px',
											borderRadius: 8,
											textAlign: 'center',
										}}
									>
										<div style={{ fontSize: 12, color: '#64748b' }}>Evidence Rate</div>
										<div
											style={{
												fontSize: 18,
												fontWeight: 700,
												color: '#F7981D',
											}}
										>
											{dataThongKeTiLeHoanThanh?.evidenceRate || 0}%
										</div>
									</div>

									<div
										style={{
											flex: 1,
											background: '#f8fafc',
											padding: '10px 12px',
											borderRadius: 8,
											textAlign: 'center',
										}}
									>
										<div style={{ fontSize: 12, color: '#64748b' }}>Approval Rate</div>
										<div
											style={{
												fontSize: 18,
												fontWeight: 700,
												color: COLORS.success,
											}}
										>
											{dataThongKeTiLeHoanThanh?.approvalRate || 0}%
										</div>
									</div>
								</div>
							</CustomCard>
						</Col>
						<Col xs={24} md={8}>
							<CustomCard
								title='Competency Attributes'
								icon={<RiseOutlined style={{ color: COLORS.highlight }} />}
								loading={loadingHeatmap}
							>
								{attributeData.every((v) => v === 0) ? (
									<div style={{ textAlign: 'center', padding: 60 }}>No data available</div>
								) : (
									<ReactApexChart
										options={attributeOptions as any}
										series={[{ name: 'Score', data: attributeData }]}
										type='radar'
										height={320}
									/>
								)}
							</CustomCard>

							{/* <Card style={styles.gradientCard}>
							{(() => {
								const TARGET = 4;
								const avg = dataThongKeSinhVien?.averageRecordsPerStudent || 0;

								const rawPercent = (avg / TARGET) * 100;
								const percent = Math.min(rawPercent, 100);
								const overPercent = rawPercent > 100 ? rawPercent - 100 : 0;

								return (
									<>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'flex-start',
												marginBottom: 16,
											}}
										>
											<div>
												<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>
													Average Coverage
												</Text>

												<div
													style={{
														fontSize: 36,
														fontWeight: 800,
														color: 'white',
														lineHeight: 1.2,
														marginTop: 8,
														display: 'flex',
														alignItems: 'center',
														gap: 8,
													}}
												>
													{percent.toFixed(0)}
													<Text style={{ fontSize: 18, fontWeight: 500, color: 'white' }}>%</Text>

													{overPercent > 0 && (
														<Tag
															color='gold'
															style={{
																borderRadius: 20,
																padding: '2px 10px',
																fontWeight: 600,
															}}
														>
															+{overPercent.toFixed(0)}%
														</Tag>
													)}
												</div>
											</div>

											<Avatar
												shape='circle'
												size={44}
												style={{ background: 'rgba(255,255,255,0.2)', color: COLORS.white }}
											>
												<TeamOutlined />
											</Avatar>
										</div>

										<Progress
											percent={percent}
											showInfo={false}
											strokeColor='white'
											trailColor='rgba(255,255,255,0.2)'
											strokeWidth={10}
										/>

										<div
											style={{
												marginTop: 20,
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Tag
												color='rgba(255,255,255,0.2)'
												style={{
													border: 'none',
													color: 'white',
													borderRadius: 20,
													padding: '4px 12px',
												}}
											>
												<FileDoneOutlined /> Target: {TARGET} rec/std
											</Tag>

											<Tooltip title={`${avg.toFixed(1)} records per student on average`}>
												<EyeOutlined style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} />
											</Tooltip>
										</div>
									</>
								);
							})()}
						</Card> */}
						</Col>
						<Col xs={24} md={12}>
							<CustomCard
								title='Level Distribution'
								icon={<PieChartOutlined style={{ color: '#3b82f6' }} />}
								loading={loadingPhanBoLevel}
							>
								{levelData.series.every((v) => v === 0) ? (
									<div style={{ textAlign: 'center', padding: 60 }}>No data available</div>
								) : (
									<ReactApexChart
										options={donutOptions(levelData.labels, [COLORS.primary, '#3b82f6', '#8b5cf6', '#ec489a']) as any}
										series={levelData.series}
										type='donut'
										height={280}
									/>
								)}
							</CustomCard>
						</Col>
						<Col xs={24} md={12}>
							<CustomCard
								title='Impact'
								icon={<CheckCircleOutlined style={{ color: COLORS.success }} />}
								loading={loadingPhanBoVali}
							>
								{validationData.series.every((v) => v === 0) ? (
									<div style={{ textAlign: 'center', padding: 60 }}>No data available</div>
								) : (
									<ReactApexChart
										options={
											donutOptions(validationData.labels, [COLORS.success, COLORS.warning, COLORS.highlight]) as any
										}
										series={validationData.series}
										type='donut'
										height={280}
									/>
								)}
							</CustomCard>
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<CustomCard
						title='Top High-Impact Activities'
						icon={<TrophyOutlined style={{ color: COLORS.warning }} />}
						extra={
							<Tag color='gold' style={{ borderRadius: 20 }}>
								Most Engaged
							</Tag>
						}
						loading={loadingTopHoatDong}
					>
						{topActivitiesData.counts.length === 0 ? (
							<div style={{ textAlign: 'center', padding: 60 }}>No data available</div>
						) : (
							<ReactApexChart
								options={barOptions}
								series={[{ name: 'Records', data: topActivitiesData.counts }]}
								type='bar'
								height={320}
							/>
						)}
					</CustomCard>
				</Col>

				<Col span={24}>
					<CustomCard
						title='Distribution by Activity Type'
						icon={<PieChartOutlined style={{ color: COLORS.primary }} />}
						loading={loadingPhanBoHoatDong}
					>
						{!dataThongKePhanBoHoatDong || dataThongKePhanBoHoatDong.length === 0 ? (
							<div style={{ textAlign: 'center', padding: 60, color: COLORS.textGray }}>
								<PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
								<br />
								No statistical data available
							</div>
						) : (
							<Row gutter={[24, 24]}>
								<Col xs={24} lg={10}>
									<ReactApexChart
										options={activityDonutOptions as any}
										series={activityDistributionData.series}
										type='donut'
										height={400}
									/>
								</Col>
								<Col xs={24} lg={14}>
									<TableStaticData
										addStt
										columns={activityColumns}
										data={_.orderBy(dataThongKePhanBoHoatDong, ['count'], ['desc'])}
										size='middle'
										otherProps={{ scroll: { y: 400 }, pagination: false }}
									/>
								</Col>
							</Row>
						)}
					</CustomCard>
				</Col>

				<Col span={24}>
					<CustomCard
						title='Distribution by Participation Role'
						icon={<TeamOutlined style={{ color: COLORS.primary }} />}
						loading={loadingPhanBoVaiTro}
					>
						{!dataThongKePhanBoVaiTro || dataThongKePhanBoVaiTro.length === 0 ? (
							<div style={{ textAlign: 'center', padding: 60, color: COLORS.textGray }}>
								<TeamOutlined style={{ fontSize: 48, marginBottom: 16 }} />
								<br />
								No role statistics available
							</div>
						) : (
							<Row gutter={[24, 24]}>
								<Col xs={24} lg={10}>
									<ReactApexChart
										options={roleDonutOptions as any}
										series={roleData.series}
										type='donut'
										height={400}
									/>
								</Col>

								<Col xs={24} lg={14}>
									<TableStaticData
										addStt
										columns={roleColumns}
										data={_.orderBy(dataThongKePhanBoVaiTro, ['count'], ['desc'])}
										size='middle'
										otherProps={{ scroll: { y: 400 }, pagination: false }}
									/>
								</Col>
							</Row>
						)}
					</CustomCard>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKeCCT;
