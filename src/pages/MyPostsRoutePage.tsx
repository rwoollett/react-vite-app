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
        posts: [
            { id: 3, title: "My new response", date: "01/11/2026 13:53", status: "PendingModeration" },
            { id: 4, title: "My new response", date: "01/11/2026 13:53", status: "Live" },
            { id: 5, title: "My new response", date: "01/11/2026 13:53", status: "Rejected" }], loading: false, error: ""
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
    console.log('Selected post id', selectedPostId);
    return (
        <MyPostsPage
            email={email}
            posts={posts}
            selectedPostId={selectedPostId}
            onPostSelect={(post) =>
                setSelectedPostId(post.id)
            }
            onAddPost={() => navigate("../create")}
        />
    );
}