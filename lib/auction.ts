import api, { authApi } from './api'

export interface Auction {
  _id: string
  name: string
  description: string
  price: string
  sellingStatus: 'For sale' | 'Open for bidding' | 'Time Auction' | 'Not for sale'
  tokenID: number
  postID: string
  userID: string
  userDetails: {
    username: string
    pic: string
    fullName: string
  }
  postDetails: {
    photo: string
    totalLike: number
    isLiked: boolean
  }
  biddingHistory?: any[]
  startDateTimeAuction?: string
  endDateTimeAuction?: string
  [key: string]: any
}

export async function getAuctions(pageNumber = 0): Promise<Auction[]> {
  const response = await api.get(`/nft/list?pageNumber=${pageNumber}`)
  return response.data
}

export async function getAuctionById(id: string): Promise<Auction> {
  const response = await api.get(`/auctionbyId/${id}`)
  return response.data
}

export async function placeBid(auctionID: string, bidPrice: number) {
  const response = await authApi.post('/nft/bid/set', { auctionID, bidPrice })
  return response.data
}

export async function buyNft(auctionID: string, address: string) {
  const response = await authApi.post('/nft/buy', { auctionID, address })
  return response.data
}
