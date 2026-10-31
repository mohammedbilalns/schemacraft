import React from 'react';
import {
  User,
  Building2,
  Car,
  FileText,
  Calendar,
  ClipboardList,
  Route,
  History,
  Receipt,
  Wallet,
  WalletCards,
  ArrowUpRight,
  ShieldCheck,
  List,
  Database,
  Table as TableIcon,
  Tag,
  Key,
  Lock,
  Globe,
  Folder,
  Layers,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  user: User,
  'building-2': Building2,
  building: Building2,
  car: Car,
  'file-text': FileText,
  file: FileText,
  calendar: Calendar,
  'clipboard-list': ClipboardList,
  clipboard: ClipboardList,
  route: Route,
  history: History,
  receipt: Receipt,
  wallet: Wallet,
  'wallet-cards': WalletCards,
  'arrow-up-right': ArrowUpRight,
  'shield-check': ShieldCheck,
  shield: ShieldCheck,
  list: List,
  database: Database,
  table: TableIcon,
  tag: Tag,
  key: Key,
  lock: Lock,
  globe: Globe,
  folder: Folder,
  layers: Layers,
};

export function getErdIcon(name?: string, props: LucideProps = { size: 16 }): React.ReactElement {
  if (!name) {
    return <TableIcon {...props} />;
  }
  const cleanName = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[cleanName] || TableIcon;
  return <IconComponent {...props} />;
}
