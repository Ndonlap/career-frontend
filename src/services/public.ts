import api from './api';

const PublicService = {
  getServices: () => api.get('/public/services'),
  getResources: (isFeatured = false) => api.get(`/public/resources${isFeatured ? '?featured=true' : ''}`),
  getSingleResource: (resourceId: any) => api.get(`/public/resources/${resourceId}`),
  getFAQs: () => api.get('/public/faqs'),
  getHomepageHero: () => api.get('/public/homepage_hero'),
  getSystemInfo: () => api.get('/public/system_info'),
};

export default PublicService;