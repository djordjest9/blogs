export class Post {
  constructor(
    public body: string,
    public id: number,
    public reactions: number,
    public tags: string[],
    public title: string,
    public userId: number
  ) {}
}
