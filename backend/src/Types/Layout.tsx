export interface CommonBreadcrumbType {
  title: string;
  parent: string;
  element?: JSX.Element;
}
export interface AdminValues {
  _id?: string;
  name?: string;
  email: string;
  role?: string;
  phone_number?: string;
}

export interface User {
  role: string;
  email?: string;
  password?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  profile_image: string;
  date_of_birth?: Date;
  gender?: "male" | "female" | "others";
  flat_plot?: string;
  address?: string;
  country: string;
  region_state?: string;
  city?: string;
  zip_code?: string;
  wishlist_products?: string[];
}
