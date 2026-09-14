import axios from 'axios';

const PEXELS_API_KEY = 'jB6vfpsLK2F3JZfjFSXPSZB2k815eThAUWQBwNIyEY5NuXarlne0nTH1'; 

export const getCityImage = async (cityName) => {
  try {
    const response = await axios.get(`https://api.pexels.com/v1/search`, {
      params: {
        query: `${cityName} landmark city`,
        per_page: 1, 
        orientation: 'landscape' 
      },
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

   
    if (response.data.photos && response.data.photos.length > 0) {
      return response.data.photos[0].src.large; 
    }
    

    return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600';
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600';
  }
};