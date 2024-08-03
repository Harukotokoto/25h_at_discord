const random = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export { random };
