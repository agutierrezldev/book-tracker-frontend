import { BookDTO } from "./BookDTO";

export interface LoanDTO {
  id: number;
  book: BookDTO;
  loanDate: string;
  returnDate: string;
  status: boolean;
}


export interface PageableLoanDTO {
  totalElements: number;
  totalPages: number;
  size: number;
  content: LoanDTO[];
}
