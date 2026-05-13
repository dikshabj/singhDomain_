import { authApi } from './api'

export interface Post {
  _id: string
  username: string
  email: string
  photo?: string
  video?: string
  thumbnail?: string
  caption?: string
  totalLike: number
  totalComment: number
  isLiked: boolean
  pic?: string
  fullName?: string
  createdAt: string
  postType?: 'photo' | 'video'
}

export async function getAllPosts(page: number = 1): Promise<Post[]> {
  const response = await authApi.get(`/post/get-all-post/${page}`)
  // Backend returns an array or an object with data
  return response.data || []
}

export async function getFollowersPosts(page: number = 1): Promise<Post[]> {
  const response = await authApi.get(`/post/get-followers-post/${page}`)
  return response.data || []
}

export async function likePost(postID: string) {
  const response = await authApi.put('/post/likes', { postID })
  return response.data
}

export async function unlikePost(postID: string) {
  const response = await authApi.put('/post/unlike/', { postID })
  return response.data
}

export async function commentOnPost(postID: string, comment: string) {
  const response = await authApi.put('/post/comment', { postID, comment })
  return response.data
}

export async function createPost(formData: FormData) {
  const response = await authApi.post('/post/create-post', formData)
  return response.data
}
export async function deletePost(postID: string) {
  const response = await authApi.delete('/post/delete-post', {
    data: { postID },
  })
  return response.data
}

export async function reportPost(postID: string, message: string) {
  const response = await authApi.post('/post/report', { postID, message })
  return response.data
}

export async function updatePost(postID: string, caption: string) {
  const response = await authApi.patch('/post/update-post', { postID, caption })
  return response.data
}

export async function getTrendingTags() {
  const response = await authApi.get('/post/getAllHashtag/1')
  return response.data || []
}

export async function getPostById(postId: string): Promise<Post | null> {
  const response = await authApi.get(`/post/postbyid/${postId}`)
  return response.data || null
}

export async function getUserPostCount() {
  const response = await authApi.get('/post/count-post')
  return response.data
}

export async function deleteComment(commentID: string, postID: string) {
  const response = await authApi.post('/post/deletecomment', { commentID, postID })
  return response.data
}

export async function savePost(postID: string) {
  const response = await authApi.patch('/post/update-post', { postID, saveStatus: true })
  return response.data
}

export async function unSavePost(postID: string) {
  const response = await authApi.post('/post/unsave-post', { postID })
  return response.data
}

export async function getSavedPosts(page: number = 1): Promise<Post[]> {
  const response = await authApi.get(`/post/get-saved-post/${page}`)
  return response.data || []
}

export async function searchPosts(query: string, page: number = 1): Promise<Post[]> {
  const response = await authApi.post('/post/search-post', { searchPost: query, page })
  return response.data || []
}

export async function getPostInfo(postID: string) {
  const response = await authApi.get(`/post/get-post-info/${postID}`)
  return response.data
}

export async function sharePost(email: string, sendTo: string) {
  const response = await authApi.put(`/post/share/${email}`, { sendTo })
  return response.data
}

export async function pinComment(postID: string, commentID: string) {
  const response = await authApi.patch('/post/update-post', { postID, pinComment: true, commentID })
  return response.data
}

export async function tagUser(email: string, postID: string) {
  const response = await authApi.put(`/post/tag-user/${email}/${postID}`)
  return response.data
}

export async function removeTag(email: string, postID: string) {
  const response = await authApi.put(`/post/remove-tag/${email}/${postID}`)
  return response.data
}

export async function getPostComments(postID: string, page: number = 1) {
  const response = await authApi.get(`/post/count-comments/${postID}/${page}`)
  return response.data
}

export async function getLikesCount(postID: string, page: number = 1) {
  const response = await authApi.get(`/post/count-like/${postID}/${page}`)
  return response.data
}

export async function getAllVideos(page: number = 1): Promise<Post[]> {
  const response = await authApi.get(`/post/getallvideo/${page}`)
  return response.data || []
}

export async function searchHashtag(hashtag: string): Promise<Post[]> {
  const response = await authApi.get(`/post/searchHashtag/${hashtag}`)
  return response.data || []
}

export async function getTrending24(): Promise<Post[]> {
  const response = await authApi.get('/post/trendinIn24/')
  return response.data || []
}

export async function addPostView(postID: string) {
  const response = await authApi.post('/post/updateDb', { postID })
  return response.data
}
