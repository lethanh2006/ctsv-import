import bgcct from '@/assets/cct/bg-cct.png';
import Profile from '@/assets/cct/Profile.png';
import Skills from '@/assets/cct/Skills.png';
import { exportMyCCT } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { getFilenameHeader } from '@/utils/utils';
import { Button, Spin } from 'antd';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CardNoteMyCCT from './CardNote';
import './style.less';

export const getLevelSymbol = (levelName: string) => {
	const map: Record<string, number> = {
		Participant: 1,
		Contributor: 2,
		Leader: 3,
		'Impact Driver': 4,
	};

	return '▶'.repeat(map[levelName] || 0);
};

const ChiTietMyCCT = (props: any) => {
	const { setTrangThai, ssoId } = props;
	const intl = useIntl();
	const {
		getByIdModel,
		loading,
		record: recMyCCT,
		visibleForm,
		setVisibleForm,
		isView,
		setVisibleXuLy,
	} = useModel('cct.mycct');

	const [record, setRecord] = useState<{
		activities: MyCCT.IActivityMyCCT[];
		allCompetencies: string[];
		attributes: MyCCT.IAttributeMyCCT[];
		levelOfEngagement: MyCCT.ILevelOfEngagement[];
		myCCT: MyCCT.IRecord;
		awardsAndRecognition: ActivityOutCome.IRecord[];
	}>();
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const getData = () => {
		if (recMyCCT?.ssoId)
			getByIdModel(`ssoId/${recMyCCT?.ssoId}`, false).then((res: any) => {
				setRecord(res);
			});
	};

	useEffect(() => {
		if (visibleForm) {
			getData();
		}
	}, [visibleForm, recMyCCT?._id]);

	const sortedActivities = _(record?.activities).orderBy(['year', '_levelOrderForSorting'], ['asc', 'desc']).value();
	const selectedActivities = sortedActivities.filter((item) => record?.myCCT?.selectedActivities?.includes(item.id));

	const renderItem = (item: any) => {
		const content = (
			<div className='project-item'>
				<div className='project-year'>
					<span>{item?.year}</span>
					<span className='role-indicator level-2'>{getLevelSymbol(item.level)}</span>
				</div>

				<div className='project-detail'>
					<h3>{item?.activity}</h3>
					<p>
						<i>{item?.impact}</i>
					</p>
				</div>
			</div>
		);

		return (
			<div key={item.id} className='project-row no-checkbox'>
				{content}
			</div>
		);
	};

	const sortedAwards = _.orderBy(record?.awardsAndRecognition ?? [], ['dateOfAchievement'], ['asc']);
	const selectedAwards = sortedAwards.filter((item) => record?.myCCT?.listAwardRecognition?.includes(item?._id));

	const renderAwards = (item: any) => {
		const content = (
			<div className='award-item'>
				<h3>
					<span className='star'>★</span> {item?.competition} - {item?.rank},{' '}
					{dayjs(item?.dateOfAchievement).format('DD/MM/YYYY')}
				</h3>

				<p>
					<i>{item?.description}</i>
				</p>
			</div>
		);

		return content;
	};

	const hanldeExport = () => {
		if (recMyCCT?.ssoId) {
			setLoadingExport(true);
			exportMyCCT(recMyCCT?.ssoId)
				.then((res) => {
					fileDownload(res.data, getFilenameHeader(res));
				})
				.catch((er) => console.log(er))
				.finally(() => setLoadingExport(false));
		}
	};

	return (
		<>
			{!!record?.myCCT?.status && <CardNoteMyCCT myCCT={record?.myCCT ?? ({} as MyCCT.IRecord)} />}

			<Spin spinning={loading}>
				<div className='cct-container'>
					<header className='cct-header'>
						<div className='header-content'>
							<div className='header-title'>
								CO-CURRICULAR & <br /> COMPETENCY TRANSCRIPT
							</div>
							<div className='university-logo'>
								<img src={bgcct} style={{ height: 60 }} />
							</div>
						</div>
					</header>

					<main className='cct-body'>
						<div className='column left-column'>
							<section className='intro-section'>
								<p className='intro-text'>
									<b>Co-curricular & Competency Transcript (CCT)</b> is part of VinUniversity's commitment to developing
									holistic graduates. This transcript documents the co-curricular experiences and developmental
									activities that students engage in during their time at VinUni, capturing evidence of their
									competencies, growth, and contributions beyond academic performance.
								</p>
								<div className='student-info'>
									<div className='info-group'>
										<p>Student name: {record?.myCCT?.name || '--'}</p>
										<p>Date of Birth: {record?.myCCT?.dob ? dayjs(record.myCCT.dob).format('DD/MM/YYYY') : '--'}</p>
										<p>Year of Enrollment: {record?.myCCT?.yearOfEnrollment ?? '--'}</p>
									</div>
									<div className='info-group'>
										<p>Student ID: {record?.myCCT?.code || '--'}</p>
										<p>
											{`Program: ${record?.myCCT?.program || ''}${
												record?.myCCT?.college ? ` - ${record?.myCCT?.college}` : ''
											}`}
										</p>
									</div>
								</div>
							</section>

							<section className='profile-section'>
								<div className='section-title gold-text'>
									<img src={Profile} style={{ width: 25, marginLeft: -4, marginTop: -4 }} /> Student Aspiration
									Statement
								</div>

								<p className='italic-text'>{record?.myCCT?.selfAspiration ?? '--'}</p>
							</section>

							<section className='skills-section'>
								<div className='section-title gold-text'>
									<img src={Skills} style={{ width: 25, marginLeft: -4, marginTop: -7 }} /> Skills and Competency
									Development
								</div>
								<p className='italic-text'>
									<i>
										The following competencies were developed and demonstrated through verified co-curricular activities
										and experiences.
									</i>
								</p>

								<div className='skills-grid'>
									{record?.myCCT?.listCompetency?.length ? (
										record?.myCCT?.listCompetency?.map((skill, index) => (
											<div key={index} className='skill-item'>
												{skill}
											</div>
										))
									) : (
										<div className='skill-item'>--</div>
									)}
								</div>
							</section>

							<section className='projects-section'>
								<h2 className='section-title gold-text'>
									<img src={Skills} style={{ width: 25, marginLeft: -4, marginTop: -4 }} /> Featured Projects/Experience
								</h2>

								{selectedActivities.length ? (
									selectedActivities.map((item) => renderItem(item))
								) : (
									<div className='project-item'>--</div>
								)}
							</section>
						</div>

						<div className='column right-column'>
							<section className='awards-section'>
								<h2 className='section-title gold-text'>
									<img src={Skills} style={{ width: 25, marginLeft: -7 }} /> Awards, Recognization and Scholarship
								</h2>

								{selectedAwards.length ? (
									selectedAwards.map((item) => renderAwards(item))
								) : (
									<div className='project-item'>--</div>
								)}
							</section>

							<section className='footer-legend'>
								<div className='end-transcript-divider'>
									<span>END OF TRANSCRIPT</span>
								</div>
								<p className='italic-text' style={{ fontSize: 7 }}>
									<i>
										The following role classifications describe the level of responsibility and impact demonstrated by
										the student in each activity:
									</i>
								</p>

								<div className='legend-table'>
									{record?.levelOfEngagement
										?.sort((a, b) => a.level.order - b.level.order)
										?.map((item) => (
											<div className='legend-row' key={item.level._id}>
												<span className='symbol'>{getLevelSymbol(item.level.name)}</span>

												<span className='label'>{item.level.name}</span>
												<span className='desc'>
													<i>{item.level.description}</i>
												</span>
											</div>
										))}
								</div>

								<div className='signatures'>
									<div className='issue-info'>
										<p>
											<i>Serial Number</i>: {record?.myCCT?.serialNumber || ' --'}
										</p>
										<p>
											<i>Date of Issue</i>: {record?.myCCT?.dateOfIssue ?? '--'}
										</p>
									</div>
									<div className='provost-sig'>
										<div>PROVOST OF VINUNIVERSITY</div>
										<div className='sig-name'>Prof. Tan Yap Peng</div>
									</div>
								</div>
							</section>
						</div>
					</main>

					<div className='title-bottom'>
						<i>This Transcript is officially issued and verified by VinUniversity</i>
					</div>
				</div>
			</Spin>

			<div className='form-footer'>
				{!ssoId && (
					<>
						<Button
							disabled={recMyCCT?.status !== EStatusMyCCT.PENDING_APPROVAL}
							type='primary'
							className='btn-success'
							onClick={() => {
								setTrangThai({
									title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
									trangThai: EStatusMyCCT.APPROVED,
								});
								setVisibleXuLy(true);
							}}
						>
							{intl.formatMessage({ id: 'activityresult.button.duyet' })}
						</Button>

						<Button
							disabled={recMyCCT?.status !== EStatusMyCCT.PENDING_APPROVAL}
							type='primary'
							onClick={() => {
								setTrangThai({
									title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
									trangThai: EStatusMyCCT.CHANGES_REQUIRED,
								});
								setVisibleXuLy(true);
							}}
							className='btn-warning'
						>
							{intl.formatMessage({ id: 'activityresult.button.yccs' })}
						</Button>

						<Button type='primary' loading={loadingExport} onClick={hanldeExport}>
							Export PDF
						</Button>
					</>
				)}

				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({
						id: isView ? 'global.button.dong' : 'global.button.huy',
					})}
				</Button>
			</div>
		</>
	);
};

export default ChiTietMyCCT;
