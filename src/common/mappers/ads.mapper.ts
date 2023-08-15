import * as process from 'process';

import { Ads } from '../../ads/entities/ads.model';

class AdsMapper {
  public toResponse(ads: Ads) {
    return {
      id: ads.id,
      title: ads.title,
      priceUAH: ads.priceUAH,
      priceEUR: ads.priceEUR,
      priceUSD: ads.priceUSD,
      description: ads.description,
      photo:
        ads.photo.map((photoUrl) => `${process.env.AWS_S3_URL}/${photoUrl}`) ||
        null,
      status: ads.status,
      makeId: ads.makeId,
      modelId: ads.modelId,
      genId: ads.genId,
      regionId: ads.regionId,
      cityId: ads.cityId,
    };
  }
}
export const adsMapper = new AdsMapper();
