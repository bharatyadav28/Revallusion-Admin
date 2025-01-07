import { IconType } from "react-icons/lib";

// Sidebar types
export interface simpleSidebarLinkType {
  name: string;
  path: string;
  Icon: IconType;
  hasSubMenu?: boolean;
}

export interface complexSidebarLinkType {
  name: string;
  Icon: IconType;
  hasSubMenu?: boolean;
  subMenuItems: simpleSidebarLinkType[];
}

// Content management types
export interface faqType {
  _id?: string;
  title: string;
  description: string;
  status: string;
}

export interface carousalType {
  _id?: string;
  caption: string;
  sequence: number;
  description: string;
  key_points: {
    title: string;
    explanation: string;
    _id?: string;
  }[];
}

export interface carousalPointType {
  _id?: string;
  title: string;
  explanation: string;
}

export interface networkType {
  _id?: string;
  platform: string;
  followers: string;
}

export interface mentorType {
  _id?: string;
  name: string;
  designation: string;
  about: string;
  networks: networkType[];
}

export interface certificateType {
  _id?: string;
  caption: string;
  key_points: string[];
  image: string;
}

export interface staticPageType {
  _id: string;
  title: string;
  type: string;
  description: string;
  status: string;
}

export interface planType {
  _id: string;
  plan_type: string;
  inr_price: string;
  validity: number;
}

export interface moduleType {
  _id?: string;
  name: string;
  description: string;
  key_points: string[];
}

export interface queryType {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  address: string;
  message: string;
  file: string;
  createdAt: string;
}

export interface credentialType {
  email: string;
  password: string;
}
