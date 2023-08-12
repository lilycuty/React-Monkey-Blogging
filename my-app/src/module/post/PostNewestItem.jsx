import styled from 'styled-components';
import PostCategory from './PostCategory';
import PostTitle from './PostTitle';
import PostMeta from './PostMeta';
import PostImage from './PostImage';
import slugify from 'slugify';
import PropTypes from 'prop-types';

const PostNewestItemStyles = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 28px;
	padding-bottom: 28px;
	border-bottom: 1px solid #ccc;
	&:last-child {
		padding-bottom: 0;
		margin-bottom: 0;
		border-bottom: 0;
	}
	.post {
		&-image {
			display: block;
			flex-shrink: 0;
			width: 180px;
			height: 130px;
			border-radius: 12px;
		}
		&-category {
			margin-bottom: 10px;
		}
		&-title {
			margin-bottom: 8px;
		}
	}
`;
const PostNewestItem = ({ data }) => {
	const date = data?.createAt?.seconds
		? new Date(data.createAt.seconds * 1000)
		: new Date();
	const formatDate = new Date(date).toLocaleDateString('vi-VI');
	if (!data) return;
	return (
		<PostNewestItemStyles>
			<PostImage
				className="post-image"
				url={data?.image}
				alt={data?.title}
				to={data?.slug}
			></PostImage>
			<div className="post-content">
				<PostCategory type="secondary" to={data?.category?.slug}>
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
			</div>
		</PostNewestItemStyles>
	);
};
PostNewestItem.propTypes = {
	data: PropTypes.any,
};
export default PostNewestItem;
