import { site } from './site';
import { absoluteUrl } from './site-config.mjs';

export const seo = {
  canonical: site.url,
  image: absoluteUrl('/ogp.png'),
  imageAlt: '虹とゾウのキャラクター、プリスクール・学童 にじいろのロゴ',
  robots: 'index, follow, max-image-preview:large',
};

export function createStructuredData(logoUrl: string, classroomUrl: string) {
  const schoolId = absoluteUrl('/#school');
  const websiteId = absoluteUrl('/#website');
  const pageId = absoluteUrl('/#webpage');
  const imageId = absoluteUrl('/#og-image');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Preschool',
        '@id': schoolId,
        name: site.name,
        url: site.url,
        description: site.description,
        telephone: site.phone.replace(/^0/, '+81-'),
        logo: { '@type': 'ImageObject', url: logoUrl, contentUrl: logoUrl, caption: `${site.name}のロゴ` },
        image: classroomUrl,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'JP',
          addressRegion: site.location.region,
          addressLocality: site.location.locality,
          streetAddress: `${site.location.street} ${site.building}`,
        },
        hasMap: site.map,
        sameAs: [site.instagram],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: site.phone.replace(/^0/, '+81-'),
          contactType: '体験入園・体験学童のお問い合わせ',
          description: `受付時間 ${site.hours}。休校日：${site.closed}。`,
          url: absoluteUrl('/#visit'),
        },
        mainEntityOfPage: { '@id': pageId },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.url,
        name: site.name,
        inLanguage: 'ja-JP',
        publisher: { '@id': schoolId },
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: site.url,
        name: site.title,
        description: site.description,
        inLanguage: 'ja-JP',
        isPartOf: { '@id': websiteId },
        about: { '@id': schoolId },
        mainEntity: { '@id': schoolId },
        primaryImageOfPage: { '@id': imageId },
      },
      {
        '@type': 'ImageObject',
        '@id': imageId,
        url: seo.image,
        contentUrl: seo.image,
        width: 1200,
        height: 628,
        caption: seo.imageAlt,
        inLanguage: 'ja-JP',
      },
      {
        '@type': 'Service',
        '@id': absoluteUrl('/#preschool-service'),
        name: 'プリスクール にじいろ',
        serviceType: '英語を中心とした保育',
        description: '遊びや毎日の生活の中で自然に英語に触れ、一人ひとりの個性や成長のペースに寄り添うプリスクール。',
        url: absoluteUrl('/#preschool'),
        provider: { '@id': schoolId },
      },
      {
        '@type': 'Service',
        '@id': absoluteUrl('/#afterschool-service'),
        name: '学童 にじいろ',
        serviceType: '英語に触れる放課後の学童',
        description: '遊び、会話、さまざまな活動を通して放課後の中に英語を取り入れ、もっと話してみたい気持ちを育てる学童。',
        url: absoluteUrl('/#afterschool'),
        provider: { '@id': schoolId },
      },
    ],
  };
}
