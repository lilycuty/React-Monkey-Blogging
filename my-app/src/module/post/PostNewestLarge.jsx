import styled from 'styled-components';
import PostCategory from './PostCategory';
import PostTitle from './PostTitle';
import PostMeta from './PostMeta';
import PostImage from './PostImage';
import slugify from 'slugify';
import PropTypes from 'prop-types';

const PostNewestLargeStyles = styled.div`
	.post {
		&-image {
			display: block;
			margin-bottom: 16px;
			height: 433px;
			border-radius: 16px;
		}
		&-category {
			margin-bottom: 10px;
		}
		&-title {
			margin-bottom: 12px;
		}
	}
`;
const PostNewestLarge = ({ data }) => {
	const date = data?.createAt?.seconds
		? new Date(data.createAt.seconds * 1000)
		: new Date();
	const formatDate = new Date(date).toLocaleDateString('vi-VI');
	if (!data) return null;
	return (
		<PostNewestLargeStyles>
			<PostImage
				className="post-image"
				url={data?.image}
				alt={data?.title}
				to={data?.slug}
			></PostImage>
			<PostCategory to={data?.category?.slug}>
				{data?.category?.name}
			</PostCategory>
			<PostTitle size="big" to={data.slug}>
				{data?.title}
			</PostTitle>
			<PostMeta
				authorName={data?.user?.fullname}
				to={slugify(data?.user?.username || '', { lower: true })}
				date={formatDate}
			></PostMeta>
		</PostNewestLargeStyles>
	);
};
PostNewestLarge.propTypes = {
	data: PropTypes.any,
};
export default PostNewestLarge;
