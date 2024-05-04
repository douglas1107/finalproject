const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Dougs Blog",
      description: "Simple Blog "
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

 function insertPostData () {
   Post.insertMany([
    {
      "title": "Exploring the Wonders of Nature",
      "body": "Embark on a journey to explore the breathtaking beauty of nature's landscapes, from majestic mountains to serene forests."
    },
    {
      "title": "The Art of Culinary Adventure",
      "body": "Dive into the world of culinary delights and discover the secrets of creating mouthwatering dishes from around the globe."
    },
    {
      "title": "Unraveling the Mysteries of Ancient Civilizations",
      "body": "Delve into the mysteries of ancient civilizations and uncover the secrets of lost cities, forgotten cultures, and enigmatic artifacts."
    },
    {
      "title": "A Guide to Mindful Living",
      "body": "Learn the art of mindfulness and discover how to live in the present moment, cultivate inner peace, and find joy in everyday life."
    },
    {
      "title": "Journey Through Time: Historical Landmarks Revisited",
      "body": "Take a trip through history and revisit iconic landmarks that have shaped civilizations and left a lasting legacy on the world."
    },
    {
      "title": "The Magic of Music: Exploring Different Genres",
      "body": "Immerse yourself in the world of music and discover the diverse array of genres that inspire, uplift, and move the soul."
    },
    {
      "title": "The Art of Photography: Capturing Life's Moments",
      "body": "Discover the artistry of photography and learn how to capture life's most precious moments through the lens of a camera."
    },
    {
      "title": "A Glimpse into the Future: Technology Innovations",
      "body": "Explore the cutting-edge innovations and technological advancements that are shaping the future of humanity and revolutionizing industries."
    },
    {
      "title": "Culinary Delights: Global Street Food Tour",
      "body": "Embark on a gastronomic adventure and indulge in the vibrant flavors of street food from bustling markets around the world."
    },
    {
      "title": "Into the Wild: Safari Adventures",
      "body": "Experience the thrill of a safari adventure and witness the majesty of wildlife in their natural habitat, from majestic lions to graceful giraffes."
    }
  ]
    ) }  


 insertPostData();


module.exports = router;
