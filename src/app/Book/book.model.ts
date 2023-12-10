// book.model.ts
export class Book {
  constructor(
    public _id: string,
    public author: string,
    public country: string,
    public imageLink: string,
    public language: string,
    public link: string,
    public pages: number,
    public title: string,
    public year: number,
    public reviews: Review[]
  ) {}
}

// review.model.ts
export class Review {
  constructor(
    public _id: string,
    public username: string,
    public comment: string,
    public stars : number
  ) {}
}
