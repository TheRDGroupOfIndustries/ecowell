import axios from "axios";
import { toast } from "react-toastify";

export const generateRandomSku = (length: number = 8): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
  
    return result;
  };
  export const generateSlug = (name: string): string => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    return slug;
  };
  
  export const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/all-categories');
      console.log("Fetched Categories:", response.data);
      //only title, image_link and slug to show 
      let categoriesToShow = response.data.map((category: any) => {
        return { title: category.title,slug: category.slug };
      });
      return categoriesToShow;
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      
    }
  };
