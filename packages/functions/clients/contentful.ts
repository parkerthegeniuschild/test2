import {
  ContentfulClientApi,
  Entry,
  EntrySkeletonType,
  createClient,
} from 'contentful';
import { Config } from 'sst/node/config';

type ContentfulEntry = Entry<EntrySkeletonType, undefined, string>;

let _client: ContentfulClientApi<undefined> | null = null;

export const useContentful = () => {
  if (!_client) {
    _client = createClient({
      space: 'dgjgahb1amsq',
      accessToken: Config.CONTENTFUL_DELIVERY_KEY,
      environment: Config.STAGE === 'prod' ? 'production' : 'staging',
    });
  }
  return _client;
};

export default useContentful;

export const isContentfulLegalDocument = (item: ContentfulEntry) =>
  item.sys.contentType.sys.id === 'legalDocument';

export const formatContentfulLegalDocument = ({
  fields: { title, slug, legalText },
  sys: { id, createdAt, updatedAt, revision, locale },
}: ContentfulEntry) => ({
  id,
  createdAt,
  updatedAt,
  revision,
  locale,
  title,
  slug,
  legalText,
});
