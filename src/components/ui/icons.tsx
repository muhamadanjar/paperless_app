
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconsProps extends LucideProps {
  name: string;
}

const Icons = ({ name, className, ...props }: IconsProps) => {
  const iconName = name
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

  const Icon = (LucideIcons as any)[iconName];

  if (!Icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <Icon className={className} {...props} />;
};

export default Icons;