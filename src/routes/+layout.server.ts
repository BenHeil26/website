export function load() {
  return {
    posts: [
      {
        title: "Pretend Title",
        date: "01-02-2026",
        slug: "pretend-title",
        desc: "A pretend blog post for testing purposes.",
        content: `
# Test Post 1

This is a test markdown file.

## Section

- Item 1
- Item 2

**Enjoy testing!**
        `
      },
      {
        title: "Second Test Post",
        date: "02-15-2026",
        slug: "second-test-post",
        desc: "Another pretend blog post for further testing.",
        content: `
# Test Post 2

This is another test markdown file.

## Features

- Feature A
- Feature B

**Keep testing!**
        `
      },
      {
        title: "Third Test Post",
        date: "03-10-2026",
        slug: "third-test-post",
        desc: "Yet another blog post for comprehensive testing.",
        content: `
# Test Post 3

This is a third test markdown file.

## Highlights

- Highlight X
- Highlight Y

**Testing never ends!**
        `
      }
    ]
  } 
}
