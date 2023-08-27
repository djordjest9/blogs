import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  loadedPosts: Post[] = [];
  currentPage: number;
  numberOfPages: number;
  searchTerm: string;
  isLoading: boolean;
  paginationButtons: number[] = [];
  searchTermChanged = new Subject<string>();

  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchTermChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text: string) => {
        this.onSearch(text);
      });
  }

  onSearchTextChange(text: string) {
    this.searchTermChanged.next(text);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.currentPage = +queryParams['page'] || 1;
      this.searchTerm = queryParams['search'];
    });

    this.router.navigate([], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });

    this.isLoading = true;
    this.postsService
      .fetchPosts(this.currentPage, this.searchTerm)
      .subscribe(() => (this.isLoading = false));

    this.postsService.loadedPosts.subscribe((posts) => {
      this.loadedPosts = posts;
    });
    this.postsService.numberOfPages.subscribe((numPages) => {
      this.numberOfPages = numPages;
      this.paginationButtons = this.pageNumbers(
        this.numberOfPages,
        5,
        this.currentPage
      );
    });
  }

  navigateToAnotherPage() {
    this.router.navigate([], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });

    this.isLoading = true;
    this.postsService
      .fetchPosts(this.currentPage, this.searchTerm)
      .subscribe(() => (this.isLoading = false));
  }

  onPage(page: number) {
    this.currentPage = page;
    this.navigateToAnotherPage();
  }

  onSearch(searchTerm: string) {
    this.currentPage = 1;
    this.router.navigate([], {
      queryParams: {
        page: this.currentPage,
        search: searchTerm || null,
      },
    });

    this.isLoading = true;
    this.postsService
      .fetchPosts(this.currentPage, searchTerm)
      .subscribe((data) => {
        this.isLoading = false;
      });
  }

  pageNumbers(
    totalPages: number,
    maxVisiblePages: number,
    current: number
  ): number[] {
    const half = Math.floor(maxVisiblePages / 2);
    let to = maxVisiblePages;

    if (current + half >= totalPages) {
      to = totalPages;
    } else if (current > half) {
      to = current + half;
    }

    let from = Math.max(to - maxVisiblePages, 0);

    return Array.from(
      { length: Math.min(totalPages, maxVisiblePages) },
      (_, i) => i + 1 + from
    );
  }
}
