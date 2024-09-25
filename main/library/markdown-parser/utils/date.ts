import { isValid } from 'date-fns';
export function getValidDate(name: string, date: string): Date | null {
  if (date) {
    const parsedDate = new Date(date);
    if (isValid(parsedDate)) {
      return parsedDate;
    } else {
      console.warn(`Date ${date} parsed failed in ${name} file`);
      return null;
    }
  } else {
    return null;
  }
}
