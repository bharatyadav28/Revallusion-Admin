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
  submodule?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface submoduleType {
  _id: string;
  name: string;
  thumbnailUrl: string;
  sequence: number;
  videos: [courseVideoType];
  assignmentCount?: number;
}

export interface coursemoduleType {
  _id: string;
  name: string;
  submodules: [submoduleType];
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

export interface courseVideoType extends videoType {
  _id?: string;
  sequence: number;
}

export interface carousalType {
  _id?: string;
  video: courseVideoType;
  sequence?: number;
}

// Assignment types
export interface assignmentType {
  _id?: string;
  course: string;
  module: string;
  submodule: string;
  name: string;
  fileUrl: string;
  createdAt?: string;
}

export interface SubmittedAssignmentType {
  _id: string;
  assignment: {
    _id: string;
    name: string;
    module: {
      _id: string;
      name: string;
    };
    submodule: {
      _id: string;
      name: string;
    };
  };
  score: number | null;
  gradedAt: string | null;
  submittedAt: string;
  submittedFileUrls: string[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  revokedSubmissions: string[];
}

export interface ResourceType {
  _id?: string;
  url: string;
}
