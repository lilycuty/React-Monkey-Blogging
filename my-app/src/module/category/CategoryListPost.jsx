import Layout from '../../components/layout/Layout';
import Heading from '../../components/layout/Heading';
import PostItem from '../post/PostItem';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const CategoryListPost = () => {
	const { slug } = useParams();
	const [posts, setPosts] = useState([]);
	const titleCategory = slug.replace('-', ' ');
	useEffect(() => {
		const docRef = query(
			collection(db, 'posts'),
			where('category.slug', '==', slug)
		);
		onSnapshot(docRef, (snapshot) => {
			const results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPosts(results);
		});
	}, [slug]);

	if (!slug) return;
	return (
		<div>
			<Layout>
				<div className="container">
					<Heading className="mt-10">
						DANH MỤC {titleCategory.toUpperCase()}
					</Heading>
					<div className="grid-layout grid-layout--primary">
						{posts?.length > 0 &&
							posts.map((item) => (
								<PostItem key={item.id} data={item}></PostItem>
							))}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default CategoryListPost;
