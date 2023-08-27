import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post: Post;
  postId: number;
  comments = [];
  postIsLoading = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.postId = +params['id'];
      this.postIsLoading = true;
      this.postsService.fetchPost(this.postId).subscribe((post) => {
        this.post = post;
        this.postIsLoading = false;
      });
      this.postsService.fetchComments(this.postId).subscribe((data) => {
        this.comments = data.comments;
        console.log(this.comments);
      });
    });
  }
}
