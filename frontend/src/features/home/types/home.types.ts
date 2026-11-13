import type { IconType } from "react-icons";

export interface NavItem {
  label: string;
  to: string;
  highlight?: boolean;
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  caption: string;
}

export interface PaymentOffer {
  code: string;
  amount: string;
  minOrder: string;
  methods: string[];
}

export interface TrustItem {
  icon: IconType;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  area: string;
  rating: number;
}

export interface FooterColumn {
  title: string;
  links: { label: string; to: string }[];
}
