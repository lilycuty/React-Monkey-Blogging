import styled from 'styled-components';
import Heading from '../../components/layout/Heading';
import PostNewestLarge from '../post/PostNewestLarge';
import PostNewestItem from '../post/PostNewestItem';
import PostItem from '../post/PostItem';
import { useEffect, useState } from 'react';
import {
	collection,
	limit,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { v4 } from 'uuid';
const HomeNewestStyles = styled.div`
	.layout {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-gap: 40px;
		margin-bottom: 64px;
		align-items: start;
	}
	.sidebar {
		padding: 28px 20px;
		background-color: #f3edff;
		border-radius: 16px;
	}
`;
const HomeNewest = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const colRef = collection(db, 'posts');
		const queries = query(
			colRef,
			where('status', '==', 1),
			where('hot', '==', false),
			limit(4)
		);
		onSnapshot(queries, (snapshot) => {
			const results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPosts(results);
		});
	}, []);
	const [first, ...other] = posts;
	if (posts.length <= 0) return;
	return (
		<HomeNewestStyles className="home-block">
			<div className="container">
				<Heading>Bài viết mới nhất</Heading>
				<div className="layout">
					<PostNewestLarge data={first}></PostNewestLarge>
					<div className="sidebar">
						{other?.length > 0 &&
							other.map((item) => (
								<PostNewestItem key={v4()} data={item}></PostNewestItem>
							))}
					</div>
				</div>
				<div className="grid-layout grid-layout--primary">
					<PostItem></PostItem>
					<PostItem></PostItem>
					<PostItem></PostItem>
					<PostItem></PostItem>
				</div>
			</div>
		</HomeNewestStyles>
	);
};

export default HomeNewest;
