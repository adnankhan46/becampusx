import { authApi } from "../apiSlice";
const BASE_URL = "/api";


export const postsApi = authApi.injectEndpoints({
  tagTypes: ['Posts', 'Comments'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 6 }) => `/post/allpost?page=${page}&limit=${limit}`,
      providesTags: ['Posts'],
      transformResponse: (response) => {
        return {
          posts: response.posts.reverse(), // Reverse posts if needed
          hasMore: response.currentPage < response.totalPages // Handle pagination
        };
      },
    }),
    getPostsByUser: builder.query({
      query: ({ page = 1, limit = 6, userId }) => `/post/allpostbyuser?page=${page}&limit=${limit}&userId=${userId}`,
      providesTags: ['Posts'],
      transformResponse: (response) => {
        return {
          posts: response.posts,
          hasMore: response.currentPage < response.totalPages // Handle pagination
        };
      },
    }),
    
 
    // Posting to addpost API
    addPosts: builder.mutation({
      query: (postBody) => ({
        url: `/post/addpost`,
        method: 'POST',
        body: postBody,
      }),
      invalidatesTags: ['Posts'],
    }),
    // Delete Post
    deletePosts: builder.mutation({
      query: (postId) => ({
        url: `/post/delete/${postId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Posts'],
    }),
    // Get Single Post
    getSinglePost: builder.query({
      query: (postId) => `/post/${postId}`,
    }),
    // COMMENT: All Comment of a Post
    getCommentAllPost: builder.query({
      query: (postId) => `/comment/all/${postId}`,
      providesTags: ['Comments'],
    }),
    // Add Comment to Post
    addCommentToPost: builder.mutation({
      query: ({ postId, commentText }) => ({
        url: `/comment/add/${postId}`,
        method: 'POST',
        body: commentText,
      }),
      invalidatesTags: ['Comments'],
    }),
    // COMMENT: Delete Comment
    deleteCommentOfPost: builder.mutation({
      query: ({ commentId, commentText }) => ({
        url: `/comment/delete/${commentId}`,
        method: 'POST',
        body: commentText,
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});
 

export const { 
  useGetPostsQuery,
  useGetPostsByUserQuery,
  useAddPostsMutation,
  useDeletePostsMutation,
  useGetSinglePostQuery,
  useGetCommentAllPostQuery,
  useAddCommentToPostMutation,
  useDeleteCommentOfPostMutation
} = postsApi;
