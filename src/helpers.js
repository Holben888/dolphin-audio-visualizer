export const getRandomColor = alpha =>
  'rgba(' +
  [
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    alpha || 1,
  ] +
  ')'
