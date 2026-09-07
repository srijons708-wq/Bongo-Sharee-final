const variants = {
  primary: 'bg-burgundy text-warmwhite hover:bg-burgundy-dark',
  outline: 'border border-ink text-ink hover:border-burgundy hover:text-burgundy',
  ghost: 'text-ink hover:text-burgundy',
  gold: 'bg-gold text-warmwhite hover:brightness-95',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 font-body font-semibold tracking-wide uppercase text-[12px] transition-colors duration-400 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
