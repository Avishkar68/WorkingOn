import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords
 * @param {string} props.image - OG/Twitter image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, article, etc.)
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = 'https://www.spitconnect.favmedia.in/og-image.png', 
  url = 'https://www.spitconnect.favmedia.in/', 
  type = 'website' 
}) => {
  const siteTitle = 'SPITConnect';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Connect with SPIT students for internships, academic help, projects, and campus discussions. The ultimate student community platform for Sardar Patel Institute of Technology.';
  const metaDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
