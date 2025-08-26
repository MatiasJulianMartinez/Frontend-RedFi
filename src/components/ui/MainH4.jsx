import classNames from "classnames";

const H4 = ({
  children,
  className = "",
  icon: Icon = null,
  variant = "",
  ...props
}) => {
  const hasCustomSize = /\btext-(xs|sm|base|lg|xl|\d+xl)\b/.test(className);
  const hasCustomWeight =
    /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/.test(
      className
    );
  const hasCustomMargin = /\bmb-\d+\b/.test(className);

  const applyFlex = variant !== "noflex";

  return (
    <h4
      className={classNames(
        applyFlex && "flex",
        "items-center justify-start text-left",
        !hasCustomSize && "text-lg md:text-xl",
        !hasCustomWeight && "font-semibold",
        !hasCustomMargin && "mb-2",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={20} className="hidden sm:inline-block mr-2 text-acento" />}
      {children}
    </h4>
  );
};

export default H4;
