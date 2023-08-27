import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  loadedPosts = new Subject<Post[]>();
  numberOfPages = new Subject<number>();

  private posts: Post[] = [];

  fetchPost(id: number) {
    return this.http.get<Post>(`https://dummyjson.com/posts/${id}`);
  }

  fetchPosts(currentPage: number, searchTerm: string = '') {
    const skipParam = currentPage * 10 - 10;
    let url = 'https://dummyjson.com/posts';
    if (searchTerm) {
      url += `/search?q=${searchTerm}&limit=10&skip=${skipParam}`;
    } else {
      url += `?limit=10&skip=${skipParam}`;
    }
    return this.http
      .get<{ limit: number; posts: Post[]; skip: number; total: number }>(url)
      .pipe(
        tap((postsData) => {
          this.numberOfPages.next(Math.ceil(postsData.total / 10));
          this.posts = postsData.posts;
          this.loadedPosts.next(this.posts);
        })
      );
  }

  fetchComments(id: number) {
    return this.http.get<{
      comments: [];
      limit: number;
      skip: number;
      total: number;
    }>(`https://dummyjson.com/posts/${id}/comments`);
  }
}
