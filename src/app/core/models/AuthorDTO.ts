export interface AuthorDTO {
  id: number;
  name: string;
  nationality: string;
  birthDate: string;
}


export interface PageableAuthorDTO {
  totalElements: number;
  totalPages: number;
  size: number;
  content: AuthorDTO[];
}