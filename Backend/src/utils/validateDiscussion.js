// Add these validation functions to your existing validator.js

const validateDiscussion = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters long");
  }

  if (!data.content || data.content.trim().length < 20) {
    errors.push("Content must be at least 20 characters long");
  }

  if (data.title && data.title.length > 200) {
    errors.push("Title cannot exceed 200 characters");
  }

  if (data.content && data.content.length > 5000) {
    errors.push("Content cannot exceed 5000 characters");
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("Tags must be an array");
  }

  if (data.tags && data.tags.length > 10) {
    errors.push("Maximum 10 tags allowed");
  }

  if (data.tags) {
    data.tags.forEach((tag, index) => {
      if (tag.length > 20) {
        errors.push(`Tag ${index + 1} cannot exceed 20 characters`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return true;
};

const validateVote = (data) => {
  if (!data.type || !["upvote", "downvote"].includes(data.type)) {
    throw new Error("Vote type must be 'upvote' or 'downvote'");
  }
  return true;
};

// Add to your existing exports
module.exports = {
  // ... your existing exports
  validateDiscussion,
  validateVote
};