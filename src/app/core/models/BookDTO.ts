import { AuthorDTO } from "./AuthorDTO";

export interface BookDTO {
  id: number;
  title: string;
  author: AuthorDTO | null;
  isbn: string;
  publicationDate: string;
  available: boolean;
}


export interface PageableBookDTO {
  totalElements: number;
  totalPages: number;
  size: number;
  content: BookDTO[];
}

