// AI Image Generation Utilities
// These functions generate placeholder URLs for AI-generated images
// In a real implementation, these would call actual AI image generation APIs

export function generateUserAvatar(userId: number, name: string): string {
  // Generate a consistent avatar based on user ID and name
  const seed = userId.toString() + name.toLowerCase().replace(/\s+/g, '');
  const colors = ['#3B82F6', '#FACC15', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const colorIndex = seed.charCodeAt(0) % colors.length;
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${colors[colorIndex]}&mouth=smile&style=circle`;
}

export function generateJobImage(jobId: number, title: string, skill: string): string {
  // Generate a job-related image based on job ID, title, and skill
  const seed = jobId.toString() + title.toLowerCase().replace(/\s+/g, '');
  const skillKeywords = skill.toLowerCase().split(',').map(s => s.trim());
  
  // Map skills to image categories
  const skillMap: { [key: string]: string } = {
    'construction': 'building',
    'electrical': 'lightbulb',
    'plumbing': 'droplet',
    'carpentry': 'hammer',
    'painting': 'brush',
    'cleaning': 'sparkles',
    'gardening': 'leaf',
    'cooking': 'utensils',
    'driving': 'car',
    'delivery': 'package'
  };
  
  let category = 'tools'; // default
  for (const skillKeyword of skillKeywords) {
    if (skillMap[skillKeyword]) {
      category = skillMap[skillKeyword];
      break;
    }
  }
  
  return `https://api.dicebear.com/7.x/icons/svg?seed=${seed}&icon=${category}&backgroundColor=3B82F6&iconColor=FACC15`;
}

export function generateDashboardVisual(type: 'chart' | 'graph' | 'illustration'): string {
  // Generate dashboard visual placeholders
  const types = {
    chart: 'https://api.dicebear.com/7.x/icons/svg?seed=dashboard&icon=bar-chart&backgroundColor=3B82F6&iconColor=FACC15',
    graph: 'https://api.dicebear.com/7.x/icons/svg?seed=analytics&icon=trending-up&backgroundColor=10B981&iconColor=FFFFFF',
    illustration: 'https://api.dicebear.com/7.x/icons/svg?seed=work&icon=briefcase&backgroundColor=F59E0B&iconColor=FFFFFF'
  };
  
  return types[type] || types.illustration;
}

export function generateProfileBanner(userId: number, role: string): string {
  // Generate profile banner images
  const seed = userId.toString() + role;
  const roleColors = {
    contractor: '3B82F6',
    labourer: 'FACC15'
  };
  
  const bgColor = roleColors[role as keyof typeof roleColors] || '3B82F6';
  
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=${bgColor}&shape1Color=FACC15&shape2Color=FFFFFF`;
}

export function generateWorkplaceImage(location: string, skill: string): string {
  // Generate workplace environment images
  const seed = location.toLowerCase().replace(/\s+/g, '') + skill.toLowerCase().replace(/\s+/g, '');
  
  return `https://api.dicebear.com/7.x/icons/svg?seed=${seed}&icon=map-pin&backgroundColor=10B981&iconColor=FFFFFF`;
}

// Fallback images for when AI generation fails
export const fallbackImages = {
  userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=3B82F6&mouth=smile&style=circle',
  jobImage: 'https://api.dicebear.com/7.x/icons/svg?seed=job&icon=briefcase&backgroundColor=3B82F6&iconColor=FACC15',
  dashboardVisual: 'https://api.dicebear.com/7.x/icons/svg?seed=dashboard&icon=bar-chart&backgroundColor=3B82F6&iconColor=FACC15',
  profileBanner: 'https://api.dicebear.com/7.x/shapes/svg?seed=profile&backgroundColor=3B82F6&shape1Color=FACC15&shape2Color=FFFFFF'
};
