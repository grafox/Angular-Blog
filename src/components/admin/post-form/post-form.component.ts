import { Component, ChangeDetectionStrategy, inject, signal, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Post, Author, Category } from '../../../models/post.model';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

// Declare Quill to TypeScript
declare var Quill: any;

/**
 * Custom validator for the Quill editor to check for actual content.
 * The default 'required' validator passes even when the editor is empty because it contains empty HTML tags.
 */
export function quillValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // Check if the value is not just the default empty state of Quill editor.
    if (value && value !== '<p><br></p>') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = value;
      // Check if there is any actual text content.
      if (tempDiv.textContent?.trim().length) {
        return null; // valid
      }
    }
    return { 'required': true }; // invalid, return a validation error
  };
}


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent implements OnInit, AfterViewInit {
  private fb: FormBuilder = inject(FormBuilder);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  private editor: any;

  postForm!: FormGroup;
  isEditMode = signal(false);
  postId = signal<string | null>(null);
  
  authors = this.blogService.getAuthors();
  categories = this.blogService.getCategories();

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', quillValidator()],
      author: [null, Validators.required],
      categories: [[] as Category[], [Validators.required, Validators.minLength(1)]],
      tags: [''],
      status: ['draft', Validators.required],
      featuredImage: ['', Validators.required],
      viewsCount: [0]
    });

    this.route.paramMap.pipe(
      take(1),
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode.set(true);
          this.postId.set(id);
          return this.blogService.getPostById(id);
        }
        return of(undefined);
      })
    ).subscribe(post => {
      if (post) {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          author: post.author,
          categories: post.categories,
          tags: post.tags.map(t => t.name).join(', '),
          status: post.status,
          featuredImage: post.featuredImage,
          viewsCount: post.viewsCount
        });
         // If editor is already initialized, set its content
        if (this.editor) {
            this.editor.root.innerHTML = post.content;
        }
      } else if (!this.isEditMode()) {
        this.setDefaultAuthor();
      }
    });
  }
  
  private setDefaultAuthor() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      const author = this.authors().find(a => a.id === currentUser.id);
      if (author) {
        this.postForm.patchValue({ author });
      }
    }
  }

  ngAfterViewInit(): void {
    this.editor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    // Set initial content if form has value (for edit mode)
    const initialContent = this.postForm.get('content')?.value;
    if (initialContent) {
      this.editor.root.innerHTML = initialContent;
    }

    // Listen for changes and update the form control
    this.editor.on('text-change', () => {
      const editorContent = this.editor.root.innerHTML;
      this.postForm.get('content')?.setValue(editorContent, {
        emitEvent: false // To prevent infinite loop
      });
      // Manually trigger validation check after programmatic update
      this.postForm.get('content')?.updateValueAndValidity({ emitEvent: false });
      this.postForm.get('content')?.markAsTouched();
    });
  }
  
  onCategoryChange(event: Event, category: Category) {
    const selectedCategories = this.postForm.get('categories')?.value as Category[] || [];
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      if (!selectedCategories.some(c => c.id === category.id)) {
        this.postForm.get('categories')?.setValue([...selectedCategories, category]);
      }
    } else {
      this.postForm.get('categories')?.setValue(
        selectedCategories.filter(c => c.id !== category.id)
      );
    }
  }

  isCategorySelected(category: Category): boolean {
    const selectedCategories = this.postForm.get('categories')?.value as Category[] || [];
    return selectedCategories.some(c => c.id === category.id);
  }

  onSubmit() {
    this.postForm.get('content')?.updateValueAndValidity(); // Ensure latest editor value is validated
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formValue = this.postForm.value;

    const postData = {
      ...formValue,
      tags: formValue.tags.split(',').map((name: string) => name.trim()).filter((name: string) => name).map((name: string) => ({ id: `tag-${name}`, name: name, slug: name.toLowerCase() })),
    };


    if (this.isEditMode() && this.postId()) {
      const fullPost: Post = {
        ...postData,
        id: this.postId()!,
        // slug, createdAt, updatedAt are handled by the service
      };
      this.blogService.updatePost(fullPost);
    } else {
      this.blogService.addPost(postData);
    }

    this.router.navigate(['/admin/posts']);
  }
}
