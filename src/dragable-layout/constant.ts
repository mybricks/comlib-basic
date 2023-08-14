export const MAX_SPAN = 24;
export const getPercentBySpan = (span: number = 12): string => {
  return `${(100 / MAX_SPAN) * span}%`;
};
