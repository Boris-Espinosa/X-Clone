import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";


export const useComments = () => {
    const [commentText, setCommentText] = useState("");
    const api = useApiClient();
    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationFn: async(data: { postId: string; content: string }) => {
            const response = await commentApi.createComment(api, data.postId, data.content)
            return response.data
        },
        onSuccess: () => {
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            Alert.alert("Error", "There was an error creating the comment. Please try again.");
            console.error("Error creating comment:", error);
        },
    })

    const createComment = (postId: string) => {
        if (commentText.trim() === "") {
            Alert.alert("Validation Error", "Comment text cannot be empty.");
            return;
        }
            createCommentMutation.mutate({ postId, content: commentText.trim() });
    }

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => commentApi.deleteComment(api, commentId),
        onSuccess: async() => {
            await queryClient.invalidateQueries({
                queryKey: ["posts"],
                refetchType: "active"
            })
        },
        onError: (error) => {
            Alert.alert("Error", error.message || "An error ocured while trying to delete the comment.")
        }
    })

    return {
        isDeletingComment: deleteCommentMutation.isPending,
        deleteComment: (commentId: string) => deleteCommentMutation.mutate(commentId),
        commentText,
        setCommentText,
        createComment,
        isCreatingComment: createCommentMutation.isPending,
    }
}