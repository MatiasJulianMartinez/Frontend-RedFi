import classNames from "classnames";

const H3 = ({
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
    <h3
      className={classNames(
        applyFlex && "flex",
        applyFlex && "items-center",
        !hasCustomJustify && applyFlex && "justify-start",
        !hasCustomTextAlign && "text-left",
        !hasCustomSize && "text-xl lg:text-2xl",
        !hasCustomWeight && "font-semibold",
        !hasCustomMargin && "mb-4",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={28} className="hidden sm:inline-block mr-2 text-acento" />}
      {children}
    </h3>
  );
};

export default H3;
