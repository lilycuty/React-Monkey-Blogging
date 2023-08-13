import styled from 'styled-components';
import { Button } from '../../components/button';

const HomeBannerStyled = styled.div`
	min-height: 520px;
	padding: 40px 0;
	background-image: linear-gradient(
		to right bottom,
		${(props) => props.theme.primary},
		${(props) => props.theme.secondary}
	);
	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		&-content {
			max-width: 600px;
			color: white;
		}
		&-heading {
			font-size: 36px;
			margin-bottom: 20px;
		}
		&-desc {
			line-height: 1.75;
			margin-bottom: 40px;
		}
	}
`;
const HomeBanner = () => {
	return (
		<HomeBannerStyled>
			<div className="container">
				<div className="banner">
					<div className="banner-content">
						<h1 className="banner-heading">Monkey Blogging</h1>
						<p className="banner-desc">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
							ullam pariatur corporis dolor, eveniet molestias eos modi iure
							neque tempora distinctio magnam nisi laudantium labore et optio
							reiciendis ipsam officia!
						</p>
						<Button
							to="/sign-up"
							kind="secondary"
							style={{
								display: 'inline-block',
							}}
						>
							Get Started
						</Button>
					</div>
					<div className="banner-image">
						<img srcSet="/img-banner.png 2x" alt="banner" />
					</div>
				</div>
			</div>
		</HomeBannerStyled>
	);
};

export default HomeBanner;
