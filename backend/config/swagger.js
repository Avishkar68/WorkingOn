import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Spitians (SPITConnect) API Documentation",
    version: "1.2.0",
    description: "API Documentation for the Spitians Backend. Useful for app development and integration.",
    contact: {
      name: "S.P.I.T. Dev Team",
      email: "support@spit.ac.in"
    }
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Input your JWT token in the format: Bearer <token>"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60c72b2f9b1d8b2e88a8d111" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john.doe@spit.ac.in" },
          profileImage: { type: "string", example: "https://cloudinary.com/path-to-image.jpg" },
          branch: { type: "string", enum: ["Computer Engineering", "Computer Science and Engineering", "Electronics Engineering"], example: "Computer Engineering" },
          year: { type: "number", enum: [1, 2, 3, 4], example: 3 },
          skills: { type: "array", items: { type: "string" }, example: ["Node.js", "React"] },
          followers: { type: "array", items: { type: "string" } },
          following: { type: "array", items: { type: "string" } },
          isAdmin: { type: "boolean", example: false },
          isBanned: { type: "boolean", example: false },
          emailVerified: { type: "boolean", example: true },
          streakCount: { type: "number", example: 5 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60c72b2f9b1d8b2e88a8d222" },
          author: { $ref: "#/components/schemas/User" },
          content: { type: "string", example: "Hello SPIT! Exciting workshops coming up." },
          community: { type: "string", nullable: true, example: null },
          image: { type: "string", example: "https://cloudinary.com/post-image.jpg" },
          tags: { type: "array", items: { type: "string" }, example: ["webdev", "workshop"] },
          isAnonymous: { type: "boolean", example: false },
          likes: { type: "array", items: { type: "string" } },
          comments: { type: "array", items: { type: "string" } },
          status: { type: "string", enum: ["active", "reported", "hidden"], example: "active" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Opportunity: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60c72b2f9b1d8b2e88a8d333" },
          title: { type: "string", example: "Software Engineer Intern" },
          company: { type: "string", example: "Google" },
          description: { type: "string", example: "Build cool features for users." },
          requirements: { type: "array", items: { type: "string" }, example: ["C++", "Java"] },
          location: { type: "string", example: "Remote" },
          link: { type: "string", example: "https://google.com/jobs" },
          creator: { type: "string", example: "60c72b2f9b1d8b2e88a8d111" },
          isClosed: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Check backend system health",
        description: "Returns version, server status and current date-time. This is a public/open path.",
        responses: {
          200: {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    version: { type: "string", example: "1.2" },
                    time: { type: "string", example: "2026-06-20T00:00:00.000Z" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        description: "Create a new user account. Note: Only email ending with @spit.ac.in is allowed. This is an open path.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john.doe@spit.ac.in" },
                  password: { type: "string", example: "password123" },
                  branch: { type: "string", enum: ["Computer Engineering", "Computer Science and Engineering", "Electronics Engineering"], example: "Computer Engineering" },
                  year: { type: "number", enum: [1, 2, 3, 4], example: 2 },
                  profileImage: { type: "string", format: "binary", description: "Optional profile photo file" }
                },
                required: ["name", "email", "password"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                    profileImage: { type: "string" },
                    token: { type: "string" }
                  }
                }
              }
            }
          },
          400: { description: "Invalid input or user already exists" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        description: "Authenticate user and return a JWT access token. This is an open path.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "john.doe@spit.ac.in" },
                  password: { type: "string", example: "password123" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                    token: { type: "string" }
                  }
                }
              }
            }
          },
          400: { description: "Invalid credentials" }
        }
      }
    },
    "/api/auth/verify-email": {
      post: {
        summary: "Verify registered email",
        description: "Verify email using code. This is an open path.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "john.doe@spit.ac.in" },
                  code: { type: "string", example: "123456" }
                },
                required: ["email", "code"]
              }
            }
          }
        },
        responses: {
          200: { description: "Email verified successfully" },
          400: { description: "Invalid verification code" }
        }
      }
    },
    "/api/auth/forgot-password": {
      post: {
        summary: "Request reset password token",
        description: "Requests token to reset password. This is an open path.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "john.doe@spit.ac.in" }
                },
                required: ["email"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Token generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    resetToken: { type: "string" }
                  }
                }
              }
            }
          },
          404: { description: "User not found" }
        }
      }
    },
    "/api/auth/reset-password": {
      post: {
        summary: "Reset password using token",
        description: "Updates password using generated token. This is an open path.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", example: "abcdef12345..." },
                  newPassword: { type: "string", example: "newSecurePass123" }
                },
                required: ["token", "newPassword"]
              }
            }
          }
        },
        responses: {
          200: { description: "Password updated successfully" },
          400: { description: "Token invalid or expired" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        summary: "Get current user profile (via Token)",
        description: "Retrieves currently authenticated user's details. Requires Authentication.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Current user profile info",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          401: { description: "Not authorized, token failed/missing" }
        }
      }
    },
    "/api/auth/change-password": {
      put: {
        summary: "Change current user password",
        description: "Updates password for active user. Requires Authentication.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" }
                },
                required: ["currentPassword", "newPassword"]
              }
            }
          }
        },
        responses: {
          200: { description: "Password updated successfully" },
          400: { description: "Current password incorrect" },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/users/me": {
      get: {
        summary: "Get logged-in user profile",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Profile information",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user profile by ID",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Mongoose User ID"
          }
        ],
        responses: {
          200: {
            description: "User details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/users/update": {
      put: {
        summary: "Update user profile details",
        description: "Requires Authentication. Form-data or JSON.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  bio: { type: "string" },
                  skills: { type: "string", description: "Comma-separated skills list" },
                  image: { type: "string", format: "binary", description: "Profile banner/image" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Profile updated successfully" },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/users/{id}/follow": {
      post: {
        summary: "Follow a user",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Followed successfully" },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/users/{id}/unfollow": {
      post: {
        summary: "Unfollow a user",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Unfollowed successfully" },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/posts": {
      post: {
        summary: "Create a new post",
        description: "Submit a new social post. Requires Authentication.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string", example: "Here is my new project!" },
                  image: { type: "string", format: "binary", description: "Post image file" },
                  tags: { type: "string", description: "Comma-separated list of tags" },
                  isAnonymous: { type: "boolean", default: false },
                  community: { type: "string", description: "Optional Community ID" }
                },
                required: ["content"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" }
              }
            }
          },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/posts/feed": {
      get: {
        summary: "Get homepage feed",
        description: "Retrieves dynamic post feed. Requires Authentication.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" }
                }
              }
            }
          },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/posts/{id}": {
      get: {
        summary: "Get single post by ID",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" }
              }
            }
          },
          404: { description: "Post not found" }
        }
      },
      delete: {
        summary: "Delete a post",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Post deleted successfully" },
          401: { description: "Not authorized" }
        }
      }
    },
    "/api/posts/{id}/like": {
      post: {
        summary: "Like a post",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Liked successfully" }
        }
      }
    },
    "/api/posts/{id}/unlike": {
      post: {
        summary: "Unlike a post",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Unliked successfully" }
        }
      }
    },
    "/api/opportunities": {
      get: {
        summary: "Get all opportunities",
        description: "Retrieve manual + scraped job/internship listings. Requires Authentication.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Opportunity" }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create internship/job opportunity listing",
        description: "Requires Authentication.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  description: { type: "string" },
                  requirements: { type: "array", items: { type: "string" } },
                  location: { type: "string" },
                  link: { type: "string" }
                },
                required: ["title", "company", "description"]
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Opportunity" }
              }
            }
          }
        }
      }
    },
    "/api/opportunities/scrape": {
      get: {
        summary: "Scrape Internshala listings manually",
        description: "Triggers cron-scraper logic to scrape new internships. Public/open path.",
        responses: {
          200: { description: "Scraping started or completed successfully" }
        }
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [] // Using fully specified inline endpoints for consistency & performance
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
