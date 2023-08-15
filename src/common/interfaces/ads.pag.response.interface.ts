import { Ads } from '../../ads/entities/ads.model';

export interface IAdsPagResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  ads: Ads[];
}
