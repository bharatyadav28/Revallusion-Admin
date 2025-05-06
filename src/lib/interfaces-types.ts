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
  level?: number;
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
  assignment?: string;
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
  resource?: string;
}

export interface coursemoduleType {
  _id: string;
  name: string;
  thumbnailUrl?: string;
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
  resource?: string;
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
  video: {
    _id: string;
    title: string;
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
  submittedFileUrl: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  revokedSubmissions: {
    submittedAt: string;
    submittedFileUrl: string;
    score: number;
    revokedAt: string;
  }[];
}

export interface ResourceType {
  _id?: string;
  url: string;
}

export interface CommentType {
  _id: string;
  user: userType;
  video: videoType;
  comment: string;
  reply?: string;
  createdAt: string;
  repliedAt?: string;
}

// Primary dashboard
export interface dashboardCarousalType {
  _id?: string;
  image: string;
  sequence?: number;
  createdAt?: string;
}

export interface dashboardSectionType {
  _id?: string;
  name: string;
  videos: [videoType];
}

export interface orderType {
  _id: string;
  plan: string;
  expiry_date: string;
}

export interface transactionType {
  _id: string;
  payment_id: string;
  gateway: string;
  amount: number;
  status: string;
  createdAt: string;
  plan: string;
  user?: {
    _id: string;
    name?: string;
    email: string;
  };
  invoice_url?: string;
}

interface CertficateType {
  _id: string;
  plan: string;
  user: string;
  path: string;
}

// Users management
export interface userDetailsType extends userType {
  transactions: transactionType[];
  plan?: null;
  certificates?: CertficateType[];
}

export interface issuedCertificatesType {
  _id: string;
  plan_type: string;
  level?: number;
  certificate: boolean;
}

export interface dashboardType {
  usersCount: number;
  activeOrder: {
    usersCount: number;
    planName: string;
  }[];
  plansUpgraded: number;
  queries: number;
  revenues: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface LeaderBoardItemType {
  _id: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
  scoresSum: number;
  averageAssigmentsScore: string;
  createdAt: string;
}

export interface AppConfigsType {
  activeGateways: string[];
}

export interface TimeStampType {
  _id?: string;
  time: string;
  title: string;
}
