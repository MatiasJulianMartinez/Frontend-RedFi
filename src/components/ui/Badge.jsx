import classNames from "classnames";

const SIZE_MAP = {
  xs: "text-[11px] px-2 py-0.5",
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
};

const VARIANT_MAP = {
  accent: "bg-acento/10 text-acento",
  muted: "bg-texto/10 text-texto",
  success: "bg-green-500/10 text-green-600",
  danger: "bg-red-500/10 text-red-600",
  info: "bg-blue-500/10 text-blue-600",
};

const Badge = ({
  children,
  className = "",
  size = "sm",
  rounded = "full",
  variant = "accent",
  bgClass,
  textClass,
  collapseOnMobile = false,
  onlyMobile = false,
  onlyDesktop = false,
  as = "span",
  icon: Icon = null,
  iconSize = 14,
  ...props
}) => {
  const Tag = as;

  const roundedCls = rounded === "full" ? "rounded-full" : "rounded-lg";
  const sizeCls = SIZE_MAP[size] || SIZE_MAP.sm;
  const variantCls =
    bgClass || textClass
      ? classNames(bgClass, textClass)
      : VARIANT_MAP[variant] || VARIANT_MAP.accent;

  // 🛠️ Display sin conflictos:
  const displayCls = onlyMobile
    ? "inline-flex sm:hidden"
    : (onlyDesktop || collapseOnMobile)
    ? "hidden sm:inline-flex"
    : "inline-flex";

  return (
    <Tag
      className={classNames(
        displayCls,                 // <- decide el display aquí
        "items-center gap-1",       // (sin inline-flex en la base)
        roundedCls,
        sizeCls,
        variantCls,
        className
      )}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </Tag>
  );
};

export default Badge;
