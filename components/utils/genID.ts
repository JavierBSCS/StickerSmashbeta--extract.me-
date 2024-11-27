
const genID = (prefix: string): string => {
    const newId: string = `${prefix}${Math.random().toString(36).substring(2, 10)}`; 
    return newId;
  };
  
  export { genID };