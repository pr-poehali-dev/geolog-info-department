interface EmployeeAvatarProps {
  fullName: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
  xl: 'h-28 w-28 text-4xl',
};

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const EmployeeAvatar = ({ fullName, color, size = 'md' }: EmployeeAvatarProps) => (
  <div
    className={`${SIZES[size]} shrink-0 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-display font-semibold text-white shadow-lg ring-2 ring-white/40`}
  >
    {initials(fullName)}
  </div>
);

export default EmployeeAvatar;
