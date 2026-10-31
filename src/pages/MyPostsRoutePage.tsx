import { Alert, Loader } from "@mantine/core";
import { MyPostsPage } from "../components/post/MyPostsPage";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import type { PostSummary } from "../types";

export function MyPostsRoutePage({ email }: { email: string }) {
    const navigate = useNavigate();

    const [selectedPostId, setSelectedPostId] =
        useState<number>();

    const {
        posts,
        loading,
        error,
    }: { posts: PostSummary[] | [], loading: boolean, error: string } = {
        posts: [], loading: false, error: ""
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Alert color="red">
                Failed to load posts
            </Alert>
        );
    }

    return (
        <MyPostsPage
            email={email}
            posts={posts}
            selectedPostId={selectedPostId}
            onPostSelect={(post) =>
                setSelectedPostId(post.id)
            }
            onAddPost={() =>
                navigate("../create")
            }
        />
    );
}