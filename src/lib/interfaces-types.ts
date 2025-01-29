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
  keepMeSignedIn?: boolean;
}

export interface userType {
  _id: string | null;
  avatar?: string | null;
  email: string | null;
  name: string | null;
  mobile?: string | null;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  password?: string | null;
}

// Library Managment types
export interface videoDurationType {
  hours: number;
  minutes: number;
  seconds: number;
}
export interface videoType {
  _id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration?: videoDurationType;
  course: string;
  isActive?: boolean;
  module?: string;
  subModule?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface subModuleType {
  _id: string;
  name: string;
  thumbnailUrl: string;
  sequence: number;
  videos: [courseVideoType];
}

export interface coursemoduleType {
  _id: string;
  name: string;
  subModules: [subModuleType];
}
export interface courseType {
  _id: string;
  title: string;
  modules?: [coursemoduleType];
  isFree: boolean;
  freeVideos: [courseVideoType];
  createdAt?: string;
  updatedAt?: string;
}

export interface dateSortVideos {
  [date: string]: videoType[];
}

// Course Management types
export interface courseItemType {
  _id?: string;
  name?: string;
  thumbnailUrl?: string;
  sequence?: number;
  courseId?: string;
  moduleId?: string;
  submoduleId?: string;
  videoId?: videoType;
}

export interface courseVideoType {
  videoId: videoType;
  sequence: number;
}

// export interface latestTutorialSectionType {
//   _id: string;
//   videos: [courseVideoType];
// }
