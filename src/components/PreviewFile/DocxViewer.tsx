import { Spin } from 'antd';
import { renderAsync } from 'docx-preview';
import { useEffect, useRef, useState } from 'react';

type TDocxViewerProps = {
	data?: ArrayBuffer;
};

const DocxViewer: React.FC<TDocxViewerProps> = ({ data }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const styleRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const container = containerRef.current;
		const styleContainer = styleRef.current;

		if (!container || !styleContainer || !data) {
			return;
		}

		container.innerHTML = '';
		styleContainer.innerHTML = '';
		setError(false);
		setLoading(true);

		renderAsync(data, container, styleContainer, {
			breakPages: true,
			className: 'docx-preview-page',
			experimental: true,
			ignoreFonts: false,
			inWrapper: true,
			renderFooters: true,
			renderHeaders: true,
		})
			.catch((err) => {
				console.error(err);
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
			container.innerHTML = '';
			styleContainer.innerHTML = '';
		};
	}, [data]);

	return (
		<div className='preview-docx'>
			{loading && (
				<div className='preview-docx-loading'>
					<Spin />
				</div>
			)}
			{error && <div className='preview-docx-error'>Unable to preview this Word document.</div>}
			<div ref={styleRef} />
			<div ref={containerRef} className='preview-docx-content' />
		</div>
	);
};

export default DocxViewer;
