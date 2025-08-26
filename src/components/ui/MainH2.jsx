import classNames from "classnames";

const H2 = ({
  children,
  className = "",
  icon: Icon = null,
  variant = "",
  ...props
}) => {
  const hasCustomSize = /\btext-(xs|sm|base|lg|xl|\d+xl)\b/.test(className);
  const hasCustomWeight = /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/.test(className);
  const hasCustomMargin = /\bmb-\d+\b/.test(className);
  const hasCustomTextAlign = /\btext-(left|center|right|justify)\b/.test(className);
  const hasCustomJustify = /\bjustify-(start|center|end|between|around|evenly)\b/.test(className);

  const applyFlex = variant !== "noflex";

  return (
    <h2
      className={classNames(
        applyFlex && "flex items-center gap-2",
        !hasCustomJustify && applyFlex && "justify-start",
        !hasCustomTextAlign && "text-left",
        !hasCustomSize && "text-3xl lg:text-4xl",
        !hasCustomWeight && "font-semibold",
        !hasCustomMargin && "mb-4",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={32} className="hidden sm:inline-block text-acento" />}
      {children}
    </h2>
  );
};

export default H2;
