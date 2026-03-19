import Post from "../models/Post.js";
export const getTrendingPosts = async (req, res) => {

  const posts = await Post.aggregate([
    { $match: { status: "active" } },

    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" }
      }
    },

    {
      $sort: {
        likeCount: -1,
        commentCount: -1
      }
    },

    { $limit: 10 }
  ]);

  const populatedPosts = await Post.populate(posts, {
    path: "author",
    select: "name profileImage"
  });

  res.json(populatedPosts);

};
  export const getTrendingTags = async (req, res) => {

    const posts = await Post.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  
    res.json(posts);
  
  };
    