export interface ItemIcon {
  viewBox: string;
  paths?: string[];
  rects?: Record<string, string>[];
  circles?: Record<string, string>[];
  ellipse?: Record<string, string>;
  polylines?: string[];
}

export interface CardItem {
  title?: string;
  text: string;
  itemIcon?: string;
  subitems?: string[];
}

export interface CardData {
  id: string;
  colorClass: string;
  title: string;
  icon: ItemIcon;
  strokeColor: string;
  glowColor: string;
  items: CardItem[];
}

export interface Metadata {
  title: string;
  subtitle: string;
  week: string;
}

export interface PresentationData {
  metadata: Metadata;
  cards: CardData[];
}
