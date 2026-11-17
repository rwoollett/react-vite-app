import { Alert } from "@mantine/core";
import { MyPostsPage } from "../components/post/MyPostsPage";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { selectMyPostIds, useAppDispatch, useAppSelector } from "../store/reducers/store";
import { fetchMyPosts } from "../store/api/myPostsSlice";
import PostCardSkeleton from "../components/PostCardSkeleton";

export function MyPostsRoutePage({ email }: { email: string }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const postIds = useAppSelector(selectMyPostIds);
    const [selectedPostId, setSelectedPostId] = useState<number>();
    const status = useAppSelector((state) => state.myPosts.status);
    const error = useAppSelector((state) => state.myPosts.error);

    useEffect(() => {
        dispatch(fetchMyPosts());
    }, [dispatch]);


    if (status === 'loading') {
        return Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />);
    }
    if (status === 'failed') {
        return (
            <Alert color="red">
                {error}
            </Alert>
        );
    }

    return (
        <MyPostsPage
            email={email}
            postIds={postIds}
            selectedPostId={selectedPostId}
            onPostSelect={(postId) =>
                setSelectedPostId(postId)
            }
            onAddPost={() => navigate("../create")}
        />
    );
}