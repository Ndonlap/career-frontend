// utils/contentHelpers.ts

export interface ContentItem {
  _id?: string;
  title?: string;
  name?: string;
  description: string;
  [key: string]: any;
}

export interface ContentData {
  courses?: ContentItem[];
  careers?: ContentItem[];
  skills?: ContentItem[];
}

export const validateContentData = (data: any, contentType: string): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  if (contentType === 'courses') {
    return Array.isArray(data.courses) && data.courses.every((item: any) => 
      item.title && item.description && item.category
    );
  }
  
  if (contentType === 'careers') {
    return Array.isArray(data.careers) && data.careers.every((item: any) => 
      item.title && item.description && item.industry
    );
  }
  
  if (contentType === 'skills') {
    return Array.isArray(data.skills) && data.skills.every((item: any) => 
      item.name && item.description && item.category
    );
  }
  
  return false;
};

export const formatContentForDisplay = (data: ContentData, contentType: string) => {
  const items = data[contentType as keyof ContentData] || [];
  return items.map((item: ContentItem) => ({
    id: item._id || Math.random().toString(36).substr(2, 9),
    title: item.title || item.name || 'No Title',
    description: item.description,
    ...item
  }));
};

export const generateEmptyTemplate = (contentType: string): ContentData => {
  const template: ContentData = {};
  
  switch (contentType) {
    case 'courses':
      template.courses = [{
        title: 'Nouveau Cours',
        description: 'Description du cours',
        category: 'Catégorie',
        instructor: 'Instructeur',
        duration: '3 mois',
        prerequisites: [],
        skills_gained: [],
        related_careers: [],
        students_enrolled_count: 0,
        average_rating: 0,
        status: 'active'
      }];
      break;
      
    case 'careers':
      template.careers = [{
        title: 'Nouvelle Carrière',
        description: 'Description de la carrière',
        industry: 'Industrie',
        market_demand: 'Moyenne',
        growth_rate: 10,
        average_salary: 1500000,
        job_openings_estimate: 'Medium',
        required_skills: [],
        educational_paths: [],
        industry_partners: []
      }];
      break;
      
    case 'skills':
      template.skills = [{
        name: 'Nouvelle Compétence',
        description: 'Description de la compétence',
        category: 'Catégorie',
        related_courses: []
      }];
      break;
  }
  
  return template;
};