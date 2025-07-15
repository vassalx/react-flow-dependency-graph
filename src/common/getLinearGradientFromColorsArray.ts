const getLinearGradientFromColorsArray = (
  colors: string[],
  degrees: number = 0
) => {
  const step = 100 / (colors.length - 1);
  const gradientColors = colors
    .map((color, index) => `${color} ${index * step}%`)
    .join(", ");
  return `linear-gradient(${degrees}deg, ${gradientColors})`;
};

export default getLinearGradientFromColorsArray;
